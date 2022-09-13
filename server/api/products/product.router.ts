import { Router } from "express";
import ProductController from "./product.controller";

const productRouter = Router();
const productController = new ProductController();

productRouter.get("/",  (req, res) =>
productController.getAll(req, res)
);

productRouter.get("/dailyPriceByProduct/:id",  (req, res) =>
productController.getProductPriceHistory(req, res)
);

productRouter.get("/dailyPriceBySection/:id",  (req, res) =>
productController.getDailyPriceBySection(req, res)
);
productRouter.get("/dailyPriceByCategory/:id",  (req, res) =>
productController.getDailyPriceByCategory(req, res)
);
productRouter.get("/priceHistoryById/:id",  (req, res) =>
productController.getPriceHistoryById(req, res)
);
productRouter.get("/priceHistoryBySection/:id",  (req, res) =>
productController.getPriceHistoryBySection(req, res)
);
productRouter.get("/priceHistoryByCategory/:id",  (req, res) =>
productController.getPriceHistoryByCategory(req, res)
);
export default productRouter;
