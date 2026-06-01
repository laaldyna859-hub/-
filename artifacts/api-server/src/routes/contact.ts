import { Router } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router = Router();

router.post("/contact", async (req, res) => {
  const body = SubmitContactBody.parse(req.body);
  const [item] = await db.insert(contactsTable).values({
    name: body.name,
    phone: body.phone,
    email: body.email,
    message: body.message,
  }).returning();

  res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
});

export default router;
