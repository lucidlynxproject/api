import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import UserController from "./user.controller";

const userRouter = Router();
const userController = new UserController();

userRouter.get("/:id", authMiddleware.isAuthenticated, (req, res) =>
  userController.getById(req, res)
);

export default userRouter;
