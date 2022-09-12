import BaseModel from "../../base/base.model";
import MongooseRepository from "../../repositories/mongoose/mongoose.repository";
import Product_ChangesSchema from "../../repositories/mongoose/schemas/product_changes.schema";
import { Product_Changes } from "../../types/interfaces/product_changes.interface";

class Product_ChangesModel extends BaseModel<Product_Changes, Product_Changes> {}

export default new Product_ChangesModel(new MongooseRepository("Product_Changes", Product_ChangesSchema));
