import dayjs from "dayjs";
import {
    FindProviderServiceResProps,
    AdminFetchProviderServiceRequest,
    AdminFetchProviderDetailsRequest,
    AdminFetchProviderAddressRequest,
    AdminFetchProviderServiceResponse,
    AdminFetchProviderDetailsResponse,
    AdminFetchProviderPaymentsRequest,
    AdminFetchProviderAddressResponse,
    AdminFetchProviderPaymentsResponse,
    AdminFetchProviderServiceAvailabilityRequest,
    AdminFetchProviderServiceAvailabilityResponse,
} from "../../../infrastructure/dtos/admin.dto";
import { generateSignedUrl } from "../../../config/aws_s3";
import { Validator } from "../../../infrastructure/validator/validator";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";
import { PaymentRepositoryImpl } from "../../../infrastructure/database/payment/payment.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { SubscriptionRepositoryImpl } from "../../../infrastructure/database/subscription/subscription.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { ApiResponse, FetchProviderSubscriptionsRequest, FindSubscriptionsByProviderIdResponse } from "../../../infrastructure/dtos/common.dto";


export class AdminFetchProviderDetailsUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(data: AdminFetchProviderDetailsRequest): Promise<ApiResponse<AdminFetchProviderDetailsResponse>> {
        const { providerId } = data;
        if (!providerId) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");

        const providerData = await this.providerRepository.findProviderById(providerId);
        if (providerData == null) return { success: true, message: "Provider details fetched", data: {} };
        const { addressId, subscription, serviceId, serviceAvailabilityId, verificationToken, password, updatedAt, ...provider } = providerData;
        return { success: true, message: "Provider details fetched", data: provider };
    }
}


export class AdminFetchProviderAddressUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private addressRepository: AddressRepositoryImpl,) { }

    async execute(data: AdminFetchProviderAddressRequest): Promise<ApiResponse<AdminFetchProviderAddressResponse>> {
        const { providerId } = data;
        if (!providerId) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");

        const provider = await this.providerRepository.findProviderById(providerId);
        if (!provider) throw new Error("No user found.");

        const addressData = await this.addressRepository.findAddressByUserId(providerId);
        if (addressData == null) return { success: true, message: "Address not yet added.", data: {} };

        const { _id, ...address } = addressData;
        return { success: true, message: "Address fetched successfully.", data: address };
    }
}


export class AdminFetchProviderServiceUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private providerServiceRepository: ProviderServiceRepositoryImpl,
    ) { }

    async execute(data: AdminFetchProviderServiceRequest): Promise<ApiResponse<AdminFetchProviderServiceResponse>> {
        const { providerId } = data;
        if (!providerId) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");

        const provider = await this.providerRepository.findProviderById(providerId);
        if (!provider) throw new Error("No user found.");

        const serviceData = await this.providerServiceRepository.findProviderServiceByProviderId(providerId);
        function isServiceData(obj: any): obj is FindProviderServiceResProps {
            return obj && typeof obj === 'object' && '_id' in obj;
        }

        if (!isServiceData(serviceData)) {
            return { success: true, message: "Service fetched successfully.", data: {} };
        }

        const { _id, createdAt, updatedAt, ...service } = serviceData;

        const providerCertifiacteUrl = service.providerCertificateUrl;
        if (!providerCertifiacteUrl) throw new Error("Service details fetching error.");

        const urlParts = providerCertifiacteUrl?.split('/');
        if (!urlParts) throw new Error("UrlParts error.");

        const s3Key = urlParts.slice(3).join('/');
        if (!s3Key) throw new Error("Image retrieving.");

        const signedUrl = await generateSignedUrl(s3Key);
        if (!signedUrl) throw new Error("Image fetching error.");

        service.providerCertificateUrl = signedUrl;
        return { success: true, message: "Service fetched successfully.", data: service };
    }
}


export class AdminfetchProviderServiceAvailabilityUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private serviceAvailabilityRepositoryImpl: ServiceAvailabilityRepositoryImpl,
    ) { }

    async execute(data: AdminFetchProviderServiceAvailabilityRequest): Promise<ApiResponse<AdminFetchProviderServiceAvailabilityResponse>> {
        const { providerId, date } = data;
        if (!providerId || !date) throw new Error("Invalid request.");
        const currentDateTime = dayjs();
        const selectedDate = dayjs(date).format('YYYY-MM-DD');

        Validator.validateObjectId(providerId, "providerId");
        Validator.validateDate(date);

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if (!provider) throw new Error("No user found.");

        const availability = await this.serviceAvailabilityRepositoryImpl.findServiceAvailabilityByProviderId(providerId, date);
        if (availability == null) return { success: true, message: "Service availability fetched successfully.", data: {} };
        const updatedSlots = availability.slots.map((slot) => {
            const slotDateTime = dayjs(`${selectedDate} ${slot.time}`, 'YYYY-MM-DD hh:mm A');
            const isWithin2Hours = slotDateTime.diff(currentDateTime, 'minute') < 120;
            return {
                ...slot,
                available: !isWithin2Hours
            }
        });

        return { success: true, message: "Service availability fetched successfully.", data: { ...availability, slots: updatedSlots } };
    }
}


export class AdminFetchProviderSubscriptionsUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private subscriptionRepositoryImpl: SubscriptionRepositoryImpl,
    ) { }

    async execute(data: FetchProviderSubscriptionsRequest): Promise<ApiResponse<FindSubscriptionsByProviderIdResponse>> {
        const { providerId, page, limit } = data;
        if (!providerId) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if (!provider) throw new Error("No user found.");

        const result = await this.subscriptionRepositoryImpl.findSubscriptionsByProviderId({providerId, page, limit});
        if (!result) throw new Error("Subscriptions fetching error.");

        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };

    }
}


export class AdminFetchProviderPaymentsUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl,
        private paymentRepositoryImpl: PaymentRepositoryImpl,
    ) { }

    async execute(data: AdminFetchProviderPaymentsRequest): Promise<ApiResponse<AdminFetchProviderPaymentsResponse>> {
        const { providerId, page, limit } = data;
        if (!providerId) throw new Error("Invalid request.");

        Validator.validateObjectId(providerId, "providerId");

        const provider = await this.providerRepositoryImpl.findProviderById(providerId);
        if (!provider) throw new Error("No user found.");

        const result = await this.paymentRepositoryImpl.findAllPaymentsByProviderId({providerId, page, limit });
        if (!result) throw new Error("Payments fetching error.");

        return { data: result.data, totalPages: result.totalPages, currentPage: result.currentPage, totalCount: result.totalCount };
    }

}
