import { Router } from "express";
import ProductController from "./product.controller";

const productRouter = Router();
const productController = new ProductController();

productRouter.get("/",  (req, res) =>
productController.getAll(req, res)
);
//devuelve el precio de un dia en especefico pasandole el ID Y la fecha en formato dia/mes/año
productRouter.get("/dailyprice/",  (req, res) =>
productController.getDailyPriceById(req, res)
);
//devuelve el precio de un dia en especefico pasandole la categoria Y la fecha en formato dia/mes/año
productRouter.get("/dailypricebycategory/",  (req, res) =>
productController.getDailyPriceByCategory(req, res)
);
//devuelve todos los precios pasandole el id del producto
productRouter.get("/pricehistory/",  (req, res) =>
productController.getProductPriceHistoryById(req, res)
);
//devuelve todos los precios pasandole la categoria
productRouter.get("/pricehistorybycategory/",  (req, res) =>
productController.getPriceHistoryByCategory(req, res)
);
//devuelve todas las categorias
productRouter.get("/categories/",  (req, res) =>
productController.getCategoryNames(req, res)
);
export default productRouter;
