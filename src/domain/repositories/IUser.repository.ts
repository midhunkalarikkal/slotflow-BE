import { Types } from "mongoose";
import { User } from "../entities/user.entity";
import { AdminFetchAllUsers } from "../../infrastructure/dtos/admin.dto";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dto";

export type CreateUserProps = Pick<User, "username" | "email" | "password" | "verificationToken">;

export interface IUserRepository {

  createUser(user: CreateUserProps): Promise<User>;

  verifyUser(verificationToken: string): Promise<User | null>;
  
  updateUser(user: User): Promise<User | null>;
  
  findUserByEmail(email: string): Promise<User | null>;

  findAllUsers({page,limit}: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllUsers>>;

  findUserById(userId: Types.ObjectId): Promise<User | null>;
}
