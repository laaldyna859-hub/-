# معرض الأثاث الفاخر — Luxury Furniture Store

A full Arabic RTL e-commerce web app for a furniture showroom, built with React + Vite frontend and Express/PostgreSQL backend.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/furniture-store run dev` — run the frontend (port 23155)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, Framer Motion, wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Cart: React Context + localStorage (no zustand — see Gotchas)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle table definitions (categories, products, orders, offers, portfolio, testimonials, contacts)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/furniture-store/src/` — React frontend
  - `src/pages/` — all page components
  - `src/components/` — Navbar, Footer, Layout, ProductCard
  - `src/hooks/use-cart.tsx` — CartProvider + useCart hook (context-based)

## Architecture decisions

- All text and UI is Arabic RTL (`dir="rtl"`, `lang="ar"` on HTML element)
- Cart state managed via React Context + localStorage (no external state library)
- WhatsApp integration on checkout and product detail pages via `wa.me` links
- Orders saved to DB on checkout for admin visibility
- Admin panel at `/admin` for product/order/offer management

## Product

- Homepage with hero, category grid, featured products, "why us", testimonials
- Products page with search, category filter, price filter, sort
- Product detail with image gallery, specs, WhatsApp inquiry, add-to-cart
- Shopping cart with quantity controls
- Checkout form → WhatsApp order or system order
- Portfolio (before/after photos)
- Offers/discounts page
- About & Contact pages
- Admin dashboard with stats, product CRUD, order management, offer management

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- **Do NOT use zustand** in the furniture-store frontend — it causes a duplicate React instance error with `@tanstack/react-query`. Use React Context instead.
- After any schema change in `lib/db/src/schema/`, run `pnpm run typecheck:libs` before typechecking `api-server`, otherwise you get "no exported member" errors.
- `pnpm --filter @workspace/furniture-store add <pkg>` will fail if the package isn't in the catalog. Use a full version string like `^5.0.0`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
