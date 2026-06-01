import { Router } from "express";
import { db } from "@workspace/db";
import { portfolioTable } from "@workspace/db";
import { CreatePortfolioItemBody } from "@workspace/api-zod";

const router = Router();

router.get("/portfolio", async (req, res) => {
  const items = await db.select().from(portfolioTable);
  res.json(items.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
  })));
});

router.post("/portfolio", async (req, res) => {
  const body = CreatePortfolioItemBody.parse(req.body);
  const [item] = await db.insert(portfolioTable).values({
    title: body.title,
    description: body.description,
    images: body.images ?? [],
    beforeImages: body.beforeImages ?? [],
    videoUrl: body.videoUrl,
    customerName: body.customerName,
  }).returning();

  res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
});

export default router;
