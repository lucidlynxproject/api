import BaseManager from "../../base/base.manager";
import { Product } from "../../types/interfaces/product.interface";
import productModel from "../models/product";

export class ProductManager extends BaseManager<Product> {
  constructor() {
    super(productModel);
  }
}

export default new ProductManager();
