import { Request, Response } from 'express';
import { appConfig } from '../../config/env';
import { HandleError } from '../../infrastructure/error/error';
import { LoginUseCase } from '../../application/auth-use.case/login.use-case';
import { RegisterUseCase } from '../../application/auth-use.case/register.use-case';
import { ResendOtpUseCase } from '../../application/auth-use.case/resend-otp.use-case';
import { VerifyOTPUseCase } from '../../application/auth-use.case/verify-otp.use-case';
import { UserRepositoryImpl } from '../../infrastructure/database/user/user.repository.impl';
import { UpdatePasswordUseCase } from '../../application/auth-use.case/updatePassword.use-case';
import { CheckUserStatusUseCase } from '../../application/auth-use.case/checkUserStatus.use-case';
import { ProviderRepositoryImpl } from '../../infrastructure/database/provider/provider.repository.impl';
import { LoginZodSchema, OTPVerificationZodSchema, RegisterZodSchema, ResendOTPZodSchema, UpdatePasswordZodSchema } from '../../infrastructure/zod/auth.zod';

const userRepositoryImpl = new UserRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();
const loginUseCase = new LoginUseCase(userRepositoryImpl, providerRepositoryImpl);
const registerUseCase = new RegisterUseCase(userRepositoryImpl, providerRepositoryImpl);
const verifyOTPUseCase = new VerifyOTPUseCase(userRepositoryImpl, providerRepositoryImpl);
const resendOtpUseCase = new ResendOtpUseCase(userRepositoryImpl, providerRepositoryImpl);
const updatePasswordUseCase = new UpdatePasswordUseCase(userRepositoryImpl, providerRepositoryImpl);
const checkUserStatusUseCase = new CheckUserStatusUseCase(userRepositoryImpl, providerRepositoryImpl);

export class AuthController {

  constructor(
    private registerUseCase: RegisterUseCase,
    private verifyOTPUseCase: VerifyOTPUseCase,
    private resendOtpUseCase: ResendOtpUseCase,
    private loginUseCase: LoginUseCase,
    private updatePasswordUseCase: UpdatePasswordUseCase,
    private checkUserStatusUseCase: CheckUserStatusUseCase
  ) {
    this.register = this.register.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.resendOtp = this.resendOtp.bind(this);
    this.login = this.login.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.checkUserStatus = this.checkUserStatus.bind(this);
  }

  async register(req: Request, res: Response) {
    try {
      const validateData = RegisterZodSchema.parse(req.body);
      const { username, email, password, role } = validateData;
      if (!username || !email || !password || !role) throw new Error("Invalid request");
      
      const result = await this.registerUseCase.execute({username, email, password, role});

      res.cookie("token", result.authUser.token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: appConfig.nodeEnv !== 'development'
      });

      const { token: token, ...authUserWithoutToken } = result.authUser;
      const resultWithoutToken = {
        ...result,
        authUser: authUserWithoutToken,
    };

      res.status(200).json(resultWithoutToken);

    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const validateData = OTPVerificationZodSchema.parse(req.body);
      const { otp, verificationToken, role } = validateData;
      if (!otp || !verificationToken || !role) throw new Error("Invalid request.");
      const result = await this.verifyOTPUseCase.execute({otp, verificationToken, role});
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const validateData = ResendOTPZodSchema.parse(req.body);
      const { role, verificationToken, email } = validateData;
      if (!role || (!verificationToken && !email)) throw new Error("Invalid request.");
      const result = await this.resendOtpUseCase.execute({role, verificationToken, email});
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validateData = LoginZodSchema.parse(req.body);
      const { email, password, role } = validateData;
      if (!email || !password || !role) throw new Error("Invalid request.");
      const { success, message, authUser } = await this.loginUseCase.execute({email, password, role});
      res.cookie("token", authUser.token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: appConfig.nodeEnv !== 'development'
      });
      const { token: token, ...authUserWithoutToken } = authUser;
      const resultWithoutToken = {
        success, message,
        authUser: authUserWithoutToken,
      };
      res.status(200).json(resultWithoutToken);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("token");
      res.status(200).json({ success: true, message: "Logged out successfully." });
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const validateData = UpdatePasswordZodSchema.parse(req.body);
      const { role, verificationToken, password } = validateData;
      if (!role || !verificationToken || !password) throw new Error("Invalid request.");
      const result = await this.updatePasswordUseCase.execute({role, verificationToken, password});
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async checkUserStatus(req: Request, res: Response) {
    try {
      const user = req.user;
      const result = await this.checkUserStatusUseCase.execute(user.userOrProviderId, user.role);
      res.status(result.status).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }
}

const authController = new AuthController(registerUseCase, verifyOTPUseCase, resendOtpUseCase, loginUseCase, updatePasswordUseCase, checkUserStatusUseCase);
export { authController };
