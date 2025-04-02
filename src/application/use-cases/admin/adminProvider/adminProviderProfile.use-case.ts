import { Types } from "mongoose";
import { generateSignedUrl } from "../../../../config/aws_s3";
import { Plan } from "../../../../domain/entities/plan.entity";
import { Address } from "../../../../domain/entities/address.entity";
import { Payment } from "../../../../domain/entities/payment.entity";
import { Provider } from "../../../../domain/entities/provider.entity";
import { CommonResponse } from "../../../../shared/interface/commonInterface";
import { Subscription } from "../../../../domain/entities/subscription.entity";
import { ProviderService } from "../../../../domain/entities/providerService.entity";
import { ServiceAvailability } from "../../../../domain/entities/serviceAvailability.entity";
import { AddressRepositoryImpl } from "../../../../infrastructure/database/address/address.repository.impl";
import { PaymentRepositoryImpl } from "../../../../infrastructure/database/payment/payment.repository.impl";
import { ProviderRepositoryImpl } from "../../../../infrastructure/database/provider/provider.repository.impl";
import { SubscriptionRepositoryImpl } from "../../../../infrastructure/database/subscription/subscription.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";


interface AdminFetchProviderDetailsResProps extends CommonResponse {
    provider: Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified" | "isAdminVerified" | "phone" | "profileImage" | "trustedBySlotflow" | "createdAt"> | null;
}

interface AdminFetchProviderAddressResProps extends CommonResponse {
    address: Pick<Address, "userId" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink"> | null;
}

interface AdminFetchProviderServiceResProps extends CommonResponse {
    service: Pick<ProviderService, "providerId" | "serviceCategory" | "serviceName" |"serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience" | "providerCertificateUrl"> | null;
}

interface AdminFetchProviderServiceAvailabilityResProps extends CommonResponse {
    availability: Pick<ServiceAvailability, "availability"> | null;
}

type SubscripionsResProps = Pick<Subscription, "startDate" | "endDate" | "subscriptionStatus">;
interface AdminFetchProviderSubscriptions extends SubscripionsResProps {
    subscriptionPlanId?: {
        _id: string;
        planName: string;
    };
}
interface AdminFetchProviderSubscriptionsResProps extends CommonResponse {
    subscriptions: AdminFetchProviderSubscriptions[];
}

interface AdminFetchProviderPaymentsResProps extends CommonResponse {
    payments: Array<Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">>;
}


export class AdminFetchProviderDetailsUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl) { }

    async execute(providerId: string): Promise<AdminFetchProviderDetailsResProps> {
        if (!providerId) throw new Error("Invalid request.");
        const providerData = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (providerData == null) return { success: true, message: "Provider details fetched", provider: null };
        const { addressId, subscription, serviceId, serviceAvailabilityId, verificationToken, password, updatedAt, ...provider } = providerData;
        return { success: true, message: "Provider details fetched", provider };
    }
}

export class AdminFetchProviderAddressUseCase {
    constructor(private addressRepository: AddressRepositoryImpl) { }

    async execute(providerId: string): Promise<AdminFetchProviderAddressResProps> {
        if (!providerId) throw new Error("Invalid request.");
        const addressData = await this.addressRepository.findAddressByUserId(new Types.ObjectId(providerId));
        if (addressData == null) return { success: true, message: "Address not yet added.", address: null }
        const { _id, ...address } = addressData;
        return { success: true, message: "Address fetched successfully.", address }
    }
}

export class AdminFetchProviderServiceUseCase {
    constructor(private providerServiceRepository: ProviderServiceRepositoryImpl) { }

    async execute(providerId: string): Promise<AdminFetchProviderServiceResProps> {
        if (!providerId) throw new Error("Invalid request.");
        const serviceData = await this.providerServiceRepository.findProviderServiceByProviderId(new Types.ObjectId(providerId));
        if (serviceData == null) return { success: true, message: "Service fetched successfully.", service: null };
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
    constructor(private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl) { }

    async execute(providerId: string): Promise<AdminFetchProviderServiceAvailabilityResProps> {
        if (!providerId) throw new Error("Invalid request.");
        const availability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId));
        if (availability == null) return { success: true, message: "Service availability fetched successfully.", availability: null }
        const { _id, providerId: spId, createdAt, updatedAt, ...rest } = availability;
        return { success: true, message: "Service availability fetched successfully.", availability: rest }
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
