import BaseManager from "../../base/base.manager";
import { User } from "../../types/interfaces/user.interface";
import userModel from "./user.model";

export class UserManager extends BaseManager<User> {
  constructor() {
    super(userModel);
  }
}

export default new UserManager();
