import jwt from "jsonwebtoken";

export default class TokenService {
  static generateToken(mail: string): string {
    return jwt.sign({ mail }, new Date().toDateString());
  }
}
