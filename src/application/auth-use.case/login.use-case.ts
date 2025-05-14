import { adminConfig } from "../../config/env";
import { generateSignedUrl } from "../../config/aws_s3";
import { User } from "../../domain/entities/user.entity";
import { JWTService } from "../../infrastructure/security/jwt";
import { Provider } from "../../domain/entities/provider.entity";
import { Validator } from "../../infrastructure/validator/validator";
import { PasswordHasher } from "../../infrastructure/security/password-hashing";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { LoginUseCaseRequestPayload, LoginUseCaseResponse } from "../../infrastructure/dtos/auth.dto";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";


export class LoginUseCase {
    constructor(private userRepositoryImpl: UserRepositoryImpl, private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute(data: LoginUseCaseRequestPayload): Promise<LoginUseCaseResponse> {
        const { email, password, role } = data;
        
        if (!email || !password || !role) throw new Error("Invalid request.");
        Validator.validateEmail(email);
        Validator.validatePassword(password);

        let userOrProvider: User | Provider | null = null;

        if (role === "USER") {
            userOrProvider = await this.userRepositoryImpl.findUserByEmail(email);
        } else if (role === "PROVIDER") {
            userOrProvider = await this.providerRepositoryImpl.findProviderByEmail(email);
        } else if (role === "ADMIN") {
            if (email !== adminConfig.adminEmail || password !== adminConfig.adminPassword) {
                throw new Error("Invalid credentials.");
            }
            const token = JWTService.generateToken({ email: email, role: role });
            return { success: true, message: "Logged In Successfully.", authUser: { username: "Admin", profileImage: "", role: role, token, isLoggedIn: true } };
        } else {
            throw new Error("Invalid request.");
        }

        if (!userOrProvider) throw new Error("Invalid credentials")

        if (userOrProvider.isBlocked) throw new Error("Your account is blocked, please contact us.");
        if (!userOrProvider.isEmailVerified) throw new Error("Your registration was incomplete, please register again.");

        const valid = await PasswordHasher.comparePassword(password, userOrProvider.password);
        if (!valid) throw new Error("Invalid credentials.");

        const token = JWTService.generateToken({ userOrProviderId: userOrProvider._id, role: role });

        let address;
        let serviceDetails;
        let serviceAvailability;
        let approved;
        let updateProfileImage;

        if (role === "PROVIDER") {
            address = (userOrProvider as Provider).addressId ? true : false;
            serviceDetails = (userOrProvider as Provider).serviceId ? true : false;
            serviceAvailability = (userOrProvider as Provider).serviceAvailabilityId ? true : false;
            approved = (userOrProvider as Provider).isAdminVerified ? true : false;
        }

        if (userOrProvider.profileImage) {
            const userOrProviderProfileUrl = userOrProvider.profileImage;
            if (!userOrProviderProfileUrl) throw new Error("Profile image fetching error.");
            const urlParts = userOrProviderProfileUrl?.split('/');
            if (!urlParts) throw new Error("UrlParts error.");
            const s3Key = urlParts.slice(3).join('/');
            if (!s3Key) throw new Error("Image retrieving.");
            const signedUrl = await generateSignedUrl(s3Key);
            if (!signedUrl) throw new Error("Image fetching error.");
            updateProfileImage = signedUrl
        }

        return { success: true, message: 'Logged In Successfully.', authUser: { username: userOrProvider.username, profileImage: updateProfileImage ? updateProfileImage : userOrProvider.profileImage, role: role, token, isLoggedIn: true, address, serviceDetails, serviceAvailability, approved } };
    }
}