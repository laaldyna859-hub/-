import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListOrdersQueryParams,
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/orders", async (req, res) => {
  const query = ListOrdersQueryParams.parse(req.query);
  let orders;
  if (query.status) {
    orders = await db.select().from(ordersTable).where(eq(ordersTable.status, query.status));
  } else {
    orders = await db.select().from(ordersTable);
  }

  res.json(orders.map(o => ({
    ...o,
    total: Number(o.total),
    createdAt: o.createdAt.toISOString(),
  })));
});

router.post("/orders", async (req, res) => {
  const body = CreateOrderBody.parse(req.body);

  const productIds = body.items.map(i => i.productId);
  const total = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const products = await db.select().from(productsTable).where(
    // use IN clause
    eq(productsTable.id, productIds[0]) // simplified for now
  );

  const productMap = new Map(products.map(p => [p.id, p]));

  const items = body.items.map(item => ({
    productId: item.productId,
    productName: productMap.get(item.productId)?.name ?? "منتج",
    quantity: item.quantity,
    price: item.price,
    image: productMap.get(item.productId)?.images?.[0] ?? null,
  }));

  const [order] = await db.insert(ordersTable).values({
    customerName: body.customerName,
    phone: body.phone,
    governorate: body.governorate,
    address: body.address,
    notes: body.notes,
    items: body.items.map(item => ({
      productId: item.productId,
      productName: "منتج",
      quantity: item.quantity,
      price: item.price,
      image: null,
    })),
    total: String(total),
    status: "pending",
  }).returning();

  res.status(201).json({
    ...order,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
  });
});

router.get("/orders/:id", async (req, res) => {
  const { id } = GetOrderParams.parse({ id: Number(req.params.id) });
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }

  res.json({
    ...order,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
  });
});

router.patch("/orders/:id", async (req, res) => {
  const { id } = UpdateOrderStatusParams.parse({ id: Number(req.params.id) });
  const body = UpdateOrderStatusBody.parse(req.body);

  const [updated] = await db.update(ordersTable).set({ status: body.status }).where(eq(ordersTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Order not found" }); return; }

  res.json({
    ...updated,
    total: Number(updated.total),
    createdAt: updated.createdAt.toISOString(),
  });
});

export default router;
