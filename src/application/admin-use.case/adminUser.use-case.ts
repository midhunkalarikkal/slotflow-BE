import { Validator } from "../../infrastructure/validator/validator";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { 
    AdminUsersListUseCaseResponse, 
    AdminChangeUserStatusUseCaseResponse, 
    AdminChangeUserIsBlockedStatusUseCaseRequestPayload, 
} from "../../infrastructure/dtos/admin.dto";

export class AdminUserListUseCase {
    constructor(private userRepositoryImpl: UserRepositoryImpl) { }

    async execute(): Promise<AdminUsersListUseCaseResponse> {
        const users = await this.userRepositoryImpl.findAllUsers();
        return { success: true, message: "Fetched users.", users };
    }
}


export class AdminChangeUserBlockStatusUseCase {
    constructor(private userRepositoryImpl: UserRepositoryImpl) { }

    async execute(data: AdminChangeUserIsBlockedStatusUseCaseRequestPayload): Promise<AdminChangeUserStatusUseCaseResponse> {
        const {userId, isBlocked} = data;
        if (!userId || isBlocked === null) throw new Error("Invalid request");

        console.log("changing user block status");

        Validator.validateObjectId(userId, "userId");
        Validator.validateBooleanValue(isBlocked, "isBlocked");

        const user = await this.userRepositoryImpl.findUserById(userId);
        if(!user) throw new Error("No user found.");
        user.isBlocked = isBlocked;
        const updatedUser = await this.userRepositoryImpl.updateUser(user);
        if (!updatedUser) throw new Error("User not found");
        const updatedUserData = {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isBlocked: updatedUser.isBlocked,
            isEmailVerified: updatedUser.isEmailVerified
        }
        return { success: true, message: `User ${isBlocked ? "blocked" : "Unblocked"} successfully.`, updatedUser: updatedUserData };
    }
}