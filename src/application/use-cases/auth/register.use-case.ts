import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../domain/entities/user.entity';
import { Provider } from '../../../domain/entities/provider.entity';
import { Validator } from '../../../infrastructure/validator/validator';
import { OTPService } from '../../../infrastructure/services/otp.service';
import { PasswordHasher } from '../../../infrastructure/security/password-hashing';
import { UserRepositoryImpl } from '../../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../../infrastructure/database/provider/provider.repository.impl';

export class RegisterUseCase {

  constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl) { }

  async execute(username: string, email: string, password: string, role: string): Promise<{ success: boolean; message: string, verificationToken: string, role: string }> {

    Validator.validateUsername(username);
    Validator.validateEmail(email);
    Validator.validatePassword(password);

    let userOrProvider: Provider | User | null;

    if (role === "USER") {
      userOrProvider = await this.userRepository.findUserByEmail(email);
      if (userOrProvider?.isEmailVerified) throw new Error("Email already exist.");
    } else if (role === "PROVIDER") {
      userOrProvider = await this.providerRepository.findProviderByEmail(email);
      if (userOrProvider?.isEmailVerified) throw new Error("Email already exist.");
    } else {
      throw new Error("Invalid request from test.");
    }

    const hashedPassword = await PasswordHasher.hashPassword(password);

    const verificationToken = uuidv4();
    if (!verificationToken) throw new Error("Unexpected error, please try again.");

    const otp = OTPService.generateOTP(verificationToken!);
    if (!otp) throw new Error("Unexpected error, please try again.");

    await OTPService.sendOTP(email, otp);

    if (userOrProvider) {
      if (role === "USER") {
        userOrProvider.verificationToken = verificationToken;
        userOrProvider.password = hashedPassword;
        await this.userRepository.updateUser(userOrProvider as User);
      } else if (role === "PROVIDER") {
        userOrProvider.verificationToken = verificationToken;
        userOrProvider.password = hashedPassword;
        await this.providerRepository.updateProvider(userOrProvider as Provider);
      }
    } else {
      if (role === "USER") {
        await this.userRepository.createUser({
          username: username,
          email: email,
          password: hashedPassword,
          phone: null,
          profileImage: null,
          addressId: null,
          isBlocked: false,
          isEmailVerified: false,
          verificationToken: verificationToken,
        });
      } else if (role === "PROVIDER") {
        await this.providerRepository.createProvider({
          username: username,
          email: email,
          password: hashedPassword,
          phone: null,
          profileImage: null,
          addressId: null,
          serviceId: null,
          subscription: null,
          isBlocked: false,
          isEmailVerified: false,
          isAdminVerified: false,
          verificationToken: verificationToken
        });
      }
    }

    return { success: true, message: `OTP sent to email`, verificationToken, role };
  }
}
