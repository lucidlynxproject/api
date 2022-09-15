import { Router } from "express";
import ProductController from "./product.controller";

const productRouter = Router();
const productController = new ProductController();

productRouter.get("/", (req, res) => productController.getAll(req, res));
productRouter.get("/history/:id", (req, res) =>
  productController.getProductPriceHistory(req, res)
);

export default productRouter;
