import { Request, Response } from 'express';
import { appConfig } from '../../config/env';
import { HandleError } from '../../infrastructure/error/error';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { ResendOtpUseCase } from '../../application/use-cases/auth/resend-otp.use-case';
import { VerifyOTPUseCase } from '../../application/use-cases/auth/verify-otp.use-case';
import { UserRepositoryImpl } from '../../infrastructure/database/user/user.repository.impl';
import { UpdatePasswordUseCase } from '../../application/use-cases/auth/updatePassword.use-case';
import { CheckUserStatusUseCase } from '../../application/use-cases/auth/checkUserStatus.use-case';
import { ProviderRepositoryImpl } from '../../infrastructure/database/provider/provider.repository.impl';

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
      const { username, email, password, role } = req.body;
      const result = await this.registerUseCase.execute(username, email, password, role);
      res.cookie("token", result.authUser.token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: appConfig.nodeEnv !== 'development'
      });
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { otp, verificationToken, role } = req.body;
      const result = await this.verifyOTPUseCase.execute(otp, verificationToken, role);
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const { role, verificationToken, email } = req.body;
      const result = await this.resendOtpUseCase.execute(role, verificationToken, email);
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      const { success, message, authUser } = await this.loginUseCase.execute(email, password, role);
      res.cookie("token", authUser.token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: appConfig.nodeEnv !== 'development'
      });
      res.status(200).json({ success, message, authUser });
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
      const { role, verificationToken, password } = req.body;
      const result = await this.updatePasswordUseCase.execute(role, verificationToken, password);
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async checkUserStatus(req: Request, res: Response) {
    try{
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      const result = await this.checkUserStatusUseCase.checkStatus(token!);
      console.log("result : ",result);
      res.status(result.status).json(result);
    }catch(error){
      console.log("error : ",error);
      HandleError.handle(error, res);
    }
  }
}

const authController = new AuthController(registerUseCase, verifyOTPUseCase, resendOtpUseCase, loginUseCase, updatePasswordUseCase, checkUserStatusUseCase);
export { authController };
