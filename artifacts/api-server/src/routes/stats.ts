import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, ordersTable, categoriesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/stats/summary", async (req, res) => {
  const [products] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(productsTable);
  const [categories] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(categoriesTable);
  const [orders] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(ordersTable);
  const [pending] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(ordersTable).where(eq(ordersTable.status, "pending"));
  const [revenue] = await db.select({ total: sql<number>`cast(coalesce(sum(cast(total as numeric)), 0) as float)` }).from(ordersTable).where(eq(ordersTable.status, "delivered"));

  res.json({
    totalProducts: products.count,
    totalOrders: orders.count,
    pendingOrders: pending.count,
    totalRevenue: revenue.total ?? 0,
    totalCategories: categories.count,
  });
});

export default router;
