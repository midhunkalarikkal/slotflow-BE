import { User } from '../../../domain/entities/user.entity';
import { Provider } from '../../../domain/entities/provider.entity';
import { Validator } from '../../../infrastructure/validator/validator';
import { OTPService } from '../../../infrastructure/services/otp.service';
import { CommonResponse } from '../../../shared/interface/commonInterface';
import { UserRepositoryImpl } from '../../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../../infrastructure/database/provider/provider.repository.impl';


interface ResendOtpResProps extends CommonResponse {
  authUser: {
    verificationToken: string, 
    role: string 
  }
}


export class ResendOtpUseCase {

  constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl) { }

  async execute(role: string, verificationToken?: string, email?: string): Promise<ResendOtpResProps> {

    if(!role || (!verificationToken && !email)) throw new Error("Invalid request.");
    if(email) Validator.validateEmail(email);

    let userOrProvider: Provider | User | null = null;

    if (email && role) {
      if (role === "USER") {
        userOrProvider = await this.userRepository.findUserByEmail(email);
      } else if (role === "PROVIDER") {
        userOrProvider = await this.providerRepository.findProviderByEmail(email);
      } else {
        throw new Error("Invalid request.");
      }

    } else if (verificationToken && role) {
      if (role === "USER") {
        userOrProvider = await this.userRepository.verifyUser(verificationToken);
      } else if (role === "PROVIDER") {
        userOrProvider = await this.providerRepository.verifyProvider(verificationToken);
      } else {
        throw new Error("Invalid request.");
      }
    }

    if (!userOrProvider || !userOrProvider?.email || !userOrProvider?.verificationToken) throw new Error("Please register.")

    const otp = OTPService.generateOTP(userOrProvider?.verificationToken);
    if (!otp) throw new Error("Unexpected error, please try again.");
  
    await OTPService.sendOTP(userOrProvider?.email, otp);

    return { success: true, message: `OTP sent to email.`, authUser: {verificationToken: userOrProvider.verificationToken, role } };

  }
}
