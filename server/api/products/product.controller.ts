import { Request, Response } from "express";
import BaseController from "../../base/base.controller";
import { Product } from "../../types/interfaces/product.interface";
import productManager from "./product.manager";
import responseService from "../../services/response.service";

export default class ProductController extends BaseController {
  constructor() {
    super(productManager);
  }
  async getDailyPriceById(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const { id } = req.query;
      const { date } = req.query;
      const result = await productManager.getDailyPriceById(id as string,date as string);

      return responseService.success(
        res,
        "Product price history fetched successfully",
        result
      );
    } catch (err) {
      return responseService.error(res, err);
    }
  }
  async getDailyPriceByCategory(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const {category,date } = req.query;
      const result = await productManager.getDailyPriceByCategory(
        category,
        date
      );

      return responseService.success(
        res,
        "Product price history category fetched successfully",
        result
      );
    } catch (err) {
      return responseService.error(res, err);
    }
  }
  async getProductPriceHistoryById(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const { id } = req.query;


      const result = await productManager.getProductPriceHistoryById(id);

      return responseService.success(
        res,
        "Product price history category fetched successfully",
        result
      );
    } catch (err) {
      return responseService.error(res, err);
    }
  }
  async getPriceHistoryByCategory(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const {category } = req.query;

      
      const result = await productManager.getPriceHistoryByCategory(
        category,
        
      );

      return responseService.success(
        res,
        "Product price history category fetched successfully",
        result
      );
    } catch (err) {
      return responseService.error(res, err);
    }
  }
  async getCategoryNames(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {

      
      const result = await productManager.getCategories();

      return responseService.success(
        res,
        "Product price history category fetched successfully",
        result
      );
    } catch (err) {
      return responseService.error(res, err);
    }
  }


}
