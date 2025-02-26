import { User } from "../../../domain/entities/user.entity";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";

export class UserUseCase { 
    constructor(private userRepository : UserRepositoryImpl){}

    
}