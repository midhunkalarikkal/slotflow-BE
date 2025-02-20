import { UserRepositoryImpl } from '../../../infrastructure/database/user/user.repository.impl';
import { JWTService } from '../../../infrastructure/security/jwt';
import { OTPService } from '../../../infrastructure/services/otp.service';
import { User } from '../../../domain/entities/user.entity';

export class VerifyOTPUseCase {
  constructor(private userRepository: UserRepositoryImpl) {}

  async execute(token: string, otp: string): Promise<{ success: boolean; message: string }> {

    console.log("data : ",{token, otp})

    const decoded = JWTService.verifyJwtToken(token) as { username : string, email : string, hashedPassword : string};
    if(!decoded) return { success : false, message : 'Invalid or expired token'};

    console.log("decoded.email : ",decoded.email);

    const isValidOTP = OTPService.verifyOTP(decoded.email, otp);
    if (!isValidOTP) return { success: false, message: 'Invalid or expired OTP' };

    const user = new User(decoded.username, decoded.email,decoded.hashedPassword, null, null, null, false, false)
    await this.userRepository.createUser(user);

    return { success: true, message: 'OTP verified, redirecting to home' };
  }
}
