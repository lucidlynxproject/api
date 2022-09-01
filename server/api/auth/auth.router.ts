import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import AuthController from "./auth.controller";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", (req, res) => authController.login(req, res));
authRouter.post("/register", (req, res) => authController.register(req, res));
authRouter.post("/token", authMiddleware.hasSecretToken, (req, res) =>
  authController.token(req, res)
);
authRouter.post("/reset_password", authMiddleware.isAuthenticated, (req, res) =>
  authController.resetPassword(req, res)
);
authRouter.post("/request_verify", authMiddleware.isAuthenticated, (req, res) =>
  authController.requestVerifyEmail(req, res)
);

authRouter.get("/verify", authMiddleware.hasValidTokenQuery, (req, res) =>
  authController.verifyEmail(req, res)
);

authRouter.post("/request_reset_password", (req, res) =>
  authController.requestResetPassword(req, res)
);
authRouter.post(
  "/reset_forgot_password",
  authMiddleware.hasValidRecoveryTokenQuery,
  (req, res) => authController.resetForgotPassword(req, res)
);

export default authRouter;
