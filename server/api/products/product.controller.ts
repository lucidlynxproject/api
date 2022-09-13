import { Request, Response } from "express";
import BaseController from "../../base/base.controller";
import { Product } from "../../types/interfaces/product.interface";
import productManager from "./product.manager";

export default class ProductController extends BaseController {
  constructor() {
    super(productManager);
  }
}
