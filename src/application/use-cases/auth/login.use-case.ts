import { User } from "../../../domain/entities/user.entity";
import { JWTService } from "../../../infrastructure/security/jwt";
import { Provider } from "../../../domain/entities/provider.entity";
import { Validator } from "../../../infrastructure/validator/validator";
import { PasswordHasher } from "../../../infrastructure/security/password-hashing";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { adminConfig } from "../../../config/env";

export class LoginUseCase {
    constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl){ }

    async execute(email: string, password: string, role: string): Promise<{ success: boolean; message: string, token?: string,role?: string,  userData?: {username: string, profileImage: string | null} }> {
        
        Validator.validateEmail(email);
        Validator.validatePassword(password);
    
        let userOrProvider : User | Provider | null = null;

        if(role === "USER"){   
            userOrProvider = await this.userRepository.findUserByEmail(email);
        }else if(role === "PROVIDER"){
            userOrProvider = await this.providerRepository.findProviderByEmail(email);
        }else if(role === "ADMIN"){
            if (email !== adminConfig.adminEmail || password !== adminConfig.adminPassword) {
                throw new Error("Invalid credentials.");
            }
            const token = JWTService.generateJwtToken({email, role})
            return { success: true, message: "Logged In Successfully.", token, role };
        }else{
            throw new Error("Invalid request.");
        }

        if(!userOrProvider) throw new Error("Invalid credentials.");
        
        const valid = await PasswordHasher.comparePassword(password, userOrProvider.password);
        if(!valid) throw new Error("Invalid credentials.");
        
        const token = JWTService.generateJwtToken({userOrProviderId : userOrProvider._id})
        return { success: true, message: 'Logged In Successfully.', token, role, userData : {username : userOrProvider.username, profileImage: userOrProvider.profileImage }};
    }
}