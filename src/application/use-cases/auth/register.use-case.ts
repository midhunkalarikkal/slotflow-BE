import { JWTService } from '../../../infrastructure/security/jwt';
import { Validator } from '../../../infrastructure/validator/validator';
import { OTPService } from '../../../infrastructure/services/otp.service';
import { PasswordHasher } from '../../../infrastructure/security/password-hashing';
import { UserRepositoryImpl } from '../../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../../infrastructure/database/provider/provider.repository.impl';

export class RegisterUseCase {

  constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl) { }

  async execute(username: string, email: string, password: string, role: string): Promise<{ success: boolean; message: string, token?: string }> {

    Validator.validateUsername(username);
    Validator.validateEmail(email);
    Validator.validatePassword(password);

    
    if (role === "USER") {
      const existingUser = await this.userRepository.findUserByEmail(email);
      if (existingUser) throw new Error("Email already exist.");
    } else if (role === "PROVIDER") {
      const existingProvider = await this.providerRepository.findProviderByEmail(email);
      if (existingProvider) throw new Error("Email already exist.");
    } else {
      throw new Error("Invalid request from test.");
    }

    const hashedPassword = await PasswordHasher.hashPassword(password);

    const otp = OTPService.generateOTP(email);
    if (!otp) throw new Error("Unexpected error, please try again.");

    await OTPService.sendOTP(email, otp);

    const token = JWTService.generateJwtToken({ username, email, hashedPassword, role });
    if (!token) throw new Error("Unexpected error, please try again.");

    return { success: true, message: `OTP sent to email`, token };

  }
}
