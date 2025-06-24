import { z } from "zod";
import { Types } from "mongoose";
import { objectIdField, stringField } from "./common.zod";

// **** user profile controller **** \\
// User update user info controller zod validation
export const UserUpdateInfoZOdSchema = z.object({
    username: stringField("Username",4,30,/^[a-zA-Z ]{4,30}$/,"Invalid username"),
    phone: stringField("Phone",10,15,/^\+\d{10,15}$/, "Invalid phone number")
})





// **** user provider controller **** \\
// User fetch providers for the dashboard provider listing
export const UserFetchAllProvidersZodSchema = z.object({
    selectedServices: stringField("Selected services",3,200).optional(),
});

// User fetch provider address controller zod validation
// user fetch provider service details constoller zod validation
// user fetch provider profile details controller zod validation
// User fetch provider service availability controller zod validation
const UserProviderControllerCommonZodSchema = z.object({
    providerId: objectIdField("Provider ID"),
});





// **** user booking controller **** \\
// user create a session for appointment booking using stripe zod validation
const UserCreateSessionIdForbookingViaStripeZodSchema = z.object({
    providerId: objectIdField("Provider ID"),
    slotId: objectIdField("Slot ID"),
    date: z.preprocess((val) => {
        if (typeof val === "string" || val instanceof String) {
            const parsed = new Date(val as string);
            if (!isNaN(parsed.getTime())) return parsed;
        }
        return val;
    }, z.date({
        required_error: "Date is required",
        invalid_type_error: "Date must be a valid Date object",
    })),
    selectedServiceMode: z.enum(["online", "offline"],{
        required_error: "Selected service mode is required",
        invalid_type_error: "Selected service mode must be a string"
    }),
});





// **** user booking controller **** \\
const UserCancelBookingZodSchema = z.object({
    bookingId: z.string({
        required_error: "Booking ID is required",
        invalid_type_error: "Booking ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid Booking ID",
    }),
});

export {
    UserProviderControllerCommonZodSchema,
    UserCreateSessionIdForbookingViaStripeZodSchema,
    UserCancelBookingZodSchema
};
