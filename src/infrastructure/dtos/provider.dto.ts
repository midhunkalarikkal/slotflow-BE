import { Plan } from "../../domain/entities/plan.entity";
import { Address } from "../../domain/entities/address.entity";
import { Service } from "../../domain/entities/service.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { FontendAvailabilityForResponse, FrontendAvailabilityForRequest } from "../../domain/entities/serviceAvailability.entity";


// **** Used as the request type for creating a provider
export type CreateProviderRequest = Pick<Provider, "username" | "email" | "password" | "verificationToken">;


// ************ used in providerAddress.use-case ************ \\
// provider fetch address use case request payload interface
export interface ProviderFetchAddressRequest {
    providerId: Provider["_id"];
}
// provider fetch address use case response interface
export type ProviderFetchAddressResponse = Pick<Address, "_id" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink"> | {};





// ************ used in providerService.use-case ************ \\
// provider add service details use case request payload interface
type AddServiceDetailsRequest = Pick<ProviderService, "providerId" | "serviceCategory" | "serviceName" | "serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience">;
export interface ProviderAddServiceDetailsRequest extends AddServiceDetailsRequest {
        file: Express.Multer.File
}


// provider fetch service details use case request payload
export interface ProviderFetchProviderServiceRequest {
    providerId: Provider["_id"];
}
// provider fetch service details use case respomse interface
type FindProviderServiceProps = Pick<ProviderService, "_id" | "serviceName" | "serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience" | "providerCertificateUrl" | "updatedAt" | "createdAt">;
export interface ProviderFindProviderServiceResProps extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">;
}
export type ProviderFetchProviderServiceResponse = ProviderFindProviderServiceResProps | {};





// ************ used in providerPlan.use-case ************ \\
// provider fetch all plans use case response interface 
export type ProviderFetchAllPlansResponse = Array<Pick<Plan, "_id" | "planName" | "price" | "features" | "description">> | [];





// ************ used in providerProfile.use-case ************ \\
// provider fetch profile detals use case request payload interface
export interface ProviderFetchProfileDetailsRequest {
    providerId: Provider["_id"];
}
// provider fetch profile detals use case response interface
export type ProviderFetchProfileDetailsResponse = Pick<Provider, "username" | "email" | "isAdminVerified" | "isBlocked" | "isEmailVerified" | "phone" | "createdAt"> | {};


// provider update profile image use case request payload interface
export interface ProviderUpdateprofileImageRequestPayload {
    providerId: Provider["_id"];
    file: Express.Multer.File;
}
// provider update profile image use case response interface 
export type ProviderUpdateprofileImageResponse = Provider["profileImage"];


// provider update providerInfo request payload interface
export interface ProviderUpdateProviderInfoRequest {
    providerId: Provider["_id"];
    username: Provider["username"];
    phone: Provider["phone"];
}
// provider update provider info use case response interface
export type ProviderUpdateProviderInfoResponse = Pick<Provider, "username" | "phone">





// ************ used in providerServiceAvailability ************ \\
// provider add service availability use case reques tpayload
export interface ProviderAddServiceAvailabilityRewuest {
    providerId: Provider["_id"];
    availabilities: FrontendAvailabilityForRequest[]
}


//  provider fetch service availability use case response interface 
export interface ProviderFetchServiceAvailabilityRequest {
    providerId: Provider["_id"];
    date: Date
}
//  provider fetch service availability use case response interface 
export type ProviderFetchServiceAvailabilityResponse = FontendAvailabilityForResponse | {};





// ************ used in providerStripeSubscription.use-case ************ \\
// provider stripe subscription create sessionId use case  request payload interface
export interface ProviderStripeSubscriptionCreateSessionIdRequest {
    providerId: Provider["_id"];
    planId: Plan["_id"];
    duration: string;
}
// provider stripe subscription create sessionId use case response interface
export type ProviderStripeSubscriptionCreateSessionIdResponse = string;


// provider save subscription after stripe payment use case request payload interface
export interface ProviderSaveSubscriptionRequest {
    providerId: Provider["_id"];
    sessionId: string
}





// ************ used in providerSubscription.use-case  ************ \\
// provider trial subscription use case reuest payload
export interface ProviderTrialSubscriptionRequest {
    providerId: Provider["_id"];
}





