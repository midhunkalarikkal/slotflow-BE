import { z } from "zod";

// **** user address controller **** \\
const UserAddAddressZodSchema = z.object({
    addressLine: z.string().min(10).max(25),
    phone: z.string(),
    place: z.string().min(3).max(25),
    city: z.string().min(3).max(25),
    district: z.string().min(3).max(25),
    pincode: z.string().length(6),
    state: z.string().min(3).max(25),
    country: z.string().min(3).max(25),
    googleMapLink: z.string(),
});


// **** user provider controller **** \\
const UserProviderControllerCommonZodSchema = z.object({
    providerId: z.string().regex(/^[a-f\d]{24}$/i)
});

const UserFetchAllProvidersZodSchema = z.object({
    selectedServices: z.string().optional(),
})

const UserFetchServiceAvailabilityQuerySchema = z.object({
    date: z.string().refine(val => !isNaN(Date.parse(val)),
        { message: "Invalid date format" }),
});


// **** user booking controller **** \\
const UserCreateSessionIdForbookingViaStripeZodSchema = z.object({
    providerId: z.string().regex(/^[a-f\d]{24}$/i),
    slotId: z.string().regex(/^[a-f\d]{24}$/i),
    date: z.string().refine(val => !isNaN(Date.parse(val)),
        { message: "Invalid date format" }),
    selectedServiceMode: z.string(),
});

const UserSaveBookingAfterStripePaymentZodSchema = z.object({
    sessionId: z.string(),
});

const UserCancelBookingZodSchema = z.object({
    bookingId: z.string().regex(/^[a-f\d]{24}$/i),
});

export { 
    UserAddAddressZodSchema, 
    UserProviderControllerCommonZodSchema, 
    UserFetchAllProvidersZodSchema, 
    UserFetchServiceAvailabilityQuerySchema, 
    UserCreateSessionIdForbookingViaStripeZodSchema ,
    UserSaveBookingAfterStripePaymentZodSchema,
    UserCancelBookingZodSchema
};