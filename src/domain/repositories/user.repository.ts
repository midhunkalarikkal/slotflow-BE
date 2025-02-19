import { User } from "../entities/user.entity";

User
export interface UserRepository {
  createUser(user: User): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
}
