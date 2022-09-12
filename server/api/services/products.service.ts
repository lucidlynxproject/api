import l from "../../common/logger";

import { Product, IProductModel } from "../models/product";

export class ProductsService {
  async getAll(): Promise<IProductModel[]> {
    l.info("fetch all products");
    const products = (await Product.find(
      null,
      "-_id -__v"
    ).lean()) as IProductModel[];
    return products;
  }

  async getById(id: number): Promise<IProductModel> {
    l.info(`fetch product with id ${id}`);
    const product = (await Product.findOne(
      { id: id },
      "-_id -__v"
    ).lean()) as IProductModel;
    return product;
  }

  async create(data: IProductModel): Promise<IProductModel> {
    l.info(`create product with data ${data}`);
    const product = new Product(data);
    const doc = (await product.save()) as IProductModel;
    return doc;
  }
  async delete(id: number): Promise<IProductModel> {
    l.info(`delete product with id ${id}`);
    const product = (await Product.findOneAndDelete(
      { id: id }
    ).lean()) as IProductModel;
    return product;
  }

}

export default new ProductsService();
