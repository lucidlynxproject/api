import { ObjectID } from "bson";
import BaseManager from "../../base/base.manager";
import { Product } from "../../types/interfaces/product.interface";
import productModel from "../models/product";
import product_changes from "../models/product_changes";
export class ProductManager extends BaseManager<Product> {
  getDailyPriceById(id: string, filters: string) {
    return productModel
    .getAllPopulated({ _id:id }, "", { 'product_changes.date':{
      $gte: new Date().setHours(0,0,0,0),
      $lte: new Date().setHours(23,59,59,999)
    } }, ["product_changes"])
    .catch((err) => {
      throw err;
    });
  }

  getDailyPriceBySection( section: any) {
    return productModel
    .getAllPopulated({ }, "", {  'product_changes.date':{
      $gte: new Date().setHours(0,0,0,0),
      $lte: new Date().setHours(23,59,59,999)
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
      $gte: new Date().setHours(0,0,0,0),
      $lte: new Date().setHours(23,59,59,999)
    },'category.name':{
      $eq: category
    } }, ["product_changes"]).then((data:any)=>{
      let result = data;
       result.product_changes = result.product_changes.filter((item:any)=>{
        let start= new Date();
        start.setHours(0,0,0,0);
        let end= new Date();
        end.setHours(23,59,59,999);
        return item.date  >=start  && end <=item.date;
      })
      return result;
    })
    .catch((err) => {
      throw err;
    });
  }
/*YASSS*/  getPriceHistoryByCategory(id: any, filters: any) {
    return productModel
      .getAllPopulated({ category:id }, "", { filters }, ["product_changes"])
      .catch((err) => {
        throw err;
      });
  }
/*YASSS*/  getProductPriceGHistoryBySection(id: any, filters: any): any {
    return productModel
      .getAllPopulated({ _id: id }, "", filters, ["product_changes"])
      .catch((err) => {
        throw err;
      });
  }
/*YASSS*/  getProductPriceHistoryById(id: any, filters: any): any {
    return productModel
      .getAllPopulated({ _id: id }, "", filters, ["product_changes"])
      .catch((err) => {
        throw err;
      });
  }
  constructor() {
    super(productModel);
  }
}

export default new ProductManager();
