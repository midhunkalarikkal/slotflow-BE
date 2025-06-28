import { ApiPaginationRequest, CommonResponse } from "./common.dto";
import { User } from "../../domain/entities/user.entity";
import { Plan } from "../../domain/entities/plan.entity";
import { Service } from "../../domain/entities/service.entity";
import { Payment } from "../../domain/entities/payment.entity";
import { Address } from "../../domain/entities/address.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { Subscription } from "../../domain/entities/subscription.entity";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { FontendAvailabilityForResponse } from "../../domain/entities/serviceAvailability.entity";
import { FindAllSubscriptionsResProps, findSubscriptionFullDetailsResProps } from "../../domain/repositories/ISubscription.repository";

// **************** used in adminProvider.use-case **************** \\

type AdminProviderBaseType = Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified" | "trustedBySlotflow">;

// **** adminFetchAllProviders
// Used as the return type of fetch all providers
// Used in AdminProviderListUseCase, the findAllProviders method in ProviderRepositoryImpl, 
// and the findAllProviders method in IProviderRepository as the response type with ApiResponse
export type AdiminFetchAllProviders = Array<AdminProviderBaseType>;



// **** adminApproveProvider
// Used as the request interface of admin approve provider
export interface AdminApproveProviderRequest  {
    providerId: Provider["_id"];
}
// Used as the response type of admin approve provider
export type AdminApproveProviderResponse = AdminProviderBaseType;



// **** adminChangeProvierBlockStatus
// Used as the request interface of admin change provider block status
export interface AdminChangeProviderStatusRequest {
    providerId: Provider["_id"];
    isBlocked: Provider["isBlocked"];
}
// Used as the request interface of admin change provider block status
export type AdminChangeProviderStatusResponse = AdminProviderBaseType;



// **** adminChangeProviderTrustTag
// Used as the request interface of admin change provider trust tag 
export interface AdminChangeProviderTrustTagRequest  {
    providerId: Provider["_id"];
    trustedBySlotflow: Provider["trustedBySlotflow"];
};
// Used as the request type of admin change provider trust tag 
export type AdminChangeProviderTrustTagResponse = AdminProviderBaseType;



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
export interface FindProviderServiceResProps extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">
}
export type AdminFetchProviderServiceResponse = FindProviderServiceResProps | {};



// **** adminFetchProviderServiceAvailability
// Used as the request interface of admin fetch provider service availability
export interface AdminFetchProviderServiceAvailabilityRequest {
    providerId: Provider["_id"];
    date: Date
}
// Used as the return interface of admin fetch provider service availability
export type AdminFetchProviderServiceAvailabilityResponse = FontendAvailabilityForResponse | {};





// admin fetch provider payments use case request payload interface
export interface AdminFetchProviderPaymentsRequest extends ApiPaginationRequest{
    providerId: Provider["_id"];
}
// admin fetch provider payments use case response interface
export type AdminFetchProviderPaymentsResponse = Array<Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">>;


// **** used in adminUser.use-case **** \\

// Data type returned for the Admin Users table
// Used in AdminUserListUseCase, the findAllUsers method in UserRepositoryImpl, 
// and the findAllUsers method in IUserRepository as the response type with the ApiResponse interface
export type AdminFetchAllUsers = Array<Pick<User, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified">>;


// admin chage user isBlocked status use case request payload interface  
export interface AdminChangeUserIsBlockedStatusUseCaseRequestPayload {
    userId: User["_id"];
    isBlocked: User["isBlocked"];
}
// admin change user block status use case response interface
export interface AdminChangeUserStatusUseCaseResponse extends CommonResponse {
    updatedUser: Pick<User, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified">;
}





// **** used in adminSubscription.use-case **** \\

// Admin fetch all subscriptions use case response interface 
export type AdminFetchAllSubscriptionsResponse = Array<Pick<Subscription, "_id" | "createdAt" | "providerId" | "startDate" | "endDate" | "subscriptionStatus">>;

// admin fetch subscription details use case request payload interface 
export interface AdminFetchSubscriptionDetailsUseCaseRequestPayload {
    subscriptionId: Subscription["_id"];
}
// admin fetch subscription details use case response interface 
export interface AdminFetchSubscriptionDetailsUseCaseResponse extends CommonResponse {
    subscriptionDetails: findSubscriptionFullDetailsResProps | {};
}





// **** used in adminService.use-case **** \\

// admin fetch all services use case response interface 
export type AdminServiceListResponse = Array<Pick<Service, "_id" | "serviceName" | "isBlocked">>;

// admin add new service use case request payload interface
export interface AdminAddServiceUseCaseRequestPayload {
    serviceName: Service["serviceName"];
} 
// admin add new service use case response interface
export interface AdminAddServiceUseCaseResponse extends CommonResponse {
    service: Pick<Service, "_id" | "serviceName" | "isBlocked">;
}


// admin change service isBlocked status use case request payload interface
export interface AdminChnageServiceIsBlockedStatusUseCaseRequestPayload {
    serviceId: Service["_id"];
    isBlocked: Service["isBlocked"];
}
// admin change service block status use case response interface
export interface AdminChangeServiceStatusUseCaseResponse extends CommonResponse {
    updatedService: Pick<Service, "_id" | "serviceName" | "isBlocked">;
}





// **** used in adminPlan.use-case **** \\

// Data type returned for the Admin Plans table
// Used in AdminPlanListUseCase, the findAllPlans method in PlanRepositoryImpl, 
// and the findAllPlans method in IPlanRepository as the response type with the ApiResponse interface
export type AdminPlanListResponse = Array<Pick<Plan, "_id" | "planName" | "isBlocked" | "price" | "maxBookingPerMonth" | "adVisibility">>;


// admin create new plan request payload type 
export type AdminAddNewPlanUseCaseRequestPayload = Pick<Plan, "planName" | "description" | "price" | "features" | "maxBookingPerMonth" | "adVisibility">;
// admin create new plan use case response interface 
export interface AdminCreatePlanUseCaseResponse extends CommonResponse {
    plan: Pick<Plan, "_id" | "planName" | "isBlocked">;
}


// admin change plan block status request payload type
export type AdminChangePlanIsBlockedStatusUseCaseRequestPayload = {
    planId: Plan["_id"];
    isBlocked: Plan["isBlocked"]
}
// admin change plan block status use case response interface
export interface AdminChangePlanStatusUseCaseResponse extends CommonResponse {
    updatedPlan: Pick<Plan, "_id" | "planName" | "isBlocked">;
}





// **** used in adminPayment.use-case **** \\

// admin fetch all payments use case response interface 
export type AdminFetchAllPayments = Array<Pick<Payment, "createdAt" | "totalAmount" | "paymentFor" | "paymentGateway" | "paymentStatus" | "paymentMethod">>;
export interface AdminFetchAllPaymentsUseCaseResponse extends CommonResponse {
    payments: Array<AdminFetchAllPayments>
}





