import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { CreateCategoryBody } from "@workspace/api-zod";

const router = Router();

router.get("/categories", async (req, res) => {
  const categories = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      icon: categoriesTable.icon,
      image: categoriesTable.image,
      productCount: sql<number>`cast(count(${productsTable.id}) as int)`,
    })
    .from(categoriesTable)
    .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id);

  res.json(categories);
});

router.post("/categories", async (req, res) => {
  const body = CreateCategoryBody.parse(req.body);
  const [category] = await db.insert(categoriesTable).values({
    name: body.name,
    slug: body.slug,
    icon: body.icon,
    image: body.image,
  }).returning();

  res.status(201).json({ ...category, productCount: 0 });
});

export default router;
