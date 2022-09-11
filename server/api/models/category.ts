import BaseModel from "../../base/base.model";
import MongooseRepository from "../../repositories/mongoose/mongoose.repository";
import CategorySchema from "../../repositories/mongoose/schemas/category.schema";
import { Category } from "../../types/interfaces/category.interface";

class CategoryModel extends BaseModel<Category, Category> {}

export default new CategoryModel(new MongooseRepository("Category", CategorySchema));
