import { JWTService } from '../../../infrastructure/security/jwt';
import { Validator } from '../../../infrastructure/validator/validator';
import { OTPService } from '../../../infrastructure/services/otp.service';
import { PasswordHasher } from '../../../infrastructure/security/password-hashing';
import { UserRepositoryImpl } from '../../../infrastructure/database/user/user.repository.impl';

export class RegisterUserUseCase {

  constructor(private userRepository: UserRepositoryImpl) {}

  async execute(username: string, email: string, password: string): Promise<{ success: boolean; message: string, token? : string }> {

    Validator.validateUsername(username);
    Validator.validateEmail(email);
    Validator.validatePassword(password);

    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) throw new Error("Email already exist.")

    const hashedPassword = await PasswordHasher.hashPassword(password);
    
    const otp = OTPService.generateOTP(email);
    if(!otp) throw new Error("OTP generation failed");

    await OTPService.sendOTP(email, otp);

    const token = JWTService.generateJwtToken({ username, email, hashedPassword });
    if(!token) throw new Error("Token creation failed.");

    return { success: true, message: `OTP sent to email`, token };

  }
}
