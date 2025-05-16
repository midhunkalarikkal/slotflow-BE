import { z } from "zod";
import validator from "validator";

// **** Address Schema **** \\
const AddAddressZodSchema = z.object({
    addressLine: z.string({
        required_error: "Address line is required",
        invalid_type_error: "Address line must be a string"
    })
        .min(10, "Address line should be at least 10 characters")
        .max(150, "Address line should be at most 150 characters")
        .regex(/^[a-zA-Z0-9\s.,#-]+$/, "Address line should only contain letters, numbers, spaces, and ,.#-"),

    phone: z.string({
        required_error: "Phone number is required",
        invalid_type_error: "Phone number must be a string"
    }).refine((val) => validator.isMobilePhone(val, ["en-IN"]), {
        message: "Invalid mobile number",
    }),

    place: z.string({
        required_error: "Place is required",
        invalid_type_error: "Place must be a string"
    })
        .min(2, "Place must be at least 2 characters")
        .max(50, "Place must be at most 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Place should only contain alphabets and spaces"),

    city: z.string({
        required_error: "City is required",
        invalid_type_error: "City must be a string"
    })
        .min(2, "City must be at least 2 characters")
        .max(50, "City must be at most 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "City should only contain alphabets and spaces"),

    district: z.string({
        required_error: "District is required",
        invalid_type_error: "District must be a string"
    })
        .min(2, "District must be at least 2 characters")
        .max(50, "District must be at most 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "District should only contain alphabets and spaces"),

    pincode: z.string({
        required_error: "Pincode is required",
        invalid_type_error: "Pincode must be a string"
    })
        .length(6, "Pincode must be exactly 6 digits")
        .refine((val) => validator.isPostalCode(val, "IN"), {
            message: "Invalid pincode",
        }),

    state: z.string({
        required_error: "State is required",
        invalid_type_error: "State must be a string"
    })
        .min(2, "State must be at least 2 characters")
        .max(50, "State must be at most 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "State should only contain alphabets and spaces"),

    country: z.string({
        required_error: "Country is required",
        invalid_type_error: "Country must be a string"
    })
        .min(2, "Country must be at least 2 characters")
        .max(50, "Country must be at most 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Country should only contain alphabets and spaces"),

    googleMapLink: z.string({
        required_error: "Google Map link is required",
        invalid_type_error: "Google Map link must be a string"
    })
        .url("Invalid Google Map link")
        .refine((val) => val.startsWith("https://maps.app.goo.gl/"), {
            message: "Link must be from Google Maps (maps.app.goo.gl)",
        }),
});

// **** Date Schema **** \\
const DateOnlyZodSchema = z.object({
    date: z.string({
        required_error: "Date is required",
        invalid_type_error: "Date must be a string"
    }).refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
});

// **** Stripe Payment Schema **** \\
const SaveStripePaymentZodSchema = z.object({
    sessionId: z.string({
        required_error: "Session ID is required",
        invalid_type_error: "Session ID must be a string"
    }),
});

export {
    AddAddressZodSchema,
    DateOnlyZodSchema,
    SaveStripePaymentZodSchema,
};
