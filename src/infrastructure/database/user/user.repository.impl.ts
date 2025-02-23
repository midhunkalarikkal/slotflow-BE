import { IUser, UserModel } from "./user.model";
import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/IUser.repository";

export class UserRepositoryImpl implements IUserRepository {
    private mapToEntity(user: IUser): User {
        return new User(
            user._id,
            user.username,
            user.email,
            user.password,
            user.phone,
            user.profileImage,
            user.addressId,
            user.isBlocked,
            user.isVerified
        );
    }

    async createUser(user: User): Promise<User> {
        try {
            const createdUser = await UserModel.create(user);
            return this.mapToEntity(createdUser);
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Unable to register, please try again after a few minutes.");
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email });
            return user ? this.mapToEntity(user) : null;
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw new Error("Unable to find user by email.");
        }
    }
}
