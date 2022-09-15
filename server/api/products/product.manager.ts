import BaseManager from "../../base/base.manager";
import { Product } from "../../types/interfaces/product.interface";
import productModel from "../models/product";
import product_changes from "../models/product_changes";
import section from "../models/section";
import Category from "../models/category";
export class ProductManager extends BaseManager<Product> {
  //pasas el id del producto ObjectID y el la fecha dia/mes/año-----------------ITWORKS
  getDailyPriceById(id: string, date: string) {
    return productModel
      .getAllPopulated({ _id: id }, "", {}, ["product_changes"])
      .then((products: any) => {
        let result = products;

        result.forEach((res: any) => {
          res.product_changes = res.product_changes.filter((change: any) => {
            return change.createdAt.toLocaleDateString("pt-Pt") == date;
          });
        });
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }
  /*IT WORKS          ------------> Pasas el nombre de la categoria y la fecha dia/mes/año*/
  async getDailyPriceByCategory(category: any, date: any) {
    let categoryid = (await Category.getOne({ name: category })) as any;
    return productModel
      .getAllPopulated({ category: categoryid._id }, "", {}, [
        "product_changes",
        "category",
      ])
      .then((data) => {
        let result = data;

        result.forEach((res: any) => {
          res.product_changes = res.product_changes.filter((change: any) => {
            return change.createdAt.toLocaleDateString("pt-Pt") == date;
          });
        });
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }

  /*IT WORKS         pasas la id del producto e ya*/
  getProductPriceHistoryById(id: any): any {
    return productModel
      .getAllPopulated({ _id: id }, "", {}, ["product_changes"])
      .catch((err) => {
        throw err;
      });
  }
  /*IT WORKS pasas el nombre de la categoria y ya*/ async getPriceHistoryByCategory(
    category: any
  ): Promise<any> {
    let categoryid = (await Category.getOne({ name: category })) as any;
    return productModel
      .getAllPopulated({ category: categoryid._id }, "", {}, [
        "product_changes",
        "category",
      ])
      .catch((err) => {
        throw err;
      });
  }
  //devuelve el array de los nombres de categorias
  getCategories() {
    return Category.getAll({})
      .then((data) => {
        return data.map((data) => {
          return data.name;
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  constructor() {
    super(productModel);
  }
}

export default new ProductManager();
