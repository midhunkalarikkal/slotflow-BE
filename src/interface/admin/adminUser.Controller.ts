import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { AdminChangeUserBlockStatusZOdSchema } from "../../infrastructure/zod/admin.zod";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AdminChangeUserBlockStatusUseCase, AdminUserListUseCase } from "../../application/admin-use.case/adminUser.use-case";

const userRepositoryImpl = new UserRepositoryImpl();
const adminUserListUseCase = new AdminUserListUseCase(userRepositoryImpl);
const adminChangeUserBlockStatusUseCase = new AdminChangeUserBlockStatusUseCase(userRepositoryImpl);

class AdminUserController {
    constructor(
        private adminUserListUseCase : AdminUserListUseCase,
        private adminChangeUserBlockStatusUseCase : AdminChangeUserBlockStatusUseCase,
    ){
        this.getAllUsers = this.getAllUsers.bind(this);
        this.changeUserBlockStatus = this.changeUserBlockStatus.bind(this);
    }

    async getAllUsers(req: Request, res: Response) {
        try{
            const result = await this.adminUserListUseCase.execute();
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }

    async changeUserBlockStatus(req: Request, res: Response) {
        try{
            const validateData = AdminChangeUserBlockStatusZOdSchema.parse(req.body);
            const { userId, isBlocked } = validateData;
            if(!userId || isBlocked === null) throw new Error("Invalid request");
            const result = await this.adminChangeUserBlockStatusUseCase.execute({userId : new Types.ObjectId(userId), isBlocked });
            res.status(200).json(result);
        }catch(error){
            HandleError.handle(error, res);
        }
    }
}

const adminUserController = new AdminUserController(adminUserListUseCase, adminChangeUserBlockStatusUseCase);
export { adminUserController };

