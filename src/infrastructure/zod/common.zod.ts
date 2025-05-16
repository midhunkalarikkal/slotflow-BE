import { z } from "zod";
import validator from "validator";

const AddAddressZodSchema = z.object({
    addressLine: z.string()
        .min(10, "Address line should be at least 10 characters")
        .max(150, "Address line should be at most 150 characters")
        .regex(/^[a-zA-Z0-9\s.,#-]+$/, "Address line should only contain letters, numbers, spaces, and ,.#-"),

    phone: z.string().refine((val) => validator.isMobilePhone(val, ["en-IN"]), {
        message: "Invalid mobile number.",
    }),

    place: z.string()
        .min(2).max(50)
        .regex(/^[a-zA-Z\s]+$/, "Place should only contain alphabets and spaces"),

    city: z.string()
        .min(2).max(50)
        .regex(/^[a-zA-Z\s]+$/, "City should only contain alphabets and spaces"),

    district: z.string()
        .min(2).max(50)
        .regex(/^[a-zA-Z\s]+$/, "District should only contain alphabets and spaces"),

    pincode: z.string().length(6).refine((val) => validator.isPostalCode(val, "IN"), {
        message: "Invalid pincode.",
    }),

    state: z.string()
        .min(2).max(50)
        .regex(/^[a-zA-Z\s]+$/, "State should only contain alphabets and spaces"),

    country: z.string()
        .min(2).max(50)
        .regex(/^[a-zA-Z\s]+$/, "Country should only contain alphabets and spaces"),

    googleMapLink: z.string()
        .url("Invalid Google Map link")
        .refine((val) => val.startsWith("https://maps.app.goo.gl/"), {
            message: "Link must be from Google Maps (maps.app.goo.gl)",
        }),
});

const DateOnlyZodSchema = z.object({
    date: z.string().refine(val => !isNaN(Date.parse(val)),
        { message: "Invalid date format" }),
});

const SaveStripePaymentZodSchema = z.object({
    sessionId: z.string(),
});

export { 
    AddAddressZodSchema,
    DateOnlyZodSchema,
    SaveStripePaymentZodSchema,
 }