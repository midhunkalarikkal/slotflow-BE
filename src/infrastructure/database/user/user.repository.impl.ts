import { Types } from "mongoose";
import { IUser, UserModel } from "./user.model";
import { User } from "../../../domain/entities/user.entity";
import { CreateUserProps, FindAllUsersProps, IUserRepository } from "../../../domain/repositories/IUser.repository";

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

    async createUser(user: CreateUserProps): Promise<User | null> {
        try {
            const createdUser = await UserModel.create(user);
            return createdUser ? this.mapToEntity(createdUser) : null;
        } catch (error) {
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

    async findAllUsers(): Promise<FindAllUsersProps[] | null> {
        try {
            const users =  await UserModel.find({}, { _id: 1, username: 1, email: 1, isBlocked: 1, isEmailVerified: 1 });
            return users ? users.map((user) => this.mapToEntity(user)) : null;
        } catch (error) {
            throw new Error("Failed to fetch users from database.")
        }
    }    

    async updateUserStatus(userId: Types.ObjectId, status: boolean): Promise<FindAllUsersProps | null> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { isBlocked: status },
                { new: true, select: '_id username email isBlocked isEmailVerified' }
            );
            return updatedUser || null;
        } catch (error) {
            throw new Error("Unexpected error, please try again.");
        }
    }

    async checkUserStatus(userId: Types.ObjectId): Promise<Partial<User> | null> {
        try{
            const user = await UserModel.findById(userId,{_id: 1, isBlocked: 1});
            return user ? user : null;
        }catch(error){
            throw new Error("Status checking error.");
        }
    }

}
