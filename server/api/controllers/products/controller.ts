import ProductsService from "../../services/products.service";
import { Request, Response, NextFunction } from "express";

export class Controller {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await ProductsService.getAll();
      return res.status(200).json(docs);
    } catch (err) {
      return next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await ProductsService.getById(parseInt(req.params.id));
      if (doc) {
        return res.status(200).json(doc);
      }
      const errors = [{ message: "Product not found" }];
      return res.status(404).json({ errors });
    } catch (err) {
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await ProductsService.create(req.body);
      return res.status(201).location(`/api/v1/products/${doc.id}`).end();
    } catch (err) {
      return next(err);
    }
  }
}
export default new Controller();
