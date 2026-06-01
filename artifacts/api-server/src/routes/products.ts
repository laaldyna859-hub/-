import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq, like, and, gte, lte, desc, asc, sql } from "drizzle-orm";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/products", async (req, res) => {
  const query = ListProductsQueryParams.parse(req.query);
  const conditions = [];

  if (query.category) {
    const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, query.category)).limit(1);
    if (cat.length > 0) conditions.push(eq(productsTable.categoryId, cat[0].id));
  }
  if (query.search) {
    conditions.push(like(productsTable.name, `%${query.search}%`));
  }
  if (query.minPrice !== undefined) {
    conditions.push(gte(productsTable.price, String(query.minPrice)));
  }
  if (query.maxPrice !== undefined) {
    conditions.push(lte(productsTable.price, String(query.maxPrice)));
  }
  if (query.featured !== undefined) {
    conditions.push(eq(productsTable.isFeatured, query.featured));
  }
  if (query.offer !== undefined) {
    conditions.push(eq(productsTable.isOffer, query.offer));
  }

  let orderBy;
  if (query.sort === "price_asc") orderBy = asc(productsTable.price);
  else if (query.sort === "price_desc") orderBy = desc(productsTable.price);
  else orderBy = desc(productsTable.createdAt);

  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      originalPrice: productsTable.originalPrice,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      images: productsTable.images,
      sizes: productsTable.sizes,
      materials: productsTable.materials,
      colors: productsTable.colors,
      executionDays: productsTable.executionDays,
      isFeatured: productsTable.isFeatured,
      isOffer: productsTable.isOffer,
      discountPercent: productsTable.discountPercent,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(orderBy);

  res.json(products.map(p => ({
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    createdAt: p.createdAt.toISOString(),
  })));
});

router.get("/products/featured", async (req, res) => {
  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      originalPrice: productsTable.originalPrice,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      images: productsTable.images,
      sizes: productsTable.sizes,
      materials: productsTable.materials,
      colors: productsTable.colors,
      executionDays: productsTable.executionDays,
      isFeatured: productsTable.isFeatured,
      isOffer: productsTable.isOffer,
      discountPercent: productsTable.discountPercent,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.isFeatured, true))
    .orderBy(desc(productsTable.createdAt))
    .limit(12);

  res.json(products.map(p => ({
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    createdAt: p.createdAt.toISOString(),
  })));
});

router.get("/products/:id", async (req, res) => {
  const { id } = GetProductParams.parse({ id: Number(req.params.id) });
  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      originalPrice: productsTable.originalPrice,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      images: productsTable.images,
      sizes: productsTable.sizes,
      materials: productsTable.materials,
      colors: productsTable.colors,
      executionDays: productsTable.executionDays,
      isFeatured: productsTable.isFeatured,
      isOffer: productsTable.isOffer,
      discountPercent: productsTable.discountPercent,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, id))
    .limit(1);

  if (!products.length) { res.status(404).json({ error: "Product not found" }); return; }
  const p = products[0];
  res.json({
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    createdAt: p.createdAt.toISOString(),
  });
});

router.post("/products", async (req, res) => {
  const body = CreateProductBody.parse(req.body);
  const [product] = await db.insert(productsTable).values({
    name: body.name,
    description: body.description,
    price: String(body.price),
    originalPrice: body.originalPrice !== undefined ? String(body.originalPrice) : undefined,
    categoryId: body.categoryId,
    images: body.images ?? [],
    sizes: body.sizes,
    materials: body.materials,
    colors: body.colors,
    executionDays: body.executionDays,
    isFeatured: body.isFeatured ?? false,
    isOffer: body.isOffer ?? false,
    discountPercent: body.discountPercent,
  }).returning();

  res.status(201).json({
    ...product,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    categoryName: null,
    createdAt: product.createdAt.toISOString(),
  });
});

router.patch("/products/:id", async (req, res) => {
  const { id } = UpdateProductParams.parse({ id: Number(req.params.id) });
  const body = UpdateProductBody.parse(req.body);

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.price !== undefined) updateData.price = String(body.price);
  if (body.originalPrice !== undefined) updateData.originalPrice = String(body.originalPrice);
  if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
  if (body.images !== undefined) updateData.images = body.images;
  if (body.sizes !== undefined) updateData.sizes = body.sizes;
  if (body.materials !== undefined) updateData.materials = body.materials;
  if (body.colors !== undefined) updateData.colors = body.colors;
  if (body.executionDays !== undefined) updateData.executionDays = body.executionDays;
  if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
  if (body.isOffer !== undefined) updateData.isOffer = body.isOffer;
  if (body.discountPercent !== undefined) updateData.discountPercent = body.discountPercent;

  const [updated] = await db.update(productsTable).set(updateData).where(eq(productsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Product not found" }); return; }

  res.json({
    ...updated,
    price: Number(updated.price),
    originalPrice: updated.originalPrice ? Number(updated.originalPrice) : null,
    categoryName: null,
    createdAt: updated.createdAt.toISOString(),
  });
});

router.delete("/products/:id", async (req, res) => {
  const { id } = DeleteProductParams.parse({ id: Number(req.params.id) });
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.status(204).send();
});

export default router;
