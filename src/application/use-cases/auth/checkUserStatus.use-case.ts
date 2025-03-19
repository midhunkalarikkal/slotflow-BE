import { Types } from "mongoose";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { JWTService } from "../../../infrastructure/security/jwt";

export class CheckUserStatusUseCase {
    constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl){}

    // async checkStatus(token : string) : Promise<{ status: number, success: boolean, message: string }> {
    async execute(id: string, role: string) : Promise<{ status: number, success: boolean, message: string }> {

        // if (!token) {
        //     return { status: 401, success: false, message: "Invalid request." };
        // }

        // const decoded = JWTService.verifyToken(token);

        // if (!decoded) {
        //     return { status: 401, success: false, message: "Invalid token." };
        // }

        // if (decoded.role === "ADMIN") {
        //     return { status: 200, success: true, message: "Admin account is active." };
        // }

        if (role === "USER") {
            const user = await this.userRepository.checkUserStatus(new Types.ObjectId(id));
            if (user?.isBlocked) {
                return { status: 403, success: false, message: "Your account has been blocked." };
            } else {
                return { status: 200, success: true, message: "Your account is active." };
            }
        } else if (role === "PROVIDER") {
            const providerIsBlocked = await this.providerRepository.checkProviderStatus(id);
            if (providerIsBlocked) {
                return { status: 403, success: false, message: "Your account has been blocked." };
            } else {
                return { status: 200, success: true, message: "Your account is active." };
            }
        } else {
            return { status: 400, success: false, message: "Invalid role." };
        }
    }
}