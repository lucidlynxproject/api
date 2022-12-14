import { Request, Response } from "express";
import responseService from "../../services/response.service";
import tokenManager from "./token.manager";

export default class TokenController {
  public async generateToken(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { email } = req.body;
    if (!email) {
      return responseService.error(res, "Missing fields");
    }
    try {
      const result = await tokenManager.generateToken(email);
      if (result.error) {
        return responseService.error(res, result.error);
      }
      return responseService.success(
        res,
        "Token generated successfully",
        result.data
      );
    } catch (err) {
      return responseService.error(res, err);
    }
  }
}
