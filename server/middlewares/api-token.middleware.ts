import { NextFunction, Request, Response } from "express";
import AuthService from "../api/auth/auth.service";

class ApiTokenMiddleware {
  //TODO: Validate that the token is present in the user's database registry.
  //this middleware is not working properly!!!!
  public async hasValidRecoveryTokenQuery(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { apiToken } = req.body;
    if (!apiToken) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    try {
      AuthService.checkRecoveryToken(apiToken as string);
    } catch (error) {
      if ((error as any).name === "TokenExpiredError") {
        return res.status(401).send({ message: (error as any).name });
      }
      return res.status(401).send({ message: "Unauthorized" });
    }
    return next();
  }
}

export default new ApiTokenMiddleware();
