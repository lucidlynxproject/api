import { Router } from "express";
import authRouter from "./auth/auth.router";
import tokenRouter from "./token/token.router";
import userRouter from "./user/user.router";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/token", tokenRouter);
apiRouter.use("/user", userRouter);

export default apiRouter;
