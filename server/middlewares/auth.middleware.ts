import { NextFunction, Request, Response } from "express";
import AuthService from "../api/auth/auth.service";

class AuthMiddleware {
  public allowWhiteListUrls =
    (whiteList: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const urlParts = req.url.split("/");
      if (whiteList.find((url) => urlParts[1].includes(url))) {
        return next();
      }
      return next();
    };

  public async isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authHeader = req.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    try {
      return next();
    } catch (error) {
      return res
        .status(401)
        .send({ message: `Unauthorized, ${(error as any).name}` });
    }
  }

  public async hasSecretToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      return next();
    }
    return res.status(401).send({ message: "Unauthorized" });
  }

  public async hasValidTokenQuery(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { token } = req.query;
    if (!token) {
      return res.render("errorVerifyEmail");
    }
    try {
      AuthService.checkVerifyEmailToken(token as string);
    } catch (error) {
      if ((error as any).name === "TokenExpiredError") {
        return res.render("VerifyEmailExpired");
      }
      return res.render("errorVerifyEmail");
    }
    return next();
  }

  public async hasValidRecoveryTokenQuery(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { token } = req.body;
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    try {
      AuthService.checkRecoveryToken(token as string);
    } catch (error) {
      if ((error as any).name === "TokenExpiredError") {
        return res.status(401).send({ message: (error as any).name });
      }
      return res.status(401).send({ message: "Unauthorized" });
    }
    return next();
  }
}

export default new AuthMiddleware();
