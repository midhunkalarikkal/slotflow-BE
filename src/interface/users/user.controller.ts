import { NextFunction, Request, Response } from 'express';
import { HandleError } from '../../infrastructure/error/error';
import { VerifyOTPUseCase } from '../../application/use-cases/user/verify-otp.use-case';
import { UserRepositoryImpl } from '../../infrastructure/database/user/user.repository.impl';
import { RegisterUserUseCase } from '../../application/use-cases/user/register-user.use-case';

const userRepositoryImpl = new UserRepositoryImpl();
const registerUserUseCase = new RegisterUserUseCase(userRepositoryImpl);
const verifyOTPUseCase = new VerifyOTPUseCase(userRepositoryImpl);

export class UserController {
  
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private verifyOTPUseCase: VerifyOTPUseCase
  ) {
    this.registerUser = this.registerUser.bind(this); // Bind in constructor
    this.verifyOTP = this.verifyOTP.bind(this); // Bind in constructor
    }

  async registerUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const result = await this.registerUserUseCase.execute(username, email, password);
      return res.status(201).json(result)
    } catch (error) {
      return HandleError.handle(error, res)
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { token, otp } = req.body;
      const result = await this.verifyOTPUseCase.execute(token, otp);
      return res.status(200).json(result);
    } catch (error) {
      return HandleError.handle(error, res);
    }
  }
}

const userController = new UserController(registerUserUseCase, verifyOTPUseCase);
export { userController };
