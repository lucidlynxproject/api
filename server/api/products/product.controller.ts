import { Request, Response } from "express";
import BaseController from "../../base/base.controller";
import { Product } from "../../types/interfaces/product.interface";
import productManager from "./product.manager";
import responseService from "../../services/response.service";

export default class ProductController extends BaseController {
  constructor() {
    super(productManager);
  }
  async getProductPriceHistory(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const { id } = req.params;
      const result = await productManager.getProductPriceHistory(id);

      return responseService.success(
        res,
        "Product price history fetched successfully",
        result
      );
    } catch (err) {
      return responseService.error(res, err);
    }
  }
}
