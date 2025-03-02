import { JWTService } from "../../../infrastructure/security/jwt";

export class RefreshAccessTokenUseCase {
    async execute(refreshToken: string):Promise<{success: boolean, message: string, accessToken: string}>{
        const decoded = JWTService.verifyRefreshToken(refreshToken);
        const accessToken = JWTService.generateAccessToken({ userId: decoded.userId, role: decoded.role });
        if(!accessToken) throw new Error("");
        return {success: true, message: "", accessToken}
    }
}