import { CommonResponse } from "./common.dto";
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


// **** used in adminUser.use-case **** \\

// admin fetch all users for listing use case response interface 
export interface AdminUsersListUseCaseResponse extends CommonResponse {
    users: Array<Pick<User, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified">>
}


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
export interface AdminFetchAllSubscriptionsUseCaseResponse extends CommonResponse {
    subscriptions: Array<FindAllSubscriptionsResProps>
}

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
export interface AdminServiceListUseCaseResponse extends CommonResponse {
    services: Array<Pick<Service, "_id" | "serviceName" | "isBlocked">>;
}


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

// admin list all plans use case response interface 
export interface AdminPlanListUseCaseResponse extends CommonResponse {
    plans: Array<Pick<Plan, "_id" | "planName" | "isBlocked">>;
}


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
type FetchAllPayments = Pick<Payment, "createdAt" | "totalAmount" | "paymentFor" | "paymentGateway" | "paymentStatus" | "paymentMethod">;
export interface AdminFetchAllPaymentsUseCaseResponse extends CommonResponse {
    payments: Array<FetchAllPayments>
}





// **** used in adminProvider.use-case **** \\

// admin list all providers use case response interface 
export interface AdminProviderListUseCaseResponse extends CommonResponse {
    providers: Array<Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified" | "trustedBySlotflow">>;
}


// admin approve provider isAdminVerified use case request payload interface
export interface AdminApproveProviderUseCaseRequestPayload  {
    providerId: Provider["_id"];
}
// admin approve provider isAdminVerified use case response interface 
export interface AdminApproveProviderUseCaseResponse extends CommonResponse {
    updatedProvider: Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified" | "trustedBySlotflow">;
}


// admin change provider block status use case request payload interface
export interface AdminChangeProviderStatusUseCaseRequestPaylod {
    providerId: Provider["_id"];
    isBlocked: Provider["isBlocked"];
}
// admin change provider block status use case response interface 
export interface AdminChangeProviderStatusUseCaseResponse extends CommonResponse {
    updatedProvider: Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified" | "trustedBySlotflow">;
}


// admin change provider trustedBySlotflow status use case request payload interface
export interface AdminChangeProviderTrustTagUseCaseRequestPayload  {
    providerId: Provider["_id"];
    trustedBySlotflow: Provider["trustedBySlotflow"];
};
// admin change provider trustedBySlotflow status use case response interface 
export interface AdminChangeProviderTrustTagUseCaseResponse extends CommonResponse {
    updatedProvider: Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified" | "trustedBySlotflow">;
}


// admin fetch a specific provider details request payload type
export type AdminFetchProviderDetailsRequestPayload = {
    providerId: Provider["_id"];
}
// admin fetch a specific provider details response interface
export interface AdminFetchProviderDetailsResProps extends CommonResponse {
    provider: Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified" | "isAdminVerified" | "phone" | "profileImage" | "trustedBySlotflow" | "createdAt"> | {};
}


// admin fetch a specific provider address details request payload type
export type AdminFetchProviderAddressRequestPayload = {
    providerId: Provider["_id"];
}
// admin fetch a specific provider address details response interface
export interface AdminFetchProviderAddressResProps extends CommonResponse {
    address: Pick<Address, "userId" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink"> | {};
}


// admin fetch provider service details request payload type
export type AdminFetchProviderServiceResRequestPayload = {
    providerId: Provider["_id"];
}
// admin fetch provider service details response props
type FindProviderServiceProps = Omit<ProviderService, "serviceCategory">;
export interface FindProviderServiceResProps extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">
}
export interface AdminFetchProviderServiceResProps extends CommonResponse {
    service: FindProviderServiceResProps | {};
}


// admin fetch provider service availability details request payload type
export type AdminFetchProviderServiceAvailabilityRequestPayload = {
    providerId: Provider["_id"];
    date: Date
}
// admin fetch provider service availability details response interface
export interface AdminFetchProviderServiceAvailabilityResProps extends CommonResponse {
    availability: FontendAvailabilityForResponse | {};
}


// admin fetch provider subscriptions request payload type
export type AdminFetchProviderSubscriptionsRequestPayload = {
    providerId: Provider["_id"];
}
// admin fetch provider subscriptions response interface
type SubscripionsResProps = Pick<Subscription, "startDate" | "endDate" | "subscriptionStatus">;
interface AdminFetchProviderSubscriptions extends SubscripionsResProps {
    subscriptionPlanId?: {
        _id: string;
        planName: string;
    };
}
export interface AdminFetchProviderSubscriptionsResProps extends CommonResponse {
    subscriptions: AdminFetchProviderSubscriptions[] | [];
}


// admin fetch provider payments request payload type
export type AdminFetchProviderPaymentsRequestPayload = {
    providerId: Provider["_id"];
}
// admin fetch provider payments response interface
export interface AdminFetchProviderPaymentsResProps extends CommonResponse {
    payments: Array<Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">> | [];
}