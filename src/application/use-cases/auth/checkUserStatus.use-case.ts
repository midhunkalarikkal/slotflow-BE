import { Types } from "mongoose";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

interface CheckUserStatusResProps extends CommonResponse {
    status: number
}

export class CheckUserStatusUseCase {
    constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl){}

    async execute(id: string, role: string) : Promise<CheckUserStatusResProps> {

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