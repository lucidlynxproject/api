import { Request, Response } from "express";
import BaseController from "../../base/base.controller";
import { User } from "../../types/interfaces/user.interface";
import userManager from "./user.manager";

export default class UserController extends BaseController {
  constructor() {
    super(userManager);
  }
}
