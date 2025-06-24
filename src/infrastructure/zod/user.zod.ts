import { z } from "zod";
import { Types } from "mongoose";
import { stringField } from "./common.zod";

// **** user profile controller **** \\
// User update user info controller zod validation
export const UserUpdateInfoZOdSchema = z.object({
    username: stringField("Username",4,30,/^[a-zA-Z ]{4,30}$/,"Invalid username"),
    phone: stringField("Phone",10,15,/^\+\d{10,15}$/, "Invalid phone number")
})










// **** user provider controller **** \\
const UserProviderControllerCommonZodSchema = z.object({
    providerId: z.string({
        required_error: "Provider ID is required",
        invalid_type_error: "Provider ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid Provider ID",
    }),
});

const UserFetchAllProvidersZodSchema = z.object({
    selectedServices: z.string({
        invalid_type_error: "Selected services must be a string"
    }).optional(),
});

// **** user booking controller **** \\
const UserCreateSessionIdForbookingViaStripeZodSchema = z.object({
    providerId: z.string({
        required_error: "Provider ID is required",
        invalid_type_error: "Provider ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid Provider ID",
    }),

    slotId: z.string({
        required_error: "Slot ID is required",
        invalid_type_error: "Slot ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid Slot ID",
    }),

    date: z.string({
        required_error: "Date is required",
        invalid_type_error: "Date must be a string"
    }).refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),

    selectedServiceMode: z.string({
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
    UserFetchAllProvidersZodSchema,
    UserCreateSessionIdForbookingViaStripeZodSchema,
    UserCancelBookingZodSchema
};
