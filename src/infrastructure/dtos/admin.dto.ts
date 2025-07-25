import { CommonResponse } from "./common.dto";
import { User } from "../../domain/entities/user.entity";
import { Plan } from "../../domain/entities/plan.entity";
import { Service } from "../../domain/entities/service.entity";
import { Address } from "../../domain/entities/address.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { Subscription } from "../../domain/entities/subscription.entity";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { FontendAvailabilityForResponse } from "../../domain/entities/serviceAvailability.entity";
import { findSubscriptionFullDetailsResProps } from "../../domain/repositories/ISubscription.repository";

// **************** used in adminProvider.use-case **************** \\

// **** adminFetchAllProviders
// Used as the return type of fetch all providers
// Used in AdminProviderListUseCase, the findAllProviders method in ProviderRepositoryImpl, 
// and the findAllProviders method in IProviderRepository as the response type with ApiResponse
export type AdiminFetchAllProviders = Array<Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified" | "isEmailVerified" | "trustedBySlotflow">>;



// **** adminApproveProvider
// Used as the request interface of admin approve provider
export interface AdminApproveProviderRequest  {
    providerId: Provider["_id"];
}


// **** adminChangeProvierBlockStatus
// Used as the request interface of admin change provider block status
export interface AdminChangeProviderStatusRequest {
    providerId: Provider["_id"];
    isBlocked: Provider["isBlocked"];
}


// **** adminChangeProviderTrustTag
// Used as the request interface of admin change provider trust tag 
export interface AdminChangeProviderTrustTagRequest  {
    providerId: Provider["_id"];
    trustedBySlotflow: Provider["trustedBySlotflow"];
};


// **** adminFetchProviderProfileDetails
// Used as the request interface of admin fetch provider profile details
export interface AdminFetchProviderDetailsRequest {
    providerId: Provider["_id"];
}
// Used as the return type of admin fetch provider profile details
export type AdminFetchProviderDetailsResponse = Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified" | "isAdminVerified" | "phone" | "profileImage" | "trustedBySlotflow" | "createdAt"> | {};



// **** adminFetchProviderAddress
// Used as the request interface of admin fetch provider address
export interface AdminFetchProviderAddressRequest {
    providerId: Provider["_id"];
}
// Used as the request type of admin fetch provider address
export type AdminFetchProviderAddressResponse = Pick<Address, "userId" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink"> | {};



// **** adminFetchProviderAddress
// Used as the request interface of admin fetch provider service
export type AdminFetchProviderServiceRequest = {
    providerId: Provider["_id"];
}
// Used as the request interface of admin fetch provider service
type FindProviderServiceProps = Omit<ProviderService, "serviceCategory">;
export interface FindProviderServiceResponse extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">
}
export type AdminFetchProviderServiceResponse = FindProviderServiceResponse | {};



// **** adminFetchProviderServiceAvailability
// Used as the request interface of admin fetch provider service availability
export interface AdminFetchProviderServiceAvailabilityRequest {
    providerId: Provider["_id"];
    date: Date
}
// Used as the return interface of admin fetch provider service availability
export type AdminFetchProviderServiceAvailabilityResponse = FontendAvailabilityForResponse | {};





// **************** used in adminUser.use-case **************** \\

type AdminUserBaseInfo = Pick<User, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified">;

// **** adminFetchAllUsers
// Used as the return type of fetch all users
// Used in AdminUserListUseCase, the findAllUsers method in UserRepositoryImpl, 
// and the findAllUsers method in IUserRepository as the response type with the ApiResponse interface
export type AdminFetchAllUsers = Array<AdminUserBaseInfo>;



// **** adminChangeUserBlockStatus
// Used as the request interface of admin change block status of user  
export interface AdminChangeUserIsBlockedStatusRequest {
    userId: User["_id"];
    isBlocked: User["isBlocked"];
}





// **************** used in adminService.use-case **************** \\

// **** adminFetchAllServices
// Used as the request interface of admin fetch all app services
export type AdminServiceListResponse = Array<Pick<Service, "_id" | "serviceName" | "isBlocked">>;

// admin add new service use case request payload interface
export interface AdminAddServiceRequest {
    serviceName: Service["serviceName"];
} 


// admin change service isBlocked status use case request payload interface
export interface AdminChnageServiceIsBlockedStatusRequest {
    serviceId: Service["_id"];
    isBlocked: Service["isBlocked"];
}










// **** used in adminSubscription.use-case **** \\

// Admin fetch all subscriptions use case response interface 
export type AdminFetchAllSubscriptionsResponse = Array<Pick<Subscription, "_id" | "createdAt" | "providerId" | "startDate" | "endDate" | "subscriptionStatus">>;

// admin fetch subscription details use case request payload interface 
export interface AdminFetchSubscriptionDetailsRequest {
    subscriptionId: Subscription["_id"];
}
// admin fetch subscription details use case response interface 
export interface AdminFetchSubscriptionDetailsResponse extends CommonResponse {
    subscriptionDetails: findSubscriptionFullDetailsResProps | {};
}










// **** used in adminPlan.use-case **** \\

// Data type returned for the Admin Plans table
// Used in AdminPlanListUseCase, the findAllPlans method in PlanRepositoryImpl, 
// and the findAllPlans method in IPlanRepository as the response type with the ApiResponse interface
export type AdminPlanListResponse = Array<Pick<Plan, "_id" | "planName" | "isBlocked" | "price" | "maxBookingPerMonth" | "adVisibility">>;


// admin create new plan request payload type 
export type AdminAddNewPlanRequest = Pick<Plan, "planName" | "description" | "price" | "features" | "maxBookingPerMonth" | "adVisibility">;


// admin change plan block status request payload type
export type AdminChangePlanIsBlockedStatusRequest = {
    planId: Plan["_id"];
    isBlocked: Plan["isBlocked"]
}










