import { v4 as uuidv4 } from 'uuid';
import { User } from '../../domain/entities/user.entity';
import { JWTService } from '../../infrastructure/security/jwt';
import { Provider } from '../../domain/entities/provider.entity';
import { CustomValidator, validateOrThrow, Validator } from '../../infrastructure/validator/validator';
import { OTPService } from '../../infrastructure/services/otp.service';
import { PasswordHasher } from '../../infrastructure/security/password-hashing';
import { UserRepositoryImpl } from '../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../infrastructure/database/provider/provider.repository.impl';
import { RegisterUseCaseRequestPayload, RegisterUseCaseResponse } from '../../infrastructure/dtos/auth.dto';


export class RegisterUseCase {

  constructor(private userRepositoryImpl: UserRepositoryImpl, private providerRepositoryImpl: ProviderRepositoryImpl) { }

  async execute(data: RegisterUseCaseRequestPayload): Promise<RegisterUseCaseResponse> {
    const { username, email, password, role } = data;
    if (!username || !email || !password || !role) throw new Error("Invalid request");

    validateOrThrow("username", username);
    validateOrThrow("email", email);
    validateOrThrow("password", password);
    validateOrThrow("role", role);

    let userOrProvider: Partial<Provider> | Partial<User> | null;

    if (role === "USER") {
      userOrProvider = await this.userRepositoryImpl.findUserByEmail(email);
      if (userOrProvider?.isEmailVerified) throw new Error("Email already exist.");
    } else if (role === "PROVIDER") {
      userOrProvider = await this.providerRepositoryImpl.findProviderByEmail(email);
      if (userOrProvider?.isEmailVerified) throw new Error("Email already exist.");
    } else {
      throw new Error("Invalid request.");
    }

    const hashedPassword = await PasswordHasher.hashPassword(password);

    const verificationToken = uuidv4();
    if (!verificationToken) throw new Error("Unexpected error, please try again.");

    const otp = await OTPService.setOtp(verificationToken);
    if (!otp) throw new Error("Unexpected error, please try again.");

    await OTPService.sendOTP(email, otp);

    if (userOrProvider) {
      userOrProvider.verificationToken = verificationToken;
      userOrProvider.password = hashedPassword;
      if (role === "USER") {
        await this.userRepositoryImpl.updateUser(userOrProvider as User);
      } else if (role === "PROVIDER") {
        await this.providerRepositoryImpl.updateProvider(userOrProvider as Provider);
      }
    } else {
      if (role === "USER") {
        await this.userRepositoryImpl.createUser({
          username: username,
          email: email,
          password: hashedPassword,
          verificationToken: verificationToken,
        });
      } else if (role === "PROVIDER") {
        await this.providerRepositoryImpl.createProvider({
          username: username,
          email: email,
          password: hashedPassword,
          verificationToken: verificationToken
        });
      }
    }

    const token = JWTService.generateToken({ email, role });

    return { success: true, message: `OTP sent to email`, authUser: { verificationToken, role, token } };
  }
}
