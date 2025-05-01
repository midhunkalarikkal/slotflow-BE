import { Types } from "mongoose";
import { CommonResponse } from "./commonInterface";
import { User } from "../../domain/entities/user.entity";
import { Address } from "../../domain/entities/address.entity";
import { Booking } from "../../domain/entities/booking.entity";
import { Service } from "../../domain/entities/service.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { ServiceAvailability } from "../../domain/entities/serviceAvailability.entity";
import { Payment } from "../../domain/entities/payment.entity";

// **** used in userAddress.use-case **** \\

// user fetch address
export interface UserFetchAddressResProps extends CommonResponse {
    address: Pick<Address, "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink"> | {};
}





// **** used in userBooking.use-case **** \\

// user fetch bookings
type FindAllBookingsResponseProps = Pick<Booking, "_id" | "appointmentDay" | "appointmentDate" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "createdAt" | "paymentId">;
export interface UserFetchAllBookingsResponseProps extends CommonResponse {
    bookings: Array<FindAllBookingsResponseProps>
}

// user cancel booking
export interface UserCancelBookingUseCaseResProps extends CommonResponse {
    updatedBooking : Pick<Booking, "_id" | "appointmentDay" | "appointmentDate" | "appointmentMode" | "appointmentStatus" | "appointmentTime" | "createdAt">;
}





// **** used in userProfile.use-case **** \\

// user fetch profile details
export interface UserFetchProfileDetails extends CommonResponse {
    profileDetails: Pick<User, "username" | "email" | "isBlocked" | "isEmailVerified" | "phone" | "createdAt"> | {};
}

// user update profile image
export interface UserUpdateProfileImageResProps extends CommonResponse, Pick<User, "profileImage"> { };





// **** used in userProvider.use-case **** \\

// user fetch service providers for dashboard
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
export interface UserFetchServiceProvidersResProps extends CommonResponse {
    providers: Array<FindProvidersUsingServiceCategoryIdsResProps>
}

// user fetch provider details
export interface UserFetchServiceProviderDetailsResProps extends CommonResponse {
    provider: Pick<Provider, "_id" | "username" | "email" | "profileImage" | "trustedBySlotflow" | "phone">
}

// user fetch provider address
export interface UserFetchServiceProviderAddressResProps extends CommonResponse {
    address: Pick<Address, "userId" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">
}

// user fetch provider service
type FindProviderServiceProps = Omit<ProviderService, "serviceCategory">;
export interface FindProviderServiceResProps extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">
}
export interface UserFetchProviderServiceResProps extends CommonResponse {
    service: FindProviderServiceResProps | {};
}

// user fetch provider servide availability
export interface UserFetchProviderServiceAvailabilityResProps extends CommonResponse {
    availability: Pick<ServiceAvailability, "availability"> | {};
}





// **** used in userPayment.use-case **** \\

// user fetch all payments response props
export interface UserFetchAllPaymentsResponseProps extends CommonResponse {
    payments: Array<Pick<Payment, "paymentStatus" | "paymentMethod" | "paymentGateway" | "paymentFor" | "discountAmount" | "totalAmount" | "createdAt" | "_id">> | [];
}