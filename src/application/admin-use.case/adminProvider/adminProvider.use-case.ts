import { Validator } from "../../../infrastructure/validator/validator";
import { OTPService } from "../../../infrastructure/services/otp.service";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { 
    AdminProviderListUseCaseResponse, 
    AdminApproveProviderUseCaseResponse, 
    AdminChangeProviderStatusUseCaseResponse, 
    AdminApproveProviderUseCaseRequestPayload, 
    AdminChangeProviderTrustTagUseCaseResponse, 
    AdminChangeProviderStatusUseCaseRequestPaylod, 
    AdminChangeProviderTrustTagUseCaseRequestPayload, 
} from "../../../infrastructure/dtos/admin.dto";


export class AdminProviderListUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute(): Promise<AdminProviderListUseCaseResponse> {
        const providers = await this.providerRepositoryImpl.findAllProviders();
        if (!providers) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched providers.", providers };
    }

}


export class AdminApproveProviderUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute(data: AdminApproveProviderUseCaseRequestPayload): Promise<AdminApproveProviderUseCaseResponse> {
        const { providerId } = data;
        if (!providerId) throw new Error("Invalid request");

        Validator.validateObjectId(providerId, "providerId");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if (!provider) throw new Error("User not found.");
        if (provider.isAdminVerified) throw new Error("Provider is already verified.");
        provider.isAdminVerified = true;
        const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
        if (!updatedProvider) throw new Error("Provider not found");
        await OTPService.sendApprovalEmail(updatedProvider.email);
        const updatedProviderData = {
            _id: updatedProvider._id,
            username: updatedProvider.username,
            email: updatedProvider.email,
            isBlocked: updatedProvider.isBlocked,
            isAdminVerified: updatedProvider.isAdminVerified,
            trustedBySlotflow: updatedProvider.trustedBySlotflow,
        };
        return { success: true, message: "Provider approved successfully.", updatedProvider: updatedProviderData };
    }
}


export class AdminChangeProviderStatusUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute(data: AdminChangeProviderStatusUseCaseRequestPaylod): Promise<AdminChangeProviderStatusUseCaseResponse> {
        const { providerId, isBlocked } = data;
        if (!providerId || isBlocked === null) throw new Error("Invalid request");

        Validator.validateObjectId(providerId, "providerId");
        Validator.validateBooleanValue(isBlocked, "isBlocked");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if (!provider) throw new Error("User not found.");
        provider.isBlocked = isBlocked;
        const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
        if (!updatedProvider) throw new Error("Provider not found");
        const updatedProviderData = {
            _id: updatedProvider._id,
            username: updatedProvider.username,
            email: updatedProvider.email,
            isBlocked: updatedProvider.isBlocked,
            isAdminVerified: updatedProvider.isAdminVerified,
            trustedBySlotflow: updatedProvider.trustedBySlotflow,
        };
        return { success: true, message: `Provider ${isBlocked ? "blocked" : "Unblocked"} successfully.`, updatedProvider: updatedProviderData };
    }
}


export class AdminChangeProviderTrustTagUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute(data: AdminChangeProviderTrustTagUseCaseRequestPayload): Promise<AdminChangeProviderTrustTagUseCaseResponse> {
        const { providerId, trustedBySlotflow } = data;
        if (!providerId || trustedBySlotflow === null) throw new Error("Invalid request");

        Validator.validateObjectId(providerId, "providerId");
        Validator.validateBooleanValue(trustedBySlotflow, "trustedBySlotflow");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if (!provider) throw new Error("User not found.");
        provider.trustedBySlotflow = trustedBySlotflow;
        const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
        if (!updatedProvider) throw new Error("Provider not found");
        const updatedProviderData = {
            _id: updatedProvider._id,
            username: updatedProvider.username,
            email: updatedProvider.email,
            isBlocked: updatedProvider.isBlocked,
            isAdminVerified: updatedProvider.isAdminVerified,
            trustedBySlotflow: updatedProvider.trustedBySlotflow,
        };
        return { success: true, message: `Provider trust tag ${trustedBySlotflow ? "Given" : "Removed"} successfully.`, updatedProvider: updatedProviderData };
    }
}


