import { Router } from "express";
import ProductController from "./product.controller";

const productRouter = Router();
const productController = new ProductController();

productRouter.get("/",  (req, res) =>
productController.getAll(req, res)
);

productRouter.get("/dailyprice/",  (req, res) =>
productController.getDailyPriceById(req, res)
);

productRouter.get("/dailypricebySection/",  (req, res) =>
productController.getDailyPriceBySection(req, res)
);
productRouter.get("/dailypricebyCategory/",  (req, res) =>
productController.getDailyPriceByCategory(req, res)
);
productRouter.get("/pricehistory/",  (req, res) =>
productController.getProductPriceHistoryById(req, res)
);
productRouter.get("/pricehistorybysection/",  (req, res) =>
productController.getPriceHistoryBySection(req, res)
);
productRouter.get("/pricehistorybycategory/",  (req, res) =>
productController.getPriceHistoryByCategory(req, res)
);
export default productRouter;
