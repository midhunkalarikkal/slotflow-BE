import { Types } from "mongoose";
import { User } from "../entities/user.entity";

export type CreateUserProps = Pick<User, "username" | "email" | "password" | "verificationToken">;

export interface IUserRepository {

  createUser(user: CreateUserProps): Promise<User | null>;

  verifyUser(verificationToken: string): Promise<User | null>;
  
  updateUser(user: User): Promise<User | null>;
  
  findUserByEmail(email: string): Promise<User | null>;

  findAllUsers(): Promise<User[] | null>;

  updateUserStatus(userId: Types.ObjectId, status: boolean): Promise<Partial<User> | null>;

  checkUserStatus(userId: Types.ObjectId): Promise<Partial<User> | null>;
}
