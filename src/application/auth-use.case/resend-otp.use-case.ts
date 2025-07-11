import { User } from '../../domain/entities/user.entity';
import { Provider } from '../../domain/entities/provider.entity';
import { ApiResponse } from '../../infrastructure/dtos/common.dto';
import { ResendOtpRequest } from '../../infrastructure/dtos/auth.dto';
import { OTPService } from '../../infrastructure/services/otp.service';
import { validateOrThrow } from '../../infrastructure/validator/validator';
import { UserRepositoryImpl } from '../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../infrastructure/database/provider/provider.repository.impl';


interface ResendOtpResponse extends ApiResponse {
  authUser: {
    verificationToken: string, 
    role: string 
  }
}


export class ResendOtpUseCase {

  constructor(private userRepositoryImpl: UserRepositoryImpl, private providerRepositoryImpl: ProviderRepositoryImpl) { }

  async execute(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    const { role, verificationToken, email } = data;
    if(!role || (!verificationToken && !email)) throw new Error("Invalid request.");

    if(email) validateOrThrow("email", email);
    validateOrThrow("role", role);

    let userOrProvider: Provider | User | null = null;

    if (email && role) {
      if (role === "USER") {
        userOrProvider = await this.userRepositoryImpl.findUserByEmail(email);
      } else if (role === "PROVIDER") {
        userOrProvider = await this.providerRepositoryImpl.findProviderByEmail(email);
      } else {
        throw new Error("Invalid request.");
      }

    } else if (verificationToken && role) {
      if (role === "USER") {
        userOrProvider = await this.userRepositoryImpl.verifyUser(verificationToken);
      } else if (role === "PROVIDER") {
        userOrProvider = await this.providerRepositoryImpl.verifyProvider(verificationToken);
      } else {
        throw new Error("Invalid request.");
      }
    }

    if (!userOrProvider || !userOrProvider?.email || !userOrProvider?.verificationToken) throw new Error("Please register.")

    const otp = await OTPService.setOtp(userOrProvider?.verificationToken);
    if (!otp) throw new Error("Unexpected error, please try again.");
  
    await OTPService.sendOTP(userOrProvider?.email, otp);

    return { success: true, message: `OTP sent to email.`, authUser: {verificationToken: userOrProvider.verificationToken, role } };

  }
}
