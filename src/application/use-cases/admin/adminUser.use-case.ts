import { Types } from "mongoose";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { AdminChangeUserStatusResProps, AdminUsersListResProps } from "../../../shared/interface/adminInterface";

export class AdminUserListUseCase {
    constructor(private userRepository: UserRepositoryImpl) { }

    async execute(): Promise<AdminUsersListResProps> {
        const users = await this.userRepository.findAllUsers();
        return { success: true, message: "Fetched users.", users };
    }
}

export class AdminChangeUserStatusUseCase {
    constructor(private userRepository: UserRepositoryImpl) { }

    async execute(userId: string, status: boolean): Promise<AdminChangeUserStatusResProps> {
        if (!userId || status === null) throw new Error("Invalid request");
        const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
        if(!user) throw new Error("No user found.");
        user.isBlocked = status;
        const updatedUser = await this.userRepository.updateUser(user);
        if (!updatedUser) throw new Error("User not found");
        const data = {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isBlocked: updatedUser.isBlocked,
            isEmailVerified: updatedUser.isEmailVerified
        }
        return { success: true, message: `User ${status ? "blocked" : "Unblocked"} successfully.`, updatedUser: data };
    }
}