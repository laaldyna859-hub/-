import { pgTable, serial, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 12, scale: 2 }),
  categoryId: integer("category_id").notNull(),
  images: text("images").array().default([]).notNull(),
  sizes: text("sizes"),
  materials: text("materials"),
  colors: text("colors"),
  executionDays: integer("execution_days"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isOffer: boolean("is_offer").default(false).notNull(),
  discountPercent: integer("discount_percent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
