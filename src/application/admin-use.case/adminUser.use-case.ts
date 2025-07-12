import { 
    AdminFetchAllUsers, 
    AdminChangeUserIsBlockedStatusRequest,
} from "../../infrastructure/dtos/admin.dto";
import { Validator } from "../../infrastructure/validator/validator";
import { ApiPaginationRequest, ApiResponse } from "../../infrastructure/dtos/common.dto";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";


export class AdminUserListUseCase {
    constructor(private userRepositoryImpl: UserRepositoryImpl) { }

    async execute({ page, limit }: ApiPaginationRequest): Promise<ApiResponse<AdminFetchAllUsers>> {
        
        const result = await this.userRepositoryImpl.findAllUsers({ page, limit });
        if (!result) throw new Error("Users fetching failed, ");
        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }
}


export class AdminChangeUserBlockStatusUseCase {
    constructor(private userRepositoryImpl: UserRepositoryImpl) { }

    async execute({userId, isBlocked}: AdminChangeUserIsBlockedStatusRequest): Promise<ApiResponse> {

        if (!userId || isBlocked === null) throw new Error("Invalid request");

        Validator.validateObjectId(userId, "userId");
        Validator.validateBooleanValue(isBlocked, "isBlocked");

        const user = await this.userRepositoryImpl.findUserById(userId);
        if(!user) throw new Error("No user found.");
        user.isBlocked = isBlocked;
        const updatedUser = await this.userRepositoryImpl.updateUser(user);
        if (!updatedUser) throw new Error("User not found");
        return { success: true, message: `User ${isBlocked ? "blocked" : "Unblocked"} successfully.` };
    }
}