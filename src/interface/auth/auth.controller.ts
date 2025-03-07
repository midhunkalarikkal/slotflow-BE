import { Request, Response } from 'express';
import { appConfig } from '../../config/env';
import { HandleError } from '../../infrastructure/error/error';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { ResendOtpUseCase } from '../../application/use-cases/auth/resend-otp.use-case';
import { VerifyOTPUseCase } from '../../application/use-cases/auth/verify-otp.use-case';
import { UserRepositoryImpl } from '../../infrastructure/database/user/user.repository.impl';
import { UpdatePasswordUseCase } from '../../application/use-cases/auth/updatePassword.use-case';
import { ProviderRepositoryImpl } from '../../infrastructure/database/provider/provider.repository.impl';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/auth/refreshAccessToekn.use-case';

const userRepositoryImpl = new UserRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();
const refreshAccessToeknUseCase = new RefreshAccessTokenUseCase();
const loginUseCase = new LoginUseCase(userRepositoryImpl, providerRepositoryImpl);
const registerUseCase = new RegisterUseCase(userRepositoryImpl, providerRepositoryImpl);
const verifyOTPUseCase = new VerifyOTPUseCase(userRepositoryImpl, providerRepositoryImpl);
const resendOtpUseCase = new ResendOtpUseCase(userRepositoryImpl, providerRepositoryImpl);
const updatePasswordUseCase = new UpdatePasswordUseCase(userRepositoryImpl, providerRepositoryImpl);

export class AuthController {

  constructor(
    private registerUseCase: RegisterUseCase,
    private verifyOTPUseCase: VerifyOTPUseCase,
    private resendOtpUseCase: ResendOtpUseCase,
    private loginUseCase: LoginUseCase,
    private refreshAccessToeknUseCase: RefreshAccessTokenUseCase,
    private updatePasswordUseCase: UpdatePasswordUseCase,
  ) {
    this.register = this.register.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.resendOtp = this.resendOtp.bind(this);
    this.login = this.login.bind(this);
    this.refreshAccessToken = this.refreshAccessToken.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  async register(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;
      const result = await this.registerUseCase.execute(username, email, password, role);
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { otp, verificationToken, role } = req.body;
      const result = await this.verifyOTPUseCase.execute(otp,verificationToken, role);
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
      const { success, message, token, authUser } = await this.loginUseCase.execute(email, password, role);
        res.cookie("token", token, {
            maxAge: 2 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: appConfig.nodeEnv !== 'development'
        });
    res.status(200).json({ success, message, authUser, token });
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

  async refreshAccessToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new Error("Toekn not found");
      const result = await this.refreshAccessToeknUseCase.execute(refreshToken);
      res.status(200).json(result);
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
}

const authController = new AuthController(registerUseCase, verifyOTPUseCase, resendOtpUseCase, loginUseCase, refreshAccessToeknUseCase, updatePasswordUseCase);
export { authController };
