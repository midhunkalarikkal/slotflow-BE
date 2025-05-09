import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../domain/entities/user.entity';
import { JWTService } from '../../../infrastructure/security/jwt';
import { Provider } from '../../../domain/entities/provider.entity';
import { Validator } from '../../../infrastructure/validator/validator';
import { OTPService } from '../../../infrastructure/services/otp.service';
import { CommonResponse } from '../../../shared/interface/commonInterface';
import { PasswordHasher } from '../../../infrastructure/security/password-hashing';
import { UserRepositoryImpl } from '../../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../../infrastructure/database/provider/provider.repository.impl';

interface RegisterResProps extends CommonResponse {
  authUser: {
    verificationToken: string, 
    role: string, 
    token: string
  }
}

export class RegisterUseCase {

  constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl) { }

  async execute(username: string, email: string, password: string, role: string): Promise<RegisterResProps> {

    if(!username || !email || !password || !role) throw new Error("Invalid request");
    Validator.validateUsername(username);
    Validator.validateEmail(email);
    Validator.validatePassword(password);

    let userOrProvider: Partial<Provider> | Partial<User> | null;

    if (role === "USER") {
      userOrProvider = await this.userRepository.findUserByEmail(email);
      if (userOrProvider?.isEmailVerified) throw new Error("Email already exist.");
    } else if (role === "PROVIDER") {
      userOrProvider = await this.providerRepository.findProviderByEmail(email);
      if (userOrProvider?.isEmailVerified) throw new Error("Email already exist.");
    } else {
      throw new Error("Invalid request.");
    }

    const hashedPassword = await PasswordHasher.hashPassword(password);

    const verificationToken = uuidv4();
    if (!verificationToken) throw new Error("Unexpected error, please try again.");

    const otp = OTPService.generateOTP(verificationToken!);
    if (!otp) throw new Error("Unexpected error, please try again.");

    await OTPService.sendOTP(email, otp);

    if (userOrProvider) {
      userOrProvider.verificationToken = verificationToken;
      userOrProvider.password = hashedPassword;
      if (role === "USER") {
        await this.userRepository.updateUser(userOrProvider as User);
      } else if (role === "PROVIDER") {
        await this.providerRepository.updateProvider(userOrProvider as Provider);
      }
    } else {
      if (role === "USER") {
       await this.userRepository.createUser({
          username: username,
          email: email,
          password: hashedPassword,
          verificationToken: verificationToken,
        });
      } else if (role === "PROVIDER") {
        await this.providerRepository.createProvider({
          username: username,
          email: email,
          password: hashedPassword,
          verificationToken: verificationToken
        });
      }
    }
    
    const token = JWTService.generateToken({email, role});

    return { success: true, message: `OTP sent to email`, authUser: {verificationToken, role, token} };
  }
}
