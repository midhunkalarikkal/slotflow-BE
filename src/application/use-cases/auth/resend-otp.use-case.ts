
import { JWTService } from '../../../infrastructure/security/jwt';
import { OTPService } from '../../../infrastructure/services/otp.service';

export class ResendOtpUseCase {

  constructor() {}

  async execute(email: string): Promise<{ success: boolean; message: string, token: string}> {

    const otp = OTPService.generateOTP(email);
    if (!otp) throw new Error("Unexpected error, please try again.");

    await OTPService.sendOTP(email, otp);

    const token = JWTService.generateJwtToken({email, role: ""})

    return { success: true, message: `OTP sent to email.`, token };

  }
}
