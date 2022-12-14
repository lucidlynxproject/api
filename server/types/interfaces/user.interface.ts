export interface User {
  _id?: string;
  email: string;
  verify?: boolean;
  password: string;
  authToken?: string;
  refreshToken?: string;
  recoveryToken?: string;
  apiToken?: string | null;
}
