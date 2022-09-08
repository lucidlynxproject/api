import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import TokenController from "./token.controller";

const tokenRouter = Router();
const tokenController = new TokenController();

tokenRouter.post(
  "/generate_token",
  authMiddleware.isAuthenticated,
  (req, res) => tokenController.generateToken(req, res)
);

tokenRouter.get("/request_token", authMiddleware.isAuthenticated, (req, res) =>
  tokenController.requestToken(req, res)
);

export default tokenRouter;
