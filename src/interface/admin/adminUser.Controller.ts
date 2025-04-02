import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AdminChangeUserStatusUseCase, AdminUserListUseCase } from "../../application/use-cases/admin/adminUser.use-case";

const userRepositoryImpl = new UserRepositoryImpl();
const adminUserListUseCase = new AdminUserListUseCase(userRepositoryImpl);
const adminChangeUserStatusUseCase = new AdminChangeUserStatusUseCase(userRepositoryImpl);

class AdminUserController {
    constructor(
        private adminUserListUseCase : AdminUserListUseCase,
        private adminChangeUserStatusUseCase : AdminChangeUserStatusUseCase,
    ){
        this.getAllUsers = this.getAllUsers.bind(this);
        this.changeUserStatus = this.changeUserStatus.bind(this);
    }

    async getAllUsers(req: Request, res: Response) {
        try{
            const result = await this.adminUserListUseCase.execute();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async changeUserStatus(req: Request, res: Response) {
        try{
            const { userId, status } = req.body;
            if(!userId || status === null) throw new Error("Invalid request");
            const result = await this.adminChangeUserStatusUseCase.execute(userId, status);
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
}

const adminUserController = new AdminUserController(adminUserListUseCase, adminChangeUserStatusUseCase);
export { adminUserController };

