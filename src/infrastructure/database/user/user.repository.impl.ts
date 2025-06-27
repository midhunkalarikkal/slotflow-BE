import { Types } from "mongoose";
import { IUser, UserModel } from "./user.model";
import { User } from "../../../domain/entities/user.entity";
import { CreateUserProps, IUserRepository } from "../../../domain/repositories/IUser.repository";
import { AdminFetchAllUsers } from "../../dtos/admin.dto";
import { ApiPaginationRequest, ApiResponse } from "../../dtos/common.dto";

export class UserRepositoryImpl implements IUserRepository {
    private mapToEntity(user: IUser): User {
        return new User(
            user._id,
            user.username,
            user.email,
            user.password,
            user.isBlocked,
            user.isEmailVerified,
            user.phone,
            user.profileImage,
            user.addressId,
            user.bookingsId,
            user.verificationToken,
            user.createdAt,
            user.updatedAt,
        );
    }

    async createUser(user: CreateUserProps): Promise<User> {
        try {
            const createdUser = await UserModel.create(user);
            return this.mapToEntity(createdUser);
        } catch (error) {
            console.log("error : ", error);
            throw new Error("Unable to register, please try again after a few minutes.");
        }
    }

    async verifyUser(verificationToken: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ verificationToken });
            return user ? this.mapToEntity(user) : null;
        } catch (error) {
            throw new Error("Unable to retrieve verification data.");
        }
    }

    async updateUser(user: User): Promise<User | null> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, { new: true });
            return updatedUser ? this.mapToEntity(updatedUser) : null;
        } catch (error) {
            throw new Error("Unable to update user.");
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email });
            return user ? this.mapToEntity(user) : null;
        } catch (error) {
            throw new Error("Unable to find user by email.");
        }
    }

    async findAllUsers({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllUsers>> {
        try {
            const skip = (page - 1) * limit;
            const [users, totalCount] = await Promise.all([
                UserModel.find({}, {
                    _id: 1,
                    username: 1,
                    email: 1,
                    isBlocked: 1,
                    isEmailVerified: 1
                }).skip(skip).limit(limit).lean(),
                UserModel.countDocuments(),

            ])
            const totalPages = Math.ceil(totalCount / limit);
            return {
                data: users.map(this.mapToEntity),
                totalPages,
                currentPage: page,
                totalCount
            }
        } catch (error) {
            throw new Error("Failed to fetch users from database.")
        }
    }

    async findUserById(userId: Types.ObjectId): Promise<User | null> {
        try {
            const user = await UserModel.findById(userId);
            return user ? this.mapToEntity(user) : null;
        } catch (error) {
            throw new Error("User not found.");
        }
    }
}
