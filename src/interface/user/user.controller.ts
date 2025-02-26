import { Request, Response } from "express";
import { UserUseCase } from "../../application/use-cases/user/user.Use-Case";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { HandleError } from "../../infrastructure/error/error";

const userRepositoryImpl = new UserRepositoryImpl();
const userUseCase = new UserUseCase(userRepositoryImpl);

export class UserController {
    constructor(
        private userUseCase : UserUseCase
    ){
        
    }

    
}

const userController = new UserController(userUseCase);
export { userController };