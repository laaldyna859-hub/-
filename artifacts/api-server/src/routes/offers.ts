import { Router } from "express";
import { db } from "@workspace/db";
import { offersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateOfferBody,
  UpdateOfferParams,
  UpdateOfferBody,
  DeleteOfferParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/offers", async (req, res) => {
  const offers = await db.select().from(offersTable);
  res.json(offers.map(o => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
  })));
});

router.post("/offers", async (req, res) => {
  const body = CreateOfferBody.parse(req.body);
  const [offer] = await db.insert(offersTable).values({
    title: body.title,
    description: body.description,
    discountPercent: body.discountPercent,
    image: body.image,
    isActive: body.isActive ?? true,
    validUntil: body.validUntil,
  }).returning();

  res.status(201).json({ ...offer, createdAt: offer.createdAt.toISOString() });
});

router.patch("/offers/:id", async (req, res) => {
  const { id } = UpdateOfferParams.parse({ id: Number(req.params.id) });
  const body = UpdateOfferBody.parse(req.body);

  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.discountPercent !== undefined) updateData.discountPercent = body.discountPercent;
  if (body.image !== undefined) updateData.image = body.image;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;
  if (body.validUntil !== undefined) updateData.validUntil = body.validUntil;

  const [updated] = await db.update(offersTable).set(updateData).where(eq(offersTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Offer not found" }); return; }

  res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
});

router.delete("/offers/:id", async (req, res) => {
  const { id } = DeleteOfferParams.parse({ id: Number(req.params.id) });
  await db.delete(offersTable).where(eq(offersTable.id, id));
  res.status(204).send();
});

export default router;
