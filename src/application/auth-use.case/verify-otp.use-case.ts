import { Validator } from '../../infrastructure/validator/validator';
import { CommonResponse } from '../../infrastructure/dtos/common.dto';
import { OTPService } from '../../infrastructure/services/otp.service';
import { OTPVerificationUseCaseRequestPayload } from '../../infrastructure/dtos/auth.dto';
import { UserRepositoryImpl } from '../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../infrastructure/database/provider/provider.repository.impl';


export class VerifyOTPUseCase {
  constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl) { }

  async execute(data: OTPVerificationUseCaseRequestPayload): Promise<CommonResponse> {
    const { otp, verificationToken, role } = data;
    if(!otp || !verificationToken || !role) throw new Error("Invalid request.");
    
    Validator.validateOtp(otp);
    Validator.validateRole(role);

    const isValidOTP = await OTPService.verifyOTP(verificationToken, otp);
    console.log("isValidOTP : ",isValidOTP);
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
