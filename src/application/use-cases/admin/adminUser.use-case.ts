import { Types } from "mongoose";
import { User } from "../../../domain/entities/user.entity";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";


interface AdminUsersListResProps extends CommonResponse {
    users: Array<Pick<User, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified">>
}

interface AdminChangeUserStatusResProps extends CommonResponse {
    updatedUser: Pick<User, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified">;
}

export class AdminUserListUseCase {
    constructor(private userRepository: UserRepositoryImpl) { }

    async execute(): Promise<AdminUsersListResProps> {
        const users = await this.userRepository.findAllUsers();
        if (!users) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched users.", users };
    }
}

export class AdminChangeUserStatusUseCase {
    constructor(private userRepository: UserRepositoryImpl) { }

    async execute(userId: string, status: boolean): Promise<AdminChangeUserStatusResProps> {
        if (!userId || status === null) throw new Error("Invalid request");
        const updatedUser = await this.userRepository.updateUserStatus(new Types.ObjectId(userId), status);
        if (!updatedUser) throw new Error("User not found");
        return { success: true, message: `User ${status ? "blocked" : "Unblocked"} successfully.`, updatedUser };
    }
}