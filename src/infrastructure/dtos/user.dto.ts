import { Types } from "mongoose";
import { User } from "../../domain/entities/user.entity";
import { Address } from "../../domain/entities/address.entity";
import { Booking } from "../../domain/entities/booking.entity";
import { Service } from "../../domain/entities/service.entity";
import { Provider } from "../../domain/entities/provider.entity";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { FontendAvailabilityForResponse, TimeSlotForFrontendResponse } from "../../domain/entities/serviceAvailability.entity";


// ************ used in userProfile.use-case ************ \\

// user fetch profile use case request payload interface
export interface UserFetchProfileRequest {
    userId: User["_id"];
}
// user fetch profile details use case response interface
export type UserFetchProfileDetailsResponse = Pick<User, "username" | "email" | "isBlocked" | "isEmailVerified" | "phone" | "createdAt"> | {};


// user update profile image use case request payload interface 
export interface UsrUpdateProfileImageRequest {
    userId: User["_id"],
    file: Express.Multer.File
}
// user update profile image use case response interface
export type UserUpdateProfileImageResponse = User["profileImage"];


// user update user info request payload interface
export interface UserUpdateUserInfoRequest {
    userId: User["_id"];
    username: User["username"];
    phone: User["phone"];
}
// user update user info use case response interface
export type UserUpdateUserInfoResponse = Pick<User, "username" | "phone">





// ************ used in userAddress.use-case ************ \\

// user fetch user address use case request payload interface
export interface UserFetchUserAddressRequest {
    userId: User["_id"];
}
// user fetch user address use case response interface
export type UserFetchAddressResponse = Pick<Address, "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink"> | {};


// user add new address use case request payload interface
type AddressRequest = Pick<Address, "addressLine" | "city" | "country" | "district" | "googleMapLink" | "phone" | "place" | "pincode" | "state"> 
export interface UserAddAddressRequest extends AddressRequest{
    userId: User["_id"]
} 





// ************ used in userProvider.use-case ************ \\

// user fetch service providers use case request payload interface
export interface UserFetchServiceProvidersRequest {
    userId: User["_id"];
    serviceIds: ProviderService["_id"][]
}
// user fetch service providers use case response interface
export interface FindProvidersUsingServiceCategoryIdsResponse {
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
export type UserFetchServiceProvidersResponse = FindProvidersUsingServiceCategoryIdsResponse


// user fetch provider details use case request payload interface
export interface UserFetchServiceProviderDetailsRequest {
    userId: User["_id"];
    providerId: Provider["_id"];
}
// user fetch provider details use case response interface
export type UserFetchServiceProviderDetailsResponse = Pick<Provider, "_id" | "username" | "email" | "profileImage" | "trustedBySlotflow" | "phone">;


// user fetch provider address use case request payload interface
export interface UserFetchServiceProviderAddressRequest {
    userId: User["_id"];
    providerId: Provider["_id"];
}
// user fetch provider address use case response interface
export type UserFetchServiceProviderAddressResponse = Pick<Address, "userId" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">


// user fetch provider service use case request payload interface
export interface UserFetchServiceproviderServiceRequest {
    userId: User["_id"];
    providerId: Provider["_id"];
}
// user fetch provider service use case response interface
type FindProviderServiceProps = Pick<ProviderService, "serviceName" | "serviceDescription" | "servicePrice" | "providerExperience">;
export interface FindProviderServiceResponse extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">
}
export type UserFetchProviderServiceResponse = FindProviderServiceResponse | {};


// user fetch provider service availability use case request payload interface
export interface UserFetchProviderServiceAvailabilityRequest {
    userId: User["_id"];
    providerId: Provider["_id"];
    date: Date
}
// user fetch provider servide availability use case response interface
export type UserFetchProviderServiceAvailabilityResponse = FontendAvailabilityForResponse | {};


// user fetch providers for chat side bar
export type UserFetchProvidersForChatSidebar = Array<Pick<Provider, "_id" | "username" | "profileImage" >>;





// ************ used in userBooking.use-case ************ \\

// user appointment booking via stripe creating session id use case request payload
export interface UserAppointmentBookingViaStripeRequest {
    userId: User["_id"];
    providerId: Provider["_id"]; 
    slotId: TimeSlotForFrontendResponse["_id"]; 
    selectedServiceMode: string; 
    date: Date
}


// use save appointment booking after stripe payment use case request payload
export interface UserSaveAppoinmentBookingRequest {
    userId: User["_id"];
    sessionId: string;
}


// user can cel booking use case request payload interface
export interface UserCancelBookingRequest {
    userId: User["_id"];
    bookingId: Booking["_id"];
}














