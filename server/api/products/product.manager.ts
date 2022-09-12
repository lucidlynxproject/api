import BaseManager from "../../base/base.manager";
import { Product } from "../../types/interfaces/product.interface";
import productModel from "../models/product";

export class ProductManager extends BaseManager<Product> {
  getProductPriceHistory(id: string) {

    return productModel.getAllPopulated({_id: id},"",{},["product_changes"]).catch((err) => {
      throw err;
    });
  }
  constructor() {
    super(productModel);
  }
}

export default new ProductManager();
