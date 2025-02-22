import { Request, Response } from 'express';
import { HandleError } from '../../infrastructure/error/error';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { VerifyOTPUseCase } from '../../application/use-cases/auth/verify-otp.use-case';
import { UserRepositoryImpl } from '../../infrastructure/database/user/user.repository.impl';
import { ProviderRepositoryImpl } from '../../infrastructure/database/provider/provider.repository.impl';

const userRepositoryImpl = new UserRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();
const registerUseCase = new RegisterUseCase(userRepositoryImpl, providerRepositoryImpl);
const verifyOTPUseCase = new VerifyOTPUseCase(userRepositoryImpl, providerRepositoryImpl);

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private verifyOTPUseCase: VerifyOTPUseCase
  ) {
    this.register = this.register.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    }

  async register(req: Request, res: Response) {
    try {
      const { username, email, password, role } = req.body;
      const result = await this.registerUseCase.execute(username, email, password, role);
      res.status(201).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }      
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { token, otp } = req.body;
      const result = await this.verifyOTPUseCase.execute(token, otp);
      res.status(200).json(result);
    } catch (error) {
      HandleError.handle(error, res);
    }
  }
}

const authController = new AuthController(registerUseCase, verifyOTPUseCase);
export { authController };
