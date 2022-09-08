import queryParser from "../../services/query-parser.service";
import { User } from "../../types/interfaces/user.interface";
import userModel from "../user/user.model";
import TokenService from "../../services/token.service";

export class TokenManager {
  public async generateToken(
    email: string
  ): Promise<{ error: unknown; data: string | null }> {
    const filters = queryParser.getFilters({ email_in: email });
    const users: User[] = await userModel.getAll(filters);

    if (!users.length) {
      return { error: "User not found", data: null };
    }

    const token = await TokenService.generateToken(email as string);
    const user = users[0];
    user.apiToken = token;
    await userModel.update(user._id as string, user);
    return { error: null, data: token };
  }
}

export default new TokenManager();
