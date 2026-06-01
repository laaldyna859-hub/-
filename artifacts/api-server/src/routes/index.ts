import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import offersRouter from "./offers";
import portfolioRouter from "./portfolio";
import testimonialsRouter from "./testimonials";
import contactRouter from "./contact";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(ordersRouter);
router.use(offersRouter);
router.use(portfolioRouter);
router.use(testimonialsRouter);
router.use(contactRouter);
router.use(statsRouter);

export default router;
