import { Types } from "mongoose";
import { generateSignedUrl } from "../../../../config/aws_s3";
import { AddressRepositoryImpl } from "../../../../infrastructure/database/address/address.repository.impl";
import { PaymentRepositoryImpl } from "../../../../infrastructure/database/payment/payment.repository.impl";
import { ProviderRepositoryImpl } from "../../../../infrastructure/database/provider/provider.repository.impl";
import { SubscriptionRepositoryImpl } from "../../../../infrastructure/database/subscription/subscription.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { AdminFetchProviderAddressResProps, AdminFetchProviderDetailsResProps, AdminFetchProviderPaymentsResProps, AdminFetchProviderServiceAvailabilityResProps, AdminFetchProviderServiceResProps, AdminFetchProviderSubscriptionsResProps, FindProviderServiceResProps } from "../../../../shared/interface/adminInterface";


export class AdminFetchProviderDetailsUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(providerId: string): Promise<AdminFetchProviderDetailsResProps> {
        if (!providerId) throw new Error("Invalid request.");
        const providerData = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (providerData == null) return { success: true, message: "Provider details fetched", provider: {} };
        const { addressId, subscription, serviceId, serviceAvailabilityId, verificationToken, password, updatedAt, ...provider } = providerData;
        return { success: true, message: "Provider details fetched", provider };
    }
}

export class AdminFetchProviderAddressUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private addressRepository: AddressRepositoryImpl,) { }

    async execute(providerId: string): Promise<AdminFetchProviderAddressResProps> {
        if (!providerId) throw new Error("Invalid request.");

        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("No user found.");

        const addressData = await this.addressRepository.findAddressByUserId(new Types.ObjectId(providerId));
        if (addressData == null) return { success: true, message: "Address not yet added.", address: {} };

        const { _id, ...address } = addressData;
        return { success: true, message: "Address fetched successfully.", address };
    }
}

export class AdminFetchProviderServiceUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private providerServiceRepository: ProviderServiceRepositoryImpl,
    ) { }

    async execute(providerId: string): Promise<AdminFetchProviderServiceResProps> {
        console.log("Fetching service details");
        if (!providerId) throw new Error("Invalid request.");

        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("No user found.");

        const serviceData = await this.providerServiceRepository.findProviderServiceByProviderId(new Types.ObjectId(providerId));
        function isServiceData(obj: any): obj is FindProviderServiceResProps {
            return obj && typeof obj === 'object' && '_id' in obj;
        }
        
        if (!isServiceData(serviceData)) {
            return { success: true, message: "Service fetched successfully.", service: {} };
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
        return { success: true, message: "Service fetched successfully.", service };
    }
}

export class AdminfetchProviderServiceAvailabilityUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl,
    ) { }

    async execute(providerId: string): Promise<AdminFetchProviderServiceAvailabilityResProps> {
        if (!providerId) throw new Error("Invalid request.");

        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("No user found.");

        const availability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId));
        if (availability == null) return { success: true, message: "Service availability fetched successfully.", availability: {} };

        const { _id, providerId: spId, createdAt, updatedAt, ...rest } = availability;
        return { success: true, message: "Service availability fetched successfully.", availability: rest };
    }
}

export class AdminFetchProviderSubscriptionsUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private subscriptionRepository: SubscriptionRepositoryImpl,
    ) { }

    async execute(providerId: string): Promise<AdminFetchProviderSubscriptionsResProps> {
        if(!providerId) throw new Error("Invalid request.");

        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("No user found.");

        const subscriptions = await this.subscriptionRepository.findSubscriptionsByProviderId(new Types.ObjectId(providerId));
        if(!subscriptions) throw new Error("Subscriptions fetching error.");

        return { success: true, message: "Subscriptions fetched successfully.", subscriptions };
    }
}

export class AdminFetchProviderPaymentsUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private paymentRepository: PaymentRepositoryImpl,
    ) { }

    async execute(providerId: string): Promise<AdminFetchProviderPaymentsResProps> {
        if(!providerId) throw new Error("Invalid request.");

        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("No user found.");

        const payments = await this.paymentRepository.findAllPaymentsByProviderId(new Types.ObjectId(providerId));
        if(!payments) throw new Error("Payments fetching error.");
        
        return { success: true, message: "Payments fetched successfully.", payments };
    }

}
