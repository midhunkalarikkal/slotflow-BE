import { Types } from "mongoose";
import { OTPService } from "../../../../infrastructure/services/otp.service";
import { ProviderRepositoryImpl } from "../../../../infrastructure/database/provider/provider.repository.impl";
import { AdminApproveProviderRespRops, AdminChangeProviderStatusResProps, AdminChangeProviderTrustTagResProps, AdminProviderListResProps } from "../../../../shared/interface/adminInterface";


export class AdminProviderListUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(): Promise<AdminProviderListResProps> {
        const providers = await this.providerRepository.findAllProviders();
        if (!providers) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched providers.", providers };
    }

}

export class AdminApproveProviderUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(providerId: string): Promise<AdminApproveProviderRespRops> {
        if (!providerId) throw new Error("Invalid request");
        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (!provider) throw new Error("User not found.");
        provider.isAdminVerified = true;
        const updatedProvider = await this.providerRepository.updateProvider(provider);
        if (!updatedProvider) throw new Error("Provider not found");
        await OTPService.sendApprovalEmail(updatedProvider.email);
        const data = {
            _id: updatedProvider._id,
            username: updatedProvider.username,
            email: updatedProvider.email,
            isBlocked: updatedProvider.isBlocked,
            isAdminVerified: updatedProvider.isAdminVerified,
            trustedBySlotflow: updatedProvider.trustedBySlotflow,
        };
        return { success: true, message: "Provider approved successfully.", updatedProvider: data };
    }
}

export class AdminChangeProviderStatusUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(providerId: string, status: boolean): Promise<AdminChangeProviderStatusResProps> {
        if (!providerId || status === null) throw new Error("Invalid request");
        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (!provider) throw new Error("User not found.");
        provider.isBlocked = status;
        const updatedProvider = await this.providerRepository.updateProvider(provider);
        if (!updatedProvider) throw new Error("Provider not found");
        const data = {
            _id: updatedProvider._id,
            username: updatedProvider.username,
            email: updatedProvider.email,
            isBlocked: updatedProvider.isBlocked,
            isAdminVerified: updatedProvider.isAdminVerified,
            trustedBySlotflow: updatedProvider.trustedBySlotflow,
        };
        return { success: true, message: `Provider ${status ? "blocked" : "Unblocked"} successfully.`, updatedProvider: data };
    }
}

export class AdminChangeProviderTrustTagUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(providerId: string, trustedBySlotflow: boolean): Promise<AdminChangeProviderTrustTagResProps> {
        if (!providerId || trustedBySlotflow === null) throw new Error("Invalid request");
        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (!provider) throw new Error("User not found.");
        provider.trustedBySlotflow = trustedBySlotflow;
        const updatedProvider = await this.providerRepository.updateProvider(provider);
        if (!updatedProvider) throw new Error("Provider not found");
        const data = {
            _id: updatedProvider._id,
            username: updatedProvider.username,
            email: updatedProvider.email,
            isBlocked: updatedProvider.isBlocked,
            isAdminVerified: updatedProvider.isAdminVerified,
            trustedBySlotflow: updatedProvider.trustedBySlotflow,
        };
        return { success: true, message: `Provider trust tag ${trustedBySlotflow ? "Given" : "Removed"} successfully.`, updatedProvider: data };
    }
}


