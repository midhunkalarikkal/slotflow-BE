import { User } from "../../domain/entities/user.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { Validator } from "../../infrastructure/validator/validator";
import { CommonResponse } from "../../infrastructure/dtos/common.dto";
import { PasswordHasher } from "../../infrastructure/security/password-hashing";
import { UpdatePasswordUseCaseRequestPayload } from "../../infrastructure/dtos/auth.dto";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";

export class UpdatePasswordUseCase {
    constructor(private userRepositoryImpl: UserRepositoryImpl, private providerRepositoryImpl: ProviderRepositoryImpl){}

    async execute(data: UpdatePasswordUseCaseRequestPayload): Promise<CommonResponse>{
        const { role, verificationToken, password } = data;

        if(!role || !verificationToken || !password)throw new Error("Invalid Request");

        Validator.validatePassword(password);
        Validator.validateRole(role);

        const hashedPassword = await PasswordHasher.hashPassword(password);

        if(role === "USER"){
            const user = await this.userRepositoryImpl.verifyUser(verificationToken);
            if(!user) throw new Error("User not found.");

            user.password = hashedPassword;
            await this.userRepositoryImpl.updateUser(user as User);
            
        }else if(role === "PROVIDER"){
            const provider = await this.providerRepositoryImpl.verifyProvider(verificationToken);
            if(!provider) throw new Error("User not found.");
            
            provider.password = hashedPassword;
            await this.providerRepositoryImpl.updateProvider(provider as Provider);
        }

        return {success: true, message: "Password updated successfully."};
    }
}