import { Request, Response } from "express";
import responseService from "../../services/response.service";
import { User } from "../../types/interfaces/user.interface";
import authManager from "./auth.manager";
import AuthService from "./auth.service";

export default class AuthController {
  public async login(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { email, password } = req.body;
    if (!email || !password) {
      return responseService.error(res, "Missing fields");
    }

    try {
      const result = await authManager.login(email, password);
      if (result.error) {
        return responseService.error(res, result.error);
      }
      return responseService.success(
        res,
        "User logged successfully",
        result.data
      );
    } catch (err) {
      return responseService.error(res, err);
    }
  }

  public async register(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { email, password } = req.body;
    if (!email || !password) {
      return responseService.error(res, "Missing fields");
    }
    try {
      const newUser: User = {
        email,
        password,
        verify: false,
      };

      const result = await authManager.register(newUser);

      if (result.error) {
        return responseService.error(res, result.error);
      }
      authManager.sendWelcomeEmail(email);
      return responseService.success(
        res,
        "User created successfully",
        result.data
      );
    } catch (err) {
      return responseService.error(res, err);
    }
  }

  public async resetPassword(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { password, email, id, actualPassword } = req.body;
    const authHeader = req.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token || !password || !email || !id || !actualPassword) {
      return responseService.error(res, "Missing fields");
    }
    try {
      const result = await authManager.resetPassword(
        token,
        password,
        id,
        email,
        actualPassword
      );
      if (result.error) {
        return responseService.error(res, result.error);
      }
      return responseService.success(
        res,
        "Password reseted successfully",
        result.data
      );
    } catch (err) {
      return responseService.error(res, err);
    }
  }

  public async token(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return responseService.error(res, "Missing fields");
    }
    const authHeader = req.headers?.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    let result = await authManager.validAccessToken(token as string);
    if (!token) {
      return responseService.error(res, "Missing fields");
    }
    if (!result.error) {
      const { email } = AuthService.decode(token);
      const { data } = await authManager.getUser(email);
      return responseService.success(res, "Token not expired", {
        token: result.data,
        user: data?.user,
      });
    }
    const { email } = AuthService.decode(token);
    result = await authManager.refreshToken(refreshToken, email);
    return responseService.success(
      res,
      "Token refreshed successfully",
      result.data
    );
  }

  public async requestResetPassword(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { email } = req.body;
    if (!email) {
      return responseService.error(res, "Missing email");
    }
    try {
      await authManager.sendResetEmail(email);
    } catch (err) {
      if ((err as any).message === "User not found") {
        return responseService.success(res, "Ok", null);
      }
      return responseService.error(res, err);
    }
    return responseService.success(res, "Ok", null);
  }

  public async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.query;
    const result = await authManager.verifyEmail(token as string);
    if (result.error === null) {
      return res.render("verifiedEmail");
    }
    return res.render("errorVerifyEmail");
  }

  public async requestVerifyEmail(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { email } = req.body;
    if (!email) {
      return responseService.error(res, "Missing email");
    }
    authManager.sendWelcomeEmail(email);
    return responseService.success(res, "ok", null);
  }

  public async resetForgotPassword(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return responseService.error(res, "Missing fields");
    }
    try {
      AuthService.checkRecoveryToken(token);
      const { passwordRecoveryEmail } = AuthService.decode(token);
      const result = await authManager.resetForgotPassword(
        token,
        passwordRecoveryEmail,
        newPassword
      );
      if (result.error) {
        return responseService.error(res, result.error);
      }
      return responseService.success(res, result.data);
    } catch (error) {
      return responseService.error(res, error);
    }
  }
}
