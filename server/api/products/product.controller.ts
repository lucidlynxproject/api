import { Request, Response } from "express";
import BaseController from "../../base/base.controller";
import { Product } from "../../types/interfaces/product.interface";
import productManager from "./product.manager";
import responseService from "../../services/response.service";

export default class ProductController extends BaseController {
  constructor() {
    super(productManager);
  }
  async getPriceHistoryByCategory( req: Request, res: Response ): Promise<Response<any, Record<string, any>>> {
       try {
         const { id,category,filters } = req.params;
         const result = await productManager.getPriceHistoryByCategory(id,category,filters);
         
         return responseService.success(res, "Product price history category fetched successfully", result);
       }catch (err) {
        return responseService.error(res, err);
      }
   }
  async getPriceHistoryBySection( req: Request, res: Response ): Promise<Response<any, Record<string, any>>> {
       try {
        const {filters } = req.params;
        const options:string[]=[];
        options.push(req.params.id);
        options.push(req.params.to);
        options.push(req.params.from);
        options.push(req.params.section);
        const result = await productManager.getPriceHistoryBySection(options,filters);
        
        return responseService.success(res, "Product price history category fetched successfully", result);
       } catch (err) {
        return responseService.error(res, err);
      }
   }
   async getPriceHistoryById( req: Request, res: Response ): Promise<Response<any, Record<string, any>>> {
       try {
        const {filters } = req.params;
        const options:string[]=[];
        options.push(req.params.id);
        options.push(req.params.to);
        options.push(req.params.from);
        const result = await productManager.getPriceHistoryById(options,filters);
        
        return responseService.success(res, "Product price history category fetched successfully", result);
       } catch (err) {
        return responseService.error(res, err);
      }
   }
   async getDailyPriceByCategory( req: Request, res: Response ): Promise<Response<any, Record<string, any>>> {
       try {
        const { id,section,filters } = req.params;
        const result = await productManager.getPriceHistoryByCategory(id,section,filters);
        
        return responseService.success(res, "Product price history category fetched successfully", result);
       }catch (err) {
        return responseService.error(res, err);
      }
   }
   async getDailyPriceBySection( req: Request, res: Response ): Promise<Response<any, Record<string, any>>> {
       try {
        const { id,section,filters } = req.params;
        const result = await productManager.getPriceHistoryByCategory(id,section,filters);
        
        return responseService.success(res, "Product price history category fetched successfully", result);
       } catch (err) {
        return responseService.error(res, err);
      }
   }
   async getProductPriceHistory( req: Request, res: Response ): Promise<Response<any, Record<string, any>>> {
     try {
       const { id,filters } = req.params;
       const result = await productManager.getProductPriceHistory(id,filters);
       
       return responseService.success(res, "Product price history fetched successfully", result);
     } catch (err) {
       return responseService.error(res, err);
     }
   }
  
}
