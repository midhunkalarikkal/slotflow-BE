import { adminConfig } from "../../../config/env";
import { JWTService } from "../../../infrastructure/security/jwt";
import { OTPService } from "../../../infrastructure/services/otp.service";
import { Validator } from "../../../infrastructure/validator/validator";

export class AdminLoginUseCase {
    constructor() { }

    async adminLoginExecute(email: string, password: string): Promise<{ success: boolean, message: string, token : string }> {

        Validator.validateEmail(email);
        Validator.validatePassword(password);

        if (email !== adminConfig.adminEmail || password !== adminConfig.adminPassword) {
            throw new Error("Invalid credentials.")
        }

        const otp = OTPService.generateOTP(email);
        if (!otp) throw new Error("OTP generation failed");
        
        await OTPService.sendOTP(email, otp);
        
        const token = JWTService.generateJwtToken({ email, role : "ADMIN" });
        if (!token) throw new Error("Token creation failed.");

        return { success: true, message: "OTP sent to your email.", token }
    }
}