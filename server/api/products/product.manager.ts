import BaseManager from "../../base/base.manager";
import { Product } from "../../types/interfaces/product.interface";
import productModel from "../models/product";

export class ProductManager extends BaseManager<Product> {
  getPriceHistoryById(options: string[], filters: string) {
    throw new Error("Method not implemented.");
  }
  getPriceHistoryBySection( options: string[], filters: string) {
    throw new Error("Method not implemented.");
  }
  getPriceHistoryByCategory(id: string,category:string,options:{}) {
    return productModel.getAllPopulated({_id: id,category:category},"",options,["product_changes"]).catch((err) => {
      throw err;
    });
  }
  getProductPriceHistory(id: string,options:{}):any {

    return productModel.getAllPopulated({_id: id},"",options,["product_changes"]).catch((err) => {
      throw err;
    });
  }
  constructor() {
    super(productModel);
  }
}

export default new ProductManager();
