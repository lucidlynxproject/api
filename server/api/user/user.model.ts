import BaseModel from "../../base/base.model";
import MongooseRepository from "../../repositories/mongoose/mongoose.repository";
import UserSchema from "../../repositories/mongoose/schemas/user.schema";
import { User } from "../../types/interfaces/user.interface";

class UserModel extends BaseModel<User, User> {}

export default new UserModel(new MongooseRepository("users", UserSchema));
