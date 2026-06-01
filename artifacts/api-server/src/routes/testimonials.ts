import { Router } from "express";
import { db } from "@workspace/db";
import { testimonialsTable } from "@workspace/db";
import { CreateTestimonialBody } from "@workspace/api-zod";

const router = Router();

router.get("/testimonials", async (req, res) => {
  const items = await db.select().from(testimonialsTable);
  res.json(items.map(i => ({
    ...i,
    createdAt: i.createdAt.toISOString(),
  })));
});

router.post("/testimonials", async (req, res) => {
  const body = CreateTestimonialBody.parse(req.body);
  const [item] = await db.insert(testimonialsTable).values({
    customerName: body.customerName,
    rating: body.rating,
    comment: body.comment,
    image: body.image,
  }).returning();

  res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
});

export default router;
