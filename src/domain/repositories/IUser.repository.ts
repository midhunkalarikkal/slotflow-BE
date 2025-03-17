import { User } from "../entities/user.entity";

export interface IUserRepository {
  createUser(user: User): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  getVerificationData(verificationToken: string): Promise<User | null>;
  updateUser(user: User): Promise<User | null>;
  findAllUsers(): Promise<User[] | null>;
  updateUserStatus(userId: string, status: boolean): Promise<Partial<User> | null>;
  checkUserStatus(userId: string): Promise<boolean | null>;
}
