import { z } from "zod";

// **** user provider controller **** \\
const UserProviderControllerCommonZodSchema = z.object({
    providerId: z.string().regex(/^[a-f\d]{24}$/i)
});

const UserFetchAllProvidersZodSchema = z.object({
    selectedServices: z.string().optional(),
})


// **** user booking controller **** \\
const UserCreateSessionIdForbookingViaStripeZodSchema = z.object({
    providerId: z.string().regex(/^[a-f\d]{24}$/i),
    slotId: z.string().regex(/^[a-f\d]{24}$/i),
    date: z.string().refine(val => !isNaN(Date.parse(val)),
        { message: "Invalid date format" }),
    selectedServiceMode: z.string(),
});

const UserCancelBookingZodSchema = z.object({
    bookingId: z.string().regex(/^[a-f\d]{24}$/i),
});

export { 
    UserProviderControllerCommonZodSchema, 
    UserFetchAllProvidersZodSchema, 
    UserCreateSessionIdForbookingViaStripeZodSchema ,
    UserCancelBookingZodSchema
};