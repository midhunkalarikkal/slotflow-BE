import { Types } from "mongoose";
import { User } from "../entities/user.entity";

export type CreateUserProps = Pick<User, "username" | "email" | "password" | "verificationToken">;
export type FindAllUsersProps = Pick<User, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified">;

export interface IUserRepository {

  createUser(user: CreateUserProps): Promise<User>;

  verifyUser(verificationToken: string): Promise<User | null>;
  
  updateUser(user: User): Promise<User | null>;
  
  findUserByEmail(email: string): Promise<User | null>;

  findAllUsers(): Promise<Array<FindAllUsersProps>>;

  findUserById(userId: Types.ObjectId): Promise<User | null>;
}
