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
      const { id } = req.body;
      console.log(req.body);
      const result = await productManager.getDailyPriceById(id);

      return responseService.success(
        res,
        "Product price history fetched successfully",
        result
      );
    } catch (err) {
      return responseService.error(res, err);
    }
  }
  async getDailyPriceBySection(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const {section} = req.params;
      const result = await productManager.getDailyPriceBySection(
        section
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
  async getDailyPriceByCategory(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const {category } = req.params;
      const result = await productManager.getDailyPriceByCategory(
        category
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
  async getPriceHistoryByCategory(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const { category } = req.params;

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

  async getProductPriceHistoryById(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const { id } = req.params;


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
  async getPriceHistoryBySection(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const { section } = req.params;



      const result = await productManager.getProductPriceGHistoryBySection(
        section
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
}
