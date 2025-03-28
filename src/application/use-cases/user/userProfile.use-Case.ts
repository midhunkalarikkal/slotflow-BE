import { Types } from "mongoose";
import { User } from "../../../domain/entities/user.entity";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";

type UserFetchProfileDetailsResProps = Pick<User, "username" | "email" | "isBlocked" | "isEmailVerified" | "phone" | "createdAt">;

export class UserFetchProfileDetailsUseCase { 
    constructor(private userRepository : UserRepositoryImpl) { }

    async execute(userId: string): Promise<{ success: boolean, message: string, profileDetails: UserFetchProfileDetailsResProps}> {
        if(!userId) throw new Error("Invalid request.");
        const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
        if(!user) throw new Error("User not found.");
        const {_id, password, profileImage, updatedAt, addressId, bookingsId, verificationToken, ...data} = user;
        return { success: true, message: "User profile details fetched.", profileDetails: data};
    } 
}