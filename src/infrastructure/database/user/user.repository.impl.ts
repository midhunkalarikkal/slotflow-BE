import { IUser, UserModel } from "./user.model";
import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/IUser.repository";

export class UserRepositoryImpl implements IUserRepository {
    private mapToEntity(user: IUser): User {
        return new User(
            user.username,
            user.email,
            user.password,
            user.phone,
            user.profileImage,
            user.addressId,
            user.isBlocked,
            user.isEmailVerified,
            user._id,
            user.verificationToken
        );
    }

    async createUser(user: User): Promise<User> {
        try {
            const createdUser = await UserModel.create(user);
            return this.mapToEntity(createdUser);
        } catch (error) {
            console.log("error : ",error);
            throw new Error("Unable to register, please try again after a few minutes.");
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

    async findAllUsers(): Promise<User[]> {
        try{
            return await UserModel.find({},{_id:1, username:1, email: 1, isBlocked: 1, isVerified: 1});
        }catch(error){
            throw new Error("Failed to fetch users from database.")
        }
    }
    
    async getVerificationData(verificationToken: string): Promise<User | null> {
        try {
            const User = await UserModel.findOne({ verificationToken });
            return User;
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
    
}
