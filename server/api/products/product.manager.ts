import { ObjectID } from "bson";
import BaseManager from "../../base/base.manager";
import { Product } from "../../types/interfaces/product.interface";
import productModel from "../products/product.model";

export class ProductManager extends BaseManager<Product> {
  constructor() {
    super(productModel);
  }

  getDailyPriceById(id: string) {
    return productModel
      .getAllPopulated(
        {
          $and: [
            { _id: id },
            {
              "product_changes.date": {
                $eq: new Date().toLocaleDateString("pt-Pt"),
              },
            },
          ],
        },
        "",
        {},
        ["product_changes"]
      )
      .catch((err) => {
        throw err;
      });
  }

  getDailyPriceBySection(section: any) {
    return productModel
      .getAllPopulated(
        {},
        "",
        {
          "product_changes.date": {
            $eq: new Date().toLocaleDateString("pt-Pt"),
          },
          "section.name": {
            $eq: section,
          },
        },
        ["product_changes"]
      )
      .catch((err) => {
        throw err;
      });
  }

  getDailyPriceByCategory(category: any) {
    return productModel
      .getAllPopulated(
        {},
        "",
        {
          "product_changes.date": {
            $eq: new Date().toLocaleDateString("pt-Pt"),
          },
          "category.name": {
            $eq: category,
          },
        },
        ["product_changes"]
      )
      .catch((err) => {
        throw err;
      });
  }

  getPriceHistoryByCategory(category: any) {
    return productModel
      .getAllPopulated(
        {},
        "",
        {
          "category.name": {
            $eq: category,
          },
        },
        ["product_changes"]
      )
      .catch((err) => {
        throw err;
      });
  }

  getProductPriceGHistoryBySection(filters: any): any {
    return productModel
      .getAllPopulated(
        {
          "section.name": {
            $eq: filters,
          },
        },
        "",
        {},
        ["product_changes"]
      )
      .catch((err) => {
        throw err;
      });
  }

  getProductPriceHistoryById(id: any): any {
    return productModel
      .getAllPopulated({ _id: id }, "", {}, ["product_changes"])
      .catch((err) => {
        throw err;
      });
  }

  getDaily(): any {
    return productModel
      .getAllPopulated(
        {
          date: {
            $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
            $lt: new Date(),
          },
        },
        "",
        {},
        ["product_changes"]
      )
      .catch((err) => {
        throw err;
      });
  }
}

export default new ProductManager();
