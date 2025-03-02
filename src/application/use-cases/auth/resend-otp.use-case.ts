
import { User } from '../../../domain/entities/user.entity';
import { Provider } from '../../../domain/entities/provider.entity';
import { OTPService } from '../../../infrastructure/services/otp.service';
import { UserRepositoryImpl } from '../../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../../infrastructure/database/provider/provider.repository.impl';

export class ResendOtpUseCase {

  constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl) {}

  async execute(verificationToken: string, role: string): Promise<{ success: boolean; message: string}> {
    
    let userOrProvider : Provider | User | null;

    if(role === "USER"){
      userOrProvider = await this.userRepository.getVerificationData(verificationToken);
    }else if(role === "PROVIDER"){
      userOrProvider = await this.providerRepository.getVerificationData(verificationToken);
    }else{
      throw new Error("Please register again.");
    }

    const otp = OTPService.generateOTP(verificationToken);
    if (!otp) throw new Error("Unexpected error, please try again.");

    await OTPService.sendOTP(userOrProvider?.email!, otp);

    return { success: true, message: `OTP sent to email.` };

  }
}
