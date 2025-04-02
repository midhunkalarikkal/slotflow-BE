import { Types } from "mongoose";
import { User } from "../entities/user.entity";

export type CreateUserProps = Pick<User, "username" | "email" | "password" | "verificationToken">;
export type FindAllUsersProps = Pick<User, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified">;

export interface IUserRepository {

  createUser(user: CreateUserProps): Promise<User | null>;

  verifyUser(verificationToken: string): Promise<User | null>;
  
  updateUser(user: User): Promise<User | null>;
  
  findUserByEmail(email: string): Promise<User | null>;

  findAllUsers(): Promise<Array<FindAllUsersProps> | null>;

  updateUserStatus(userId: Types.ObjectId, status: boolean): Promise<FindAllUsersProps | null>;

  checkUserStatus(userId: Types.ObjectId): Promise<Partial<User> | null>;

  findUserById(userId: Types.ObjectId): Promise<User | null>;
}
