import { 
    AdiminFetchAllProviders, 
    AdminApproveProviderRequest, 
    AdminApproveProviderResponse, 
    AdminChangeProviderStatusRequest, 
    AdminChangeProviderStatusResponse, 
    AdminChangeProviderTrustTagRequest,
    AdminChangeProviderTrustTagResponse, 
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

    async execute(data: AdminApproveProviderRequest): Promise<ApiResponse<AdminApproveProviderResponse>> {
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
        return { success: true, message: "Provider approved successfully.", data: updatedProviderData };
    }
}


export class AdminChangeProviderBlockStatusUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute(data: AdminChangeProviderStatusRequest): Promise<ApiResponse<AdminChangeProviderStatusResponse>> {
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
        return { success: true, message: `Provider ${isBlocked ? "blocked" : "Unblocked"} successfully.`, data: updatedProviderData };
    }
}


export class AdminChangeProviderTrustTagUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl) { }

    async execute(data: AdminChangeProviderTrustTagRequest): Promise<ApiResponse<AdminChangeProviderTrustTagResponse>> {
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
        return { success: true, message: `Provider trust tag ${trustedBySlotflow ? "Given" : "Removed"} successfully.`, data: updatedProviderData };
    }
}


