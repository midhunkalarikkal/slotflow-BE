import { User } from "../../../domain/entities/user.entity";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";

export class AdminUserUseCase {
    constructor(private userRepository: UserRepositoryImpl) { }

    async usersList(): Promise<{ success: boolean, message: string, users?: User[] }> {
        const users = await this.userRepository.findAllUsers();
        if (!users) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched users.", users };
    }

    async changeStatus(userId: string, status: boolean): Promise<{ success: boolean, message: string, updatedUser: Partial<User> }> {
            if (!userId || status === null) throw new Error("Invalid request");
            const updatedUser = await this.userRepository.updateUserStatus(userId, status);
            if (!updatedUser) throw new Error("User not found");
            return { success: true, message: `User ${status ? "blocked" : "Unblocked"} successfully.`, updatedUser };
    }

}