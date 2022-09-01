import { User } from "../../../types/interfaces/user.interface";

export interface MongooseUser extends User {
    _id?: string;
}
