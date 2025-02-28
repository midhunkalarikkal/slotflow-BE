import { User } from '../../../domain/entities/user.entity';
import { JWTService } from '../../../infrastructure/security/jwt';
import { Provider } from '../../../domain/entities/provider.entity';
import { Validator } from '../../../infrastructure/validator/validator';
import { OTPService } from '../../../infrastructure/services/otp.service';
import { UserRepositoryImpl } from '../../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../../infrastructure/database/provider/provider.repository.impl';

export class VerifyOTPUseCase {
  constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl) { }

  async execute(token: string, otp: string): Promise<{ success: boolean; message: string }> {

    Validator.validateOtp(otp);

    const decoded = JWTService.verifyJwtToken(token) as { username: string, email: string, hashedPassword: string, role: string };
    if (!decoded) throw new Error("Unexpected error, please try again.");

    const isValidOTP = OTPService.verifyOTP(decoded.email, otp);
    if (!isValidOTP) throw new Error("Invalid or expired OTP.");  
      
    if (decoded.role === "USER") {
      const user = new User(decoded.username, decoded.email, decoded.hashedPassword, null, null, null, false, true)
      await this.userRepository.createUser(user);
    } else if (decoded.role === "PROVIDER") {
      const provider = new Provider(decoded.username, decoded.email, decoded.hashedPassword, null, null, null, null, null, false, true)
      await this.providerRepository.createProvider(provider);
    }else{
      throw new Error("Unexpected error, please try again."); 
    }
    
    return { success: true, message: 'OTP verified successfully.' };  
  }
}
