import { User } from "../../../domain/entities/user.entity";
import { Provider } from "../../../domain/entities/provider.entity";
import { PasswordHasher } from "../../../infrastructure/security/password-hashing";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

export class UpdatePasswordUseCase {
    constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl){}

    async execute(role: string, verificationToken: string, password: string): Promise<{success: boolean, message: string}>{
        
        if(!role || !verificationToken || !password){
            throw new Error("Invalid Request");
        }

        const hashedPassword = await PasswordHasher.hashPassword(password);
        if(role === "USER"){
            const user = await this.userRepository.getVerificationData(verificationToken);
            if(!user) throw new Error("User not found.");

            user.password = hashedPassword;
            await this.userRepository.updateUser(user as User);
            
        }else if(role === "PROVIDER"){
            const provider = await this.providerRepository.getVerificationData(verificationToken);
            if(!provider) throw new Error("User not found.");
            
            provider.password = hashedPassword;
            await this.providerRepository.updateProvider(provider as Provider);
        }
        return {success: true, message: "Password updated successfully."};
    }
}