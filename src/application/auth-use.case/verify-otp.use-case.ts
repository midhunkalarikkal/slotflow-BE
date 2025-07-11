import { ApiResponse } from '../../infrastructure/dtos/common.dto';
import { OTPService } from '../../infrastructure/services/otp.service';
import { validateOrThrow } from '../../infrastructure/validator/validator';
import { OTPVerificationRequest } from '../../infrastructure/dtos/auth.dto';
import { UserRepositoryImpl } from '../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../infrastructure/database/provider/provider.repository.impl';


export class VerifyOTPUseCase {
  constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl) { }

  async execute(data: OTPVerificationRequest): Promise<ApiResponse> {
    const { otp, verificationToken, role } = data;
    if(!otp || !verificationToken || !role) throw new Error("Invalid request.");
    
    validateOrThrow("otp", otp);
    validateOrThrow("role", role);

    const isValidOTP = await OTPService.verifyOTP(verificationToken, otp);
    if (!isValidOTP) throw new Error("Invalid or expired OTP.");  
      
    if (role === "USER") {
      const user = await this.userRepository.verifyUser(verificationToken);
      if(!user) throw new Error("Verification failed");

      user.isEmailVerified = true;
      await this.userRepository.updateUser(user);
      
    } else if (role === "PROVIDER") {
      const provider = await this.providerRepository.verifyProvider(verificationToken);
      if(!provider) throw new Error("Verification failed");

      provider.isEmailVerified = true;
      const updateProvider = await this.providerRepository.updateProvider(provider);
      if(!updateProvider) throw new Error("Unexpected error, please try again.");
      
    }else{
      throw new Error("Unexpected error, please try again."); 
    }

    return { success: true, message: 'OTP verified successfully.' };  
  }
}
