import { Types } from "mongoose";
import { User } from "../entities/user.entity";

export interface IUserRepository {
  createUser(user: Partial<User>): Promise<Partial<User> | null>;

  findUserByEmail(email: string): Promise<User | null>;

  getVerificationData(verificationToken: string): Promise<User | null>;

  updateUser(user: Partial<User>): Promise<Partial<User> | null>;

  findAllUsers(): Promise<User[] | null>;

  updateUserStatus(userId: Types.ObjectId, status: boolean): Promise<Partial<User> | null>;

  checkUserStatus(userId: Types.ObjectId): Promise<Partial<User> | null>;
}
