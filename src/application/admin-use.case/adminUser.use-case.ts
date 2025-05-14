import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AdminChangeUserIsBlockedStatusRequestPayload, AdminChangeUserStatusResProps, AdminUsersListResProps } from "../../infrastructure/dtos/admin.dto";

export class AdminUserListUseCase {
    constructor(private userRepository: UserRepositoryImpl) { }

    async execute(): Promise<AdminUsersListResProps> {
        const users = await this.userRepository.findAllUsers();
        return { success: true, message: "Fetched users.", users };
    }
}

export class AdminChangeUserStatusUseCase {
    constructor(private userRepository: UserRepositoryImpl) { }

    async execute({userId, isBlocked}: AdminChangeUserIsBlockedStatusRequestPayload): Promise<AdminChangeUserStatusResProps> {
        if (!userId || isBlocked === null) throw new Error("Invalid request");
        const user = await this.userRepository.findUserById(userId);
        if(!user) throw new Error("No user found.");
        user.isBlocked = isBlocked;
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