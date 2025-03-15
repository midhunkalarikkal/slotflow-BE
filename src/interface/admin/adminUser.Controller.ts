import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AdminUserUseCase } from "../../application/use-cases/admin/adminUser.use-case";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";

const userRepositoryImpl = new UserRepositoryImpl();
const adminUserUseCase = new AdminUserUseCase(userRepositoryImpl);

class AdminUserController {
    constructor(
        private adminUserUseCase : AdminUserUseCase,
    ){
        this.getAllUsers = this.getAllUsers.bind(this);
        this.changeUserStatus = this.changeUserStatus.bind(this);
    }

    async getAllUsers(req: Request, res: Response) {
        try{
            const result = await this.adminUserUseCase.usersList();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async changeUserStatus(req: Request, res: Response) {
        try{
            const { userId } = req.params;
            const { status } = req.query;
            const statusValue = status === 'true';
            const result = await this.adminUserUseCase.changeStatus(userId, statusValue);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
}

const adminUserController = new AdminUserController(adminUserUseCase);
export { adminUserController };

