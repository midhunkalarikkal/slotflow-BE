import { CommonResponse } from "./common.dto";
import { Plan } from "../../domain/entities/plan.entity";
import { Address } from "../../domain/entities/address.entity";
import { Payment } from "../../domain/entities/payment.entity";
import { Service } from "../../domain/entities/service.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { Subscription } from "../../domain/entities/subscription.entity";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { FontendAvailabilityForResponse, FrontendAvailabilityForRequest } from "../../domain/entities/serviceAvailability.entity";
import { Booking } from "../../domain/entities/booking.entity";

// **** used in providerAddress.use-case **** \\

// provider add address use case request payload type
type AddAddressUseCaseRequestPayload = Pick<Address, "addressLine" | "place" | "phone" | "city" | "country" | "district" | "pincode" | "state" | "googleMapLink">;
export interface ProvideAddAddressUseCaseRequestPayload extends AddAddressUseCaseRequestPayload {
    providerId: Provider["_id"];
}


// provider fetch address use case request payload interface
export interface ProviderFetchAddressUseCaseRequestPayload {
    providerId: Provider["_id"];
}
// provider fetch address use case response interface
export interface ProviderFetchAddressUseCaseResponse extends CommonResponse {
    address: Pick<Address, "_id" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink"> | {};
}





// **** used in providerAppService.use-case **** \\

// provder fetch all app services response props
export interface ProviderFetchAllAppServicesResProps extends CommonResponse {
    services: Array<Pick<Service, "_id" | "serviceName">> | [];
}





// **** used in providerPayment.use-case **** \\

// provider fetch all payments use case request interface
export interface ProviderFetchAllPaymentUseCaseRequestPayload {
    providerId: Provider["_id"];
}
// provider fetch all payments use case response interface 
export interface ProviderFetchAllPaymentUseCaseResponse extends CommonResponse {
    payments: Array<Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">> | [];
}





// **** used in providerPlan.use-case **** \\

// provider fetch all plans use case response interface 
export interface ProviderFetchAllPlansUseCaseResponse extends CommonResponse {
    plans: Array<Pick<Plan, "_id" | "planName" | "price" | "features" | "description">> | [];
}





// **** used in providerProfile.use-case **** \\

// provider fetch profile detals use case request payload interface
export interface ProviderFetchProfileDetailsUseCaseRequestPayload {
    providerId: Provider["_id"];
}
// provider fetch profile detals use case response interface
export interface ProviderFetchProfileDetailsUseCaseResponse extends CommonResponse {
    profileDetails: Pick<Provider, "username" | "email" | "isAdminVerified" | "isBlocked" | "isEmailVerified" | "phone" | "createdAt"> | {};
}


// provider update profile image use case request payload interface
export interface ProviderUpdateprofileImageRequestPayload {
    providerId: Provider["_id"];
    file: Express.Multer.File;
}
// provider update profile image use case response interface 
export interface ProviderUpdateprofileImageResponse extends CommonResponse, Pick<Provider, "profileImage"> { }


// provider update providerInfo request payload interface
export interface ProviderUpdateProviderInfoUseCaseRequestPayload {
    providerId: Provider["_id"];
    username: Provider["username"];
    phone: Provider["phone"];
}
// provider update provider info use case response interface
export interface ProviderUpdateProviderInfoUseCaseResponse extends CommonResponse {
    providerInfo: Pick<Provider, "username" | "phone">
}




// **** used in providerService.use-case **** \\

// provider add service details use case request payload interface
type AddServiceDetailsUseCaseRequestPayload = Pick<ProviderService, "providerId" | "serviceCategory" | "serviceName" | "serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience">;
export interface ProviderAddServiceDetailsUseCaseRequestPayload extends AddServiceDetailsUseCaseRequestPayload {
        file: Express.Multer.File
}


// provider fetch service details use case request payload
export interface ProviderFetchProviderServiceUseCaseRequestPayload {
    providerId: Provider["_id"];
}
// provider fetch service details use case respomse interface
type FindProviderServiceProps = Pick<ProviderService, "_id" | "serviceName" | "serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience" | "providerCertificateUrl" | "updatedAt" | "createdAt">;
export interface ProviderFindProviderServiceResProps extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">;
}
export interface ProviderFetchProviderServiceUseCaseResponse extends CommonResponse {
    service: ProviderFindProviderServiceResProps | {};
}





// **** used in providerServiceAvailability **** \\

// provider add service availability use case reques tpayload
export interface ProviderAddServiceAvailabilityUseCaseRewuestPayload {
    providerId: Provider["_id"];
    availabilities: FrontendAvailabilityForRequest[]
}


//  provider fetch service availability use case response interface 
export interface ProviderFetchServiceAvailabilityUseCaseRequestPayload {
    providerId: Provider["_id"];
    date: Date
}
//  provider fetch service availability use case response interface 
export interface ProviderFetchServiceAvailabilityUseCaseResponse extends CommonResponse {
    availability : FontendAvailabilityForResponse | {};
}





// **** used in providerStripeSubscription.use-case **** \\

// provider stripe subscription create sessionId use case  request payload interface
export interface ProviderStripeSubscriptionCreateSessionIdUseCaseRequestPayload {
    providerId: Provider["_id"];
    planId: Plan["_id"];
    duration: string;
}
// provider stripe subscription create sessionId use case response interface
export interface ProviderStripeSubscriptionCreateSessionIdUseCaseResponse extends CommonResponse {
    sessionId : string
}


// provider save subscription after stripe payment use case request payload interface
export interface ProviderSaveSubscriptionUseCaseRequestPayload {
    providerId: Provider["_id"];
    sessionId: string
}





// **** used in providerSubscription.use-case **** \\

// provider fetch subscriptions use case request payload interface
export interface ProviderFetchProviderSubscriptionsUseCaseRequestPayload {
    providerId: Provider["_id"];
}
// provider fetch subscriptions use case response interface
type SubscripionsResProps = Pick<Subscription, "startDate" | "endDate" | "subscriptionStatus">;
interface AdminFetchProviderSubscriptions extends SubscripionsResProps {
    subscriptionPlanId?: {
        _id: string;
        planName: string;
    };
}
export interface ProviderFetchProviderSubscriptionsUseCaseResponse extends CommonResponse {
    subscriptions: AdminFetchProviderSubscriptions[] | [];
}


// provider trial subscription use case reuest payload
export interface ProviderTrialSubscriptionUseCaseRequestPayload {
    providerId: Provider["_id"];
}





// **** used in providerBooking.use-case **** \\

// provider fetch bookings use case request payload interface
export interface ProviderFetchBookingAppointmentsUseCaseRequestPayload {
    providerId: Provider['_id']
}
// provider fetch bookings use case response interface
export interface ProviderFetchBookingAppointmentsUseCaseResponse extends CommonResponse {
    bookingAppointments : Array<Pick<Booking, "_id" | "appointmentDate" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "createdAt" >>;
}