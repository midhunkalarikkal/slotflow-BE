import { Request, Response } from 'express';
import { VerifyOTPUseCase } from '../../core/use-cases/user/verify-otp.use-case';
import { RegisterUserUseCase } from '../../core/use-cases/user/register-user.use-case';
import { UserRepositoryImpl } from '../../infrastructure/database/user/user.repository.impl';

const userRepositoryImpl = new UserRepositoryImpl();
const registerUserUseCase = new RegisterUserUseCase(userRepositoryImpl);
const verifyOTPUseCase = new VerifyOTPUseCase(userRepositoryImpl);

export class UserController {
  
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private verifyOTPUseCase: VerifyOTPUseCase
  ) {this.registerUser = this.registerUser.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);}

  async registerUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const result = await this.registerUserUseCase.execute(username, email, password);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.log("error : ",error);
      res.status(500).json({ success: false, message: "Internal Server Error", error: error });
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const { token, otp } = req.body;
      const result = await this.verifyOTPUseCase.execute(token, otp);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error", error: error });
    }
  }
}

const userController = new UserController(registerUserUseCase, verifyOTPUseCase);
export { userController };
