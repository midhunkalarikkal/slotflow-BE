import { Types } from "mongoose";
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

    async execute(email: string, password: string, role: string): Promise<{ success: boolean; message: string,  authUser: { username: string, profileImage: string | null, role: string, token: string, isLoggedIn: boolean, address?: boolean, serviceDetails?: boolean,serviceAvailability?: boolean, approved?: boolean} }> {
        
        if(!email || !password || !role) throw new Error("Invalid request.");
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
            const token = JWTService.generateToken({email: email, role : role});
            return { success: true, message: "Logged In Successfully.", authUser: { username: "Admin", profileImage: "", role: role, token, isLoggedIn: true} };
        }else{
            throw new Error("Invalid request.");
        }

        if(!userOrProvider) throw new Error("Invalid credentials")

        if(userOrProvider.isBlocked) throw new Error("Your account is blocked, please contact us.");
        if(!userOrProvider.isEmailVerified) throw new Error("Your registration was incomplete, please register again.");
        
        const valid = await PasswordHasher.comparePassword(password, userOrProvider.password);
        if(!valid) throw new Error("Invalid credentials.");
        
        const token = JWTService.generateToken({userOrProviderId: userOrProvider._id, role : role});

        let address;
        let serviceDetails;
        let serviceAvailability;
        let approved;

        if(role === "PROVIDER"){
            address = (userOrProvider as Provider).addressId ? true : false;
            serviceDetails = (userOrProvider as Provider).serviceId ? true : false;
            serviceAvailability = (userOrProvider as Provider).serviceAvailabilityId ? true : false;
            approved = (userOrProvider as Provider).isAdminVerified ? true : false;
        }

        return { success: true, message: 'Logged In Successfully.', authUser : {username : userOrProvider.username, profileImage: userOrProvider.profileImage, role: role, token, isLoggedIn: true, address, serviceDetails, serviceAvailability, approved }};
    }
}