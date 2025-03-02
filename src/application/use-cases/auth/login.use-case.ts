import { adminConfig } from "../../../config/env";
import { User } from "../../../domain/entities/user.entity";
import { JWTService } from "../../../infrastructure/security/jwt";
import { Provider } from "../../../domain/entities/provider.entity";
import { Validator } from "../../../infrastructure/validator/validator";
import { PasswordHasher } from "../../../infrastructure/security/password-hashing";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

export class LoginUseCase {
    constructor(private userRepository: UserRepositoryImpl, private providerRepository: ProviderRepositoryImpl){ }

    async execute(email: string, password: string, role: string): Promise<{ success: boolean; message: string, accessToken?: string, refreshToken?: string, role?: string,  userData?: {username: string, profileImage: string | null} }> {
        
        Validator.validateEmail(email);
        Validator.validatePassword(password);
    
        let userOrProvider : User | Provider | null = null;

        if(role === "USER"){   
            userOrProvider = await this.userRepository.findUserByEmail(email);
        }else if(role === "PROVIDER"){
            userOrProvider = await this.providerRepository.findProviderByEmail(email);
            if(!userOrProvider?.isVerified) throw new Error("Your admin verication is pending.");
        }else if(role === "ADMIN"){
            if (email !== adminConfig.adminEmail || password !== adminConfig.adminPassword) {
                throw new Error("Invalid credentials.");
            }
            const accessToken = JWTService.generateAccessToken({email: email, role : role});
            const refreshToken = JWTService.generateRefreshToken({email: email, role : role});
            return { success: true, message: "Logged In Successfully.", accessToken, refreshToken, role };
        }else{
            throw new Error("Invalid request.");
        }

        if(!userOrProvider) throw new Error("Invalid credentials.");
        
        const valid = await PasswordHasher.comparePassword(password, userOrProvider.password);
        if(!valid) throw new Error("Invalid credentials.");
        
        const accessToken = JWTService.generateAccessToken({userOrProviderId: userOrProvider._id, role : role});
        const refreshToken = JWTService.generateRefreshToken({userOrProviderId: userOrProvider._id, role : role});

        return { success: true, message: 'Logged In Successfully.', accessToken, refreshToken, role, userData : {username : userOrProvider.username, profileImage: userOrProvider.profileImage }};
    }
}