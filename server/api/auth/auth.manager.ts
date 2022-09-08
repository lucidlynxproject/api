import { emailService } from "../../services/mail.service";
import queryParser from "../../services/query-parser.service";
import { EmailMessage } from "../../types/interfaces/email.interface";
import { User } from "../../types/interfaces/user.interface";
import userModel from "../user/user.model";
import AuthService from "./auth.service";

export class AuthManager {
  public async login(
    email: string,
    password: string
  ): Promise<{
    error: unknown;
    data: { user: User; token: string; refreshToken: string } | null;
  }> {
    try {
      const filters = queryParser.getFilters({ email_in: email });
      const foundUser = await userModel.getAll(filters);

      if (!foundUser.length) {
        const user = foundUser[0];
        const passwordMatch = await AuthService.passwordMatch(
          user.password as string,
          password
        );
        if (!passwordMatch) {
          return { error: "Wrong credentials", data: null };
        }
        const payload = { email: user.email };
        const token = await AuthService.signToken(payload, "access_token");
        return {
          error: null,
          data: { user, token, refreshToken: user.refreshToken as string },
        };
      }
      return { error: "User not found", data: null };
    } catch (error) {
      return { error, data: null };
    }
  }

  public async resetForgotPassword(
    token: string,
    email: string,
    newPassword: string
  ): Promise<{ error: unknown; data: string }> {
    const filters = queryParser.getFilters({ email_in: email });
    const users: User[] = await userModel.getAll(filters);

    if (users.length === 0) {
      return { error: "User not found", data: "" };
    }

    const user = users[0];
    if (user.recoveryToken !== token) {
      return { error: "Tokens do not match", data: "" };
    }
    user.recoveryToken = "";
    user.password = await AuthService.encryptPassword(newPassword);
    await userModel.update(user._id as string, user);
    return { error: null, data: "Reset password" };
  }

  public async sendWelcomeEmail(email: string): Promise<void> {
    const token = AuthService.getVerifyEmailToken(email);
    const mailOptions: EmailMessage = {
      from: `"Price Comparator API" ${process.env.MAIL}`,
      to: email,
      subject: "!Bienvenido a Price Comparator!",
      template: "welcome",
      context: {
        email,
        url: `${process.env.DOMAIN_API}/api/auth/verify?token=${token}`,
      },
      attachments: [
        {
          filename: "price_comparator.png",
          path: "./templates/images/price_comparator.png",
          cid: "logo",
        },
      ],
    };
    try {
      await emailService.sendMail(mailOptions);
    } catch (e) {
      console.log("Error", { e });
    }
  }

  private async requestResetPassword(email: string) {
    const filters = queryParser.getFilters({ email });
    const users: User[] = await userModel.getAll(filters);
    if (users.length === 0) {
      return { error: "User not found", token: null };
    }
    const user: User = users[0];
    const token = AuthService.getRecoveryToken(email);
    user.recoveryToken = token;
    await userModel.update(user._id as string, user);
    return { error: null, token };
  }

  public async resetPassword(
    token: string,
    password: string,
    id: string,
    email: string,
    actualPassword: string
  ): Promise<{ error: unknown; data: unknown }> {
    const filters = queryParser.getFilters({ email });
    const users: User[] = await userModel.getAll(filters);

    if (users.length > 0) {
      const user: User = users[0];
      const isValidToken = AuthService.checkPasswordRecoveryToken(
        token,
        user.email
      );

      if (isValidToken) {
        const matchPassword = await AuthService.passwordMatch(
          user.password,
          actualPassword
        );

        if (!matchPassword) {
          return { error: "Wrong actual password", data: null };
        }

        const hashPassword = await AuthService.encryptPassword(password);

        user.password = hashPassword;

        await userModel.update(id, user);

        return { error: null, data: user };
      }
      return { error: "Something went wrong", data: null };
    }
    return { error: "User not found", data: null };
  }

  public async sendResetEmail(email: string): Promise<void> {
    const token = await this.requestResetPassword(email);
    const { token: _token } = token;
    if (_token === null) {
      throw new Error("User not found");
    }
    if (token === null) {
      return;
    }
    const mailOptions: EmailMessage = {
      from: `"Price Comparator API" ${process.env.MAIL}`,
      to: email,
      subject: "Recuperar contraseña",
      template: "account_password_reset",
      context: {
        email,
        url: `${process.env.DOMAIN_PANEL}/change-password?token=${_token}`,
      },
      attachments: [
        {
          filename: "logo-color.png",
          path: "./templates/images/price_comparator.png",
          cid: "logo",
        },
      ],
    };
    try {
      await emailService.sendMail(mailOptions);
    } catch (e) {
      console.log("Error", { e });
    }
  }

  public async register(user: User): Promise<{
    error: any;
    data: { token: string; refreshToken?: string } | null;
  }> {
    try {
      const filters = queryParser.getFilters({ email_in: user.email });
      const foundUser = await userModel.getAll(filters);

      if (foundUser.length === 0) {
        const { password } = user;
        const hashPassword = await AuthService.encryptPassword(password);
        const payload = { email: user.email };
        const refreshToken = AuthService.signToken(payload, "refresh_token");
        user.password = hashPassword;
        user.refreshToken = refreshToken;
        console.log(user);
        const userDB = await userModel.create(user);
        const returningData = {
          token: AuthService.signToken(payload, "access_token"),
          refreshToken,
          user: userDB,
        };
        return { error: null, data: returningData };
      }
      return {
        error: "User is already registered with that email",
        data: null,
      };
    } catch (err) {
      return { error: err, data: null };
    }
  }

  async getUser(
    email: string
  ): Promise<{ error: any; data: { user: User } | null }> {
    try {
      const filters = queryParser.getFilters({ email_in: email });
      const foundUser = await userModel.getAll(filters);

      if (foundUser.length !== 0) {
        const user = foundUser[0];
        const returningData = {
          user,
        };

        return { error: null, data: returningData };
      }
      return { error: "User not found", data: null };
    } catch (err) {
      return { error: err, data: null };
    }
  }

  async refreshToken(
    refreshToken: string,
    email: string
  ): Promise<{ error: any; data: { token: string } | null }> {
    try {
      const filters = queryParser.getFilters({ email_in: email });
      const foundUser = await userModel.getAll(filters);

      if (foundUser.length !== 0) {
        const user = foundUser[0];

        const verification = AuthService.verifyToken(
          refreshToken,
          "refresh_token"
        );

        if (verification && verification.email !== user.email) {
          return { error: "Error verifying token", data: null };
        }

        const payload = { email: user.email };
        const returningData = {
          token: AuthService.signToken(payload, "access_token"),
          user,
        };

        return { error: null, data: returningData };
      }
      return { error: "User not found, cannot refresh token", data: null };
    } catch (err) {
      return { error: err, data: null };
    }
  }

  async validAccessToken(
    accessToken: string
  ): Promise<{ error: any; data: { token: string } | null }> {
    try {
      AuthService.verifyToken(accessToken, "access_token");
      return { error: null, data: { token: accessToken } };
    } catch (err) {
      return { error: err, data: null };
    }
  }

  async verifyEmail(token: string) {
    try {
      AuthService.checkVerifyEmailToken(token as string);
      const { email } = AuthService.decode(token as string);
      const filters = queryParser.getFilters({ email_in: email });
      const foundUser = await userModel.getAll(filters);
      if (foundUser.length !== 1) {
        return { error: "User not found", data: null };
      }
      const user: User = foundUser[0];
      if (user.verify === true) {
        return { error: null, data: user };
      }
      user.verify = true;
      await userModel.update(user._id as string, user);
      return { error: null, data: user };
    } catch (error) {
      return { error, data: null };
    }
  }

  public generatePassword(): string {
    let password = "";
    const min = 0;
    const minLengthPass = 6;
    const capitalCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const specialCharacters = "ºª!”@·#~%&/()=?’¿¡*+^`¨,";
    const numbers = "1234567890";
    const combinedChars =
      capitalCaseLetters + lowerCaseLetters + specialCharacters + numbers;
    password += lowerCaseLetters.charAt(
      Math.floor(Math.random() * (lowerCaseLetters.length - min)) + min
    );
    password += capitalCaseLetters.charAt(
      Math.floor(Math.random() * (capitalCaseLetters.length - min)) + min
    );
    password += specialCharacters.charAt(
      Math.floor(Math.random() * (specialCharacters.length - min)) + min
    );
    password += numbers.charAt(
      Math.floor(Math.random() * (numbers.length - min)) + min
    );
    for (let i = 4; i < minLengthPass; i++) {
      password += combinedChars.charAt(
        Math.floor(Math.random() * (combinedChars.length - min)) + min
      );
    }
    return password;
  }
}
export default new AuthManager();
