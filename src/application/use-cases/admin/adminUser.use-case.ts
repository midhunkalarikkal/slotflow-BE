import { Types } from "mongoose";
import { User } from "../../../domain/entities/user.entity";
import { FindAllUsersProps } from "../../../domain/repositories/IUser.repository";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";

export class AdminUserListUseCase {
    constructor(private userRepository: UserRepositoryImpl) { }

    async execute(): Promise<{ success: boolean, message: string, users: FindAllUsersProps[] }> {
        const users = await this.userRepository.findAllUsers();
        if (!users) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched users.", users };
    }
}

export class AdminChangeUserStatusUseCase {
    constructor(private userRepository: UserRepositoryImpl) { }

    async execute(userId: string, status: boolean): Promise<{ success: boolean, message: string, updatedUser: FindAllUsersProps }> {
        if (!userId || status === null) throw new Error("Invalid request");
        const updatedUser = await this.userRepository.updateUserStatus(new Types.ObjectId(userId), status);
        if (!updatedUser) throw new Error("User not found");
        return { success: true, message: `User ${status ? "blocked" : "Unblocked"} successfully.`, updatedUser };
    }

}