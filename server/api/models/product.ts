import BaseModel from "../../base/base.model";
import MongooseRepository from "../../repositories/mongoose/mongoose.repository";
import ProductSchema from "../../repositories/mongoose/schemas/product.schema";
import { Product } from "../../types/interfaces/product.interface";

class ProductModel extends BaseModel<Product, Product> {}

export default new ProductModel(new MongooseRepository("Product", ProductSchema));
