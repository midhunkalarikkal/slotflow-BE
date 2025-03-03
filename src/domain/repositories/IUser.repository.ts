import { User } from "../entities/user.entity";

export interface IUserRepository {
  createUser(user: User): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  getVerificationData(verificationToken: string): Promise<User | null>;
  updateUser(user: User): Promise<User | null>;
  findAllUsers(): Promise<User[]>;
}
