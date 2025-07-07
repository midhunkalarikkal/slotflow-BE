import { 
    AdiminFetchAllProviders, 
    AdminApproveProviderRequest, 
    AdminChangeProviderStatusRequest, 
    AdminChangeProviderTrustTagRequest,
} from "../../../infrastructure/dtos/admin.dto";
import { Validator } from "../../../infrastructure/validator/validator";
import { OTPService } from "../../../infrastructure/services/otp.service";
import { ApiPaginationRequest, ApiResponse } from "../../../infrastructure/dtos/common.dto";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";


export class AdminProviderListUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute({page, limit}: ApiPaginationRequest): Promise<ApiResponse<AdiminFetchAllProviders>> {

        const result = await this.providerRepositoryImpl.findAllProviders({page, limit});
        if (!result) throw new Error("Providers fetching failed");
        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }
}


export class AdminApproveProviderUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute({ providerId }: AdminApproveProviderRequest): Promise<ApiResponse> {

        if (!providerId) throw new Error("Invalid request");

        Validator.validateObjectId(providerId, "providerId");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if (!provider) throw new Error("User not found.");
        if (provider.isAdminVerified) throw new Error("Provider is already verified.");
        provider.isAdminVerified = true;
        const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
        if (!updatedProvider) throw new Error("Provider not found");
        await OTPService.sendApprovalEmail(updatedProvider.email);
        return { success: true, message: "Provider approved successfully." };
    }
}


export class AdminChangeProviderBlockStatusUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute({ providerId, isBlocked }: AdminChangeProviderStatusRequest): Promise<ApiResponse> {

        if (!providerId || isBlocked === null) throw new Error("Invalid request");

        Validator.validateObjectId(providerId, "providerId");
        Validator.validateBooleanValue(isBlocked, "isBlocked");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if (!provider) throw new Error("User not found.");
        provider.isBlocked = isBlocked;
        const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
        if (!updatedProvider) throw new Error("Provider not found");
        return { success: true, message: `Provider ${isBlocked ? "blocked" : "Unblocked"} successfully.` };
    }
}


export class AdminChangeProviderTrustTagUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute({ providerId, trustedBySlotflow }: AdminChangeProviderTrustTagRequest): Promise<ApiResponse> {

        if (!providerId || trustedBySlotflow === null) throw new Error("Invalid request");

        Validator.validateObjectId(providerId, "providerId");
        Validator.validateBooleanValue(trustedBySlotflow, "trustedBySlotflow");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if (!provider) throw new Error("User not found.");
        provider.trustedBySlotflow = trustedBySlotflow;
        const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
        if (!updatedProvider) throw new Error("Provider not found");
        return { success: true, message: `Provider trust tag ${trustedBySlotflow ? "Given" : "Removed"} successfully.` };
    }
}


