import { ObjectID } from "bson";
import BaseManager from "../../base/base.manager";
import { Product } from "../../types/interfaces/product.interface";
import productModel from "../models/product";
import product_changes from "../models/product_changes";
export class ProductManager extends BaseManager<Product> {
  getDailyPriceById(id: string) {
    return productModel
    .getAllPopulated({$and:[
     { _id: id,},
      {'product_changes.date':{
        $eq: new Date().toLocaleDateString('pt-Pt')
      }}
    ]}, "",{}, ["product_changes"])
    .catch((err) => {
      throw err;
    });
  }

  getDailyPriceBySection( section: any) {
    return productModel
    .getAllPopulated({ }, "", {  'product_changes.date':{
      $eq: new Date().toLocaleDateString('pt-Pt')
    },'section.name':{
      $eq: section
    } }, ["product_changes"])
    .catch((err) => {
      throw err;
    });
  }
  getDailyPriceByCategory( category: any) {
    return productModel
    .getAllPopulated({}, "", {  'product_changes.date':{
      $eq: new Date().toLocaleDateString('pt-Pt')
    },'category.name':{
      $eq: category
    } }, ["product_changes"])
    .catch((err) => {
      throw err;
    });
  }
/*YASSS*/  getPriceHistoryByCategory(category: any) {
    return productModel
      .getAllPopulated({}, "", {'category.name':{
        $eq: category
      }}, ["product_changes"])
      .catch((err) => {
        throw err;
      });
  }
/*YASSS*/  getProductPriceGHistoryBySection(filters: any): any {
    return productModel
      .getAllPopulated({'section.name':{
        $eq: filters
      }}, "", {}, ["product_changes"])
      .catch((err) => {
        throw err;
      });
  }
/*YASSS*/  getProductPriceHistoryById(id: any): any {
    return productModel
      .getAllPopulated({ _id: id }, "", {}, ["product_changes"])
      .catch((err) => {
        throw err;
      });
  }
  constructor() {
    super(productModel);
  }
}

export default new ProductManager();
