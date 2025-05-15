import { z } from "zod";

const UserProviderControllerCommonZodSchema = z.object({
    providerId: z.string().regex(/^[a-f\d]{24}$/i)
});

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

const UserFetchAllProvidersZodSchema = z.object({
    selectedServices: z.string().optional(),
})

const UserFetchServiceAvailabilityQuerySchema = z.object({
    date: z.string().refine(val => !isNaN(Date.parse(val)),
        { message: "Invalid date format" }),
});

export { UserAddAddressZodSchema, UserProviderControllerCommonZodSchema,UserFetchAllProvidersZodSchema, UserFetchServiceAvailabilityQuerySchema };