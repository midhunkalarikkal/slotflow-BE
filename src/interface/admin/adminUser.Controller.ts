import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AdminChangeUserStatusUseCase, AdminUserListUseCase } from "../../application/admin-use.case/adminUser.use-case";
import { Types } from "mongoose";

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
            const { userId, isBlocked } = req.body;
            if(!userId || isBlocked === null) throw new Error("Invalid request");
            const blockedStatus = isBlocked === "true";
            const result = await this.adminChangeUserStatusUseCase.execute({userId : new Types.ObjectId(userId), isBlocked : blockedStatus});
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
}

const adminUserController = new AdminUserController(adminUserListUseCase, adminChangeUserStatusUseCase);
export { adminUserController };

