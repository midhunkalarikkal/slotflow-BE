import { JWTService } from '../../../infrastructure/security/jwt';
import { OTPService } from '../../../infrastructure/services/otp.service';
import { PasswordHasher } from '../../../infrastructure/security/password-hashing';
import { UserRepositoryImpl } from '../../../infrastructure/database/user/user.repository.impl';

export class RegisterUserUseCase {

  constructor(private userRepository: UserRepositoryImpl) {}

  async execute(username: string, email: string, password: string): Promise<{ success: boolean; message: string, token? : string }> {

    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) return { success: false, message: 'Email already registered' };

    const hashedPassword = await PasswordHasher.hashPassword(password);
    
    const otp = OTPService.generateOTP(email);
    await OTPService.sendOTP(email, otp);

    const token = JWTService.generateJwtToken({ username, email, hashedPassword });

    return { success: true, message: `OTP sent to email`, token };

  }
}
