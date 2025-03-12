import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { JWTService } from "../../../infrastructure/security/jwt";

export class CheckUserStatusUseCase {
    constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl){}

    async checkStatus(token : string) : Promise<{ status: number, success: boolean, message: string }> {

        if (!token) {
            return { status: 401, success: false, message: "Invalid request." };
        }

        const decoded = JWTService.verifyToken(token);

        if (!decoded) {
            return { status: 401, success: false, message: "Invalid token." };
        }

        if (decoded.role === "ADMIN") {
            return { status: 200, success: true, message: "Admin account is active." };
        }

        if (decoded.role === "USER") {
            const userIsBlocked = await this.userRepository.checkUserStatus(decoded.userOrProviderId);
            if (userIsBlocked) {
                return { status: 403, success: false, message: "Your account has been blocked." };
            } else {
                return { status: 200, success: true, message: "Your account is active." };
            }
        } else if (decoded.role === "PROVIDER") {
            const providerIsBlocked = await this.providerRepository.checkProviderStatus(decoded.userOrProviderId);
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