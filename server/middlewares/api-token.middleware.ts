import { NextFunction, Request, Response } from "express";
import queryParser from "../services/query-parser.service";
import userModel from "../api/user/user.model";

class ApiTokenMiddleware {
  public async hasApiToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    const filters = queryParser.getFilters({ apiToken: token });
    const foundUser = await userModel.getOne(filters);

    if (!token || !foundUser) {
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
}

export default new ApiTokenMiddleware();
