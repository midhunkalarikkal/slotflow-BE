import { Types } from "mongoose";
import { CommonResponse } from "./common.dto";
import { User } from "../../domain/entities/user.entity";
import { Address } from "../../domain/entities/address.entity";
import { Booking } from "../../domain/entities/booking.entity";
import { Service } from "../../domain/entities/service.entity";
import { Payment } from "../../domain/entities/payment.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { FontendAvailabilityForResponse, TimeSlotForFrontendResponse } from "../../domain/entities/serviceAvailability.entity";

// **** used in userAddress.use-case **** \\

// user fetch user address use case request payload interface
export interface UserFetchUserAddressUseCaseRequestPayload {
    userId: User["_id"];
}
// user fetch user address use case response interface
export interface UserFetchAddressUseCaseResponse extends CommonResponse {
    address: Pick<Address, "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink"> | {};
}


// user add new address use case request payload interface
type AddressRequestPayload = Pick<Address, "addressLine" | "city" | "country" | "district" | "googleMapLink" | "phone" | "place" | "pincode" | "state"> 
export interface UserAddAddressUseCaseRequestPayload extends AddressRequestPayload{
    userId: User["_id"]
} 





// **** used in userBooking.use-case **** \\

// user appointment booking via stripe creating session id use case request payload
export interface UserAppointmentBookingViaStripeUseCaseRequestPayload {
    userId: User["_id"];
    providerId: Provider["_id"]; 
    slotId: TimeSlotForFrontendResponse["_id"]; 
    selectedServiceMode: string; 
    date: Date
}
// user appointment booking via stripe creating session id use case response
export interface UserAppointmentBookingViaStripeUseCaseResponse extends CommonResponse {
    sessionId: string;
}


// use save appointment booking after stripe payment use case request payload
export interface UserSaveAppoinmentBookingUseCaseRequestPayload {
    userId: User["_id"];
    sessionId: string;
}


// user fetch bookings use case request payload interface
export interface UserFetchAppointmentBookingsUseCaseRequestPayload {
    userId: User["_id"];
}
// user fetch bookings use case response interface
type FindAllBookingsResponseProps = Pick<Booking, "_id" | "appointmentDate" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "createdAt" | "paymentId">;
export interface UserFetchAllBookingsUseCaseResponse extends CommonResponse {
    bookings: Array<FindAllBookingsResponseProps>
}

// user can cel booking use case request payload interface
export interface UserCancelBookingUseCaseRequestPayload {
    userId: User["_id"];
    bookingId: Booking["_id"];
}
// user cancel booking use case response interface
export interface UserCancelBookingUseCaseResProps extends CommonResponse {
    updatedBooking : Pick<Booking, "_id" | "appointmentDate" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "createdAt">;
}





// **** used in userProfile.use-case **** \\

// user fetch profile use case request payload interface
export interface UserFetchProfileUseCaseRequestPayload {
    userId: User["_id"];
}
// user fetch profile details use case response interface
export interface UserFetchProfileDetails extends CommonResponse {
    profileDetails: Pick<User, "username" | "email" | "isBlocked" | "isEmailVerified" | "phone" | "createdAt"> | {};
}

// user update profile image use case request payload interface 
export interface UsrUpdateProfileImageUseCaseRequestPayload {
    userId: User["_id"],
    file: Express.Multer.File
}
// user update profile image use case response interface
export interface UserUpdateProfileImageResProps extends CommonResponse, Pick<User, "profileImage"> { };





// **** used in userProvider.use-case **** \\

// user fetch service providers use case request payload interface
export interface UserFetchServiceProvidersUseCaseRequestPayload {
    userId: User["_id"];
    serviceIds: ProviderService["_id"][]
}
// user fetch service providers use case response interface
export interface FindProvidersUsingServiceCategoryIdsResProps {
    _id: Types.ObjectId,
    provider: {
        _id: Types.ObjectId,
        username: string,
        profileImage: string | null,
        trustedBySlotflow: boolean,
    },
    service: {
        serviceCategory: Types.ObjectId,
        serviceName: string,
        servicePrice: number,
        categoryName: string
    }
}
export interface UserFetchServiceProvidersUseCaseResponse extends CommonResponse {
    providers: Array<FindProvidersUsingServiceCategoryIdsResProps>
}


// user fetch provider details use case request payload interface
export interface UserFetchServiceProviderDetailsUseCaseRequestPayload {
    userId: User["_id"];
    providerId: Provider["_id"];
}
// user fetch provider details use case response interface
export interface UserFetchServiceProviderDetailsUseCaseResponse extends CommonResponse {
    provider: Pick<Provider, "_id" | "username" | "email" | "profileImage" | "trustedBySlotflow" | "phone">
}


// user fetch provider address use case request payload interface
export interface UserFetchServiceProviderAddressUseCaseRequestPayload {
    userId: User["_id"];
    providerId: Provider["_id"];
}
// user fetch provider address use case response interface
export interface UserFetchServiceProviderAddressUseCaseResponse extends CommonResponse {
    address: Pick<Address, "userId" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">
}


// user fetch provider service use case request payload interface
export interface UserFetchServiceproviderServiceUsecaseRequestPayload {
    userId: User["_id"];
    providerId: Provider["_id"];
}
// user fetch provider service use case response interface
type FindProviderServiceProps = Omit<ProviderService, "serviceCategory">;
export interface FindProviderServiceResProps extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">
}
export interface UserFetchProviderServiceUseCaseResponse extends CommonResponse {
    service: FindProviderServiceResProps | {};
}


// user fetch provider service availability use case request payload interface
export interface UserFetchProviderServiceAvailabilityUseCaseRequestPayload {
    userId: User["_id"];
    providerId: Provider["_id"];
    date: Date
}
// user fetch provider servide availability use case response interface
export interface UserFetchProviderServiceAvailabilityUseCaseResponse extends CommonResponse {
    availability: FontendAvailabilityForResponse | {};
}





// **** used in userPayment.use-case **** \\

// user fetch all payments use case request payload interface
export interface UserFetchAllPaymentsUseCaseRequestPayload {
    userId: User["_id"];
}
// user fetch all payments use case response interface
export interface UserFetchAllPaymentsUseCaseResponse extends CommonResponse {
    payments: Array<Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">> | [];
}