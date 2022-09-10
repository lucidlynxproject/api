import jwt from "jsonwebtoken";

export default class TokenService {
  static generateToken(mail: string): string {
    return jwt.sign({ mail }, new Date().toDateString());
  }
  static checkToken(token: string): boolean {
    const verification = jwt.verify(
      token,
      process.env.RECOVERY_TOKEN_SECRET as string
    );

    const { email } = jwt.decode(token) as any;
    return verification && email;
  }
}
