import { CommonResponse } from "./commonInterface";
import { Plan } from "../../domain/entities/plan.entity";
import { Address } from "../../domain/entities/address.entity";
import { Payment } from "../../domain/entities/payment.entity";
import { Service } from "../../domain/entities/service.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { Subscription } from "../../domain/entities/subscription.entity";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { ServiceAvailability } from "../../domain/entities/serviceAvailability.entity";

// **** used in providerAddress.use-case **** \\

// provider fetch address response props
export interface ProviderFetchAddressResProps extends CommonResponse {
    address: Pick<Address, "_id" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink"> | {};
}





// **** used in providerAppService.use-case **** \\

// provder fetch all app services response props
export interface ProviderFetchAllAppServicesResProps extends CommonResponse {
    services: Array<Pick<Service, "_id" | "serviceName">> | [];
}





// **** used in providerPayment.use-case **** \\

// provider fetch all payments response props 
export interface ProviderFetchAllPaymentsResProps extends CommonResponse {
    payments: Array<Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">> | [];
}





// **** used in providerPlan.use-case **** \\

// provider fetch all plans response props
export interface ProviderFetchAllPlansResProps extends CommonResponse {
    plans: Array<Pick<Plan, "_id" | "planName" | "price" | "features" | "description">> | [];
}





// **** used in providerProfile.use-case **** \\

// provider fetch profile detals response props
export interface ProviderFetchProfileDetailsResProps extends CommonResponse {
    profileDetails: Pick<Provider, "username" | "email" | "isAdminVerified" | "isBlocked" | "isEmailVerified" | "phone" | "createdAt"> | {};
}

// provider update profile image response props
export interface ProviderUpdateprofileImageResProps extends CommonResponse, Pick<Provider, "profileImage"> { }





// **** used in providerService.use-case **** \\

// provider
type FindProviderServiceProps = Pick<ProviderService, "_id" | "serviceName" | "serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience" | "providerCertificateUrl" | "updatedAt" | "createdAt">;
export interface ProviderFindProviderServiceResProps extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">;
}
export interface ProviderFetchProviderServiceResProps extends CommonResponse {
    service: ProviderFindProviderServiceResProps | {};
}





// **** used in providerServiceAvailability **** \\

//  provider fetch service availability response props
type ServiceAvailabilityProps = Pick<ServiceAvailability, "_id" | "availability">;
export interface ProviderFetchServiceAvailabilityResProps extends CommonResponse {
    availability : ServiceAvailabilityProps | {};
}





// **** used in providerStripeSubscription.use-case **** \\

// provider stripe subscription create sessionId
export interface ProviderStripeSubscriptionCreateSessionIdResProps extends CommonResponse {
    sessionId : string
}





// **** used in providerSubscription.use-case **** \\

// provider fetch subscriptions response props
type SubscripionsResProps = Pick<Subscription, "startDate" | "endDate" | "subscriptionStatus">;
interface AdminFetchProviderSubscriptions extends SubscripionsResProps {
    subscriptionPlanId?: {
        _id: string;
        planName: string;
    };
}
export interface ProviderFetchProviderSubscriptionsResProps extends CommonResponse {
    subscriptions: AdminFetchProviderSubscriptions[] | [];
}


