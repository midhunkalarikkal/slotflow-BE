import { User } from '../../../domain/entities/user.entity';
import { JWTService } from '../../../infrastructure/security/jwt';
import { Validator } from '../../../infrastructure/validator/validator';
import { OTPService } from '../../../infrastructure/services/otp.service';
import { UserRepositoryImpl } from '../../../infrastructure/database/user/user.repository.impl';

export class VerifyOTPUseCase {
  constructor(private userRepository: UserRepositoryImpl) {}

  async execute(token: string, otp: string): Promise<{ success: boolean; message: string }> {

    Validator.validateOtp(otp);

    const decoded = JWTService.verifyJwtToken(token) as { username : string, email : string, hashedPassword : string};
    if(!decoded) throw new Error("Invalid or required token.")

    const isValidOTP = OTPService.verifyOTP(decoded.email, otp);
    if (!isValidOTP) throw new Error("Invalid or expired OTP.")

    const user = new User(decoded.username, decoded.email,decoded.hashedPassword, null, null, null, false, false)
    await this.userRepository.createUser(user);

    return { success: true, message: 'OTP verified, redirecting to home' };
  }
}
