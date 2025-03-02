import { Validator } from '../../../infrastructure/validator/validator';
import { OTPService } from '../../../infrastructure/services/otp.service';
import { UserRepositoryImpl } from '../../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../../infrastructure/database/provider/provider.repository.impl';

export class VerifyOTPUseCase {
  constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl) { }

  async execute(otp: string, verificationToken: string, role: string): Promise<{ success: boolean; message: string }> {

    Validator.validateOtp(otp);

    const isValidOTP = OTPService.verifyOTP(verificationToken, otp);
    if (!isValidOTP) throw new Error("Invalid or expired OTP.");  
      
    if (role === "USER") {
      const user = await this.userRepository.getVerificationData(verificationToken);
      if(!user) throw new Error("Verification failed");

      user.isVerified = true;
      await this.userRepository.updateUser(user);
      
    } else if (role === "PROVIDER") {
      const provider = await this.providerRepository.getVerificationData(verificationToken);
      if(!provider) throw new Error("Verification failed");

      provider.isEmailVerified = true;
      await this.providerRepository.updateProvider(provider);
    }else{
      throw new Error("Unexpected error, please try again."); 
    }

    return { success: true, message: 'OTP verified successfully.' };  
  }
}
