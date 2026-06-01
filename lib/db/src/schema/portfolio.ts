import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const portfolioTable = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  images: text("images").array().default([]).notNull(),
  beforeImages: text("before_images").array().default([]).notNull(),
  videoUrl: text("video_url"),
  customerName: text("customer_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPortfolioSchema = createInsertSchema(portfolioTable).omit({ id: true, createdAt: true });
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type PortfolioItem = typeof portfolioTable.$inferSelect;
