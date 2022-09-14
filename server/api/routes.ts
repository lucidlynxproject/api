import { Router } from "express";
import authRouter from "./auth/auth.router";
import tokenRouter from "./token/token.router";
import userRouter from "./user/user.router";
import productRouter from "./products/product.router";
import apiTokenMiddleware from "../middlewares/api-token.middleware";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/token", tokenRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/products", apiTokenMiddleware.hasApiToken, productRouter);

export default apiRouter;
