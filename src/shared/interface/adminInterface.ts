import { CommonResponse } from "./commonInterface";
import { User } from "../../domain/entities/user.entity";
import { Plan } from "../../domain/entities/plan.entity";
import { Service } from "../../domain/entities/service.entity";
import { Payment } from "../../domain/entities/payment.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { FindAllSubscriptionsResProps, findSubscriptionFullDetailsResProps } from "../../domain/repositories/ISubscription.repository";
import { Address } from "../../domain/entities/address.entity";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { ServiceAvailability } from "../../domain/entities/serviceAvailability.entity";
import { Subscription } from "../../domain/entities/subscription.entity";

// **** used in adminUser.use-case **** \\

// admin fetch all users for listing response props
export interface AdminUsersListResProps extends CommonResponse {
    users: Array<Pick<User, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified">>
}

// admin change user block status response props
export interface AdminChangeUserStatusResProps extends CommonResponse {
    updatedUser: Pick<User, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified">;
}





// **** used in adminSubscription.use-case **** \\

// Admin fetch all subscriptions response props
export interface AdminFetchAllSubscriptionsResProps extends CommonResponse {
    subscriptions: Array<FindAllSubscriptionsResProps>
}

// admin fetch subscription details response props
export interface AdminFetchSubscriptionDetailsResProps extends CommonResponse {
    subscriptionDetails: findSubscriptionFullDetailsResProps | {};
}





// **** used in adminService.use-case **** \\

// admin fetch all services response props
export interface AdminServiceListResProps extends CommonResponse {
    services: Array<Pick<Service, "_id" | "serviceName" | "isBlocked">>;
}

// admin add new service response props
export interface AdminAddServiceResProps extends CommonResponse {
    service: Pick<Service, "_id" | "serviceName" | "isBlocked">;
}

// admin change service block status response props
export interface AdminChangeServiceStatusResProps extends CommonResponse {
    updatedService: Pick<Service, "_id" | "serviceName" | "isBlocked">;
}





// **** used in adminOlan.use-case **** \\

// admin list all plans response props
export interface AdminPlanListResProps extends CommonResponse {
    plans: Array<Pick<Plan, "_id" | "planName" | "isBlocked">>;
}

// admin create new plan response props
export interface AdminCreatePlanResProps extends CommonResponse {
    plan: Pick<Plan, "_id" | "planName" | "isBlocked">;
}

// admin change plan block status response props
export interface AdminChangePlanStatusResProps extends CommonResponse {
    updatedPlan: Pick<Plan, "_id" | "planName" | "isBlocked">;
}





// **** used in adminPayment.use-case **** \\

// admin fetch all payments response props
type FetchAllPayments = Pick<Payment, "createdAt" | "totalAmount" | "paymentFor" | "paymentGateway" | "paymentStatus" | "paymentMethod">;
export interface AdminFetchAllPaymentsResProps extends CommonResponse {
    payments: Array<FetchAllPayments>
}





// **** used in adminProvider.use-case **** \\

// admin list all providers response props
export interface AdminProviderListResProps extends CommonResponse {
    providers: Array<Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified" | "trustedBySlotflow">>;
}

// admin approve provider response props
export interface AdminApproveProviderRespRops extends CommonResponse {
    updatedProvider: Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified" | "trustedBySlotflow">;
}

// admin change provider block status response props
export interface AdminChangeProviderStatusResProps extends CommonResponse {
    updatedProvider: Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified" | "trustedBySlotflow">;
}

// admin change provider trusted by slotflow status response props
export interface AdminChangeProviderTrustTagResProps extends CommonResponse {
    updatedProvider: Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isAdminVerified" | "trustedBySlotflow">;
}

// admin fetch a specific provider details response props
export interface AdminFetchProviderDetailsResProps extends CommonResponse {
    provider: Pick<Provider, "_id" | "username" | "email" | "isBlocked" | "isEmailVerified" | "isAdminVerified" | "phone" | "profileImage" | "trustedBySlotflow" | "createdAt"> | {};
}

// admin fetch a specific provider address details response props
export interface AdminFetchProviderAddressResProps extends CommonResponse {
    address: Pick<Address, "userId" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink"> | {};
}

// admin fetch provider service details response props
type FindProviderServiceProps = Omit<ProviderService, "serviceCategory">;
export interface FindProviderServiceResProps extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">
}
export interface AdminFetchProviderServiceResProps extends CommonResponse {
    service: FindProviderServiceResProps | {};
}

// admin fetch provider service availability details response props
export interface AdminFetchProviderServiceAvailabilityResProps extends CommonResponse {
    availability: Pick<ServiceAvailability, "availability"> | {};
}

// admin fetch provider subscriptions response props
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

// admin fetch provider payments response props
export interface AdminFetchProviderPaymentsResProps extends CommonResponse {
    payments: Array<Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">> | [];
}