import { Router } from "express";
import authRouter from "./auth/auth.router";
import tokenRouter from "./token/token.router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/token", tokenRouter);

export default apiRouter;
