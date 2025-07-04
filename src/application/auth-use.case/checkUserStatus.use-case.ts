import { Types } from "mongoose";
import { CheckUserStatusRequest, CheckUserStatusResponse } from "../../infrastructure/dtos/auth.dto";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { Validator } from "../../infrastructure/validator/validator";



export class CheckUserStatusUseCase {
    constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl){}

    async execute(data: CheckUserStatusRequest) : Promise<CheckUserStatusResponse> {
        const { id, role } = data;

        Validator.validateObjectId(id);
        Validator.validateRole(role);

        if (role === "USER") {
            const user = await this.userRepository.findUserById(new Types.ObjectId(id));
            if (user?.isBlocked) {
                return { status: 403, success: false, message: "Your account has been blocked." };
            } else {
                return { status: 200, success: true, message: "Your account is active." };
            }
        } else if (role === "PROVIDER") {
            const provider = await this.providerRepository.findProviderById(new Types.ObjectId(id));
            if (provider?.isBlocked) {
                return { status: 403, success: false, message: "Your account has been blocked." };
            } else {
                return { status: 200, success: true, message: "Your account is active." };
            }
        } else {
            return { status: 400, success: false, message: "Invalid role." };
        }
    }
}