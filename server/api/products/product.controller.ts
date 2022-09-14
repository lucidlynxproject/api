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
      const { id, filters } = req.params;
      const result = await productManager.getDailyPriceById(id, filters);

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
      const {section, filters } = req.params;
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
      const { id, category, filters } = req.params;
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
      const { filters } = req.params;
      const options: any[] = [];

      options.push(req.params.section);
      const result = await productManager.getPriceHistoryByCategory(
        options,
        filters
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
      const { filters } = req.params;
      const options: any[] = [];
      options.push(req.params.id);

      const result = await productManager.getProductPriceHistoryById(options, filters);

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
      const { id,filters } = req.params;



      const result = await productManager.getProductPriceGHistoryBySection(
        id,
        filters
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
