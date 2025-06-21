import { z } from "zod";
import { Types } from "mongoose";


// **** Provider Service Controller **** \\
const ProviderAddServiceDetailsZodSchema = z.object({
    serviceName: z.string({
        required_error: "Service name is required",
        invalid_type_error: "Service name must be a string"
    })
        .min(4, "Service name must be at least 4 characters long")
        .max(25, "Service name must be at most 25 characters long")
        .regex(/^[A-Za-z ]+$/, "Service name should only contain alphabets and spaces"),

    serviceDescription: z.string({
        required_error: "Service description is required",
        invalid_type_error: "Service description must be a string"
    })
        .min(4, "Service description must be at least 4 characters")
        .max(250, "Service description must be at most 250 characters")
        .regex(/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/, "Invalid service description"),

    servicePrice: z.preprocess(
        (val) => Number(val),
        z.number({
            required_error: "Service price is required",
            invalid_type_error: "Service price must be a number"
        })
            .min(1, "Service price must be at least 1")
            .max(10000000, "Service price must be less than or equal to 1 crore")
    ),

    providerAdhaar: z.string({
        required_error: "Adhaar number is required",
        invalid_type_error: "Adhaar number must be a string"
    })
        .length(6, "Adhaar number must be exactly 6 digits")
        .regex(/^\d{6}$/, "Adhaar number must contain only digits"),

    providerExperience: z.string({
        required_error: "Experience is required",
        invalid_type_error: "Experience must be a string"
    })
        .min(1, "Experience must be at least 1 character")
        .max(100, "Experience must be at most 100 characters")
        .regex(/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/, "Invalid experience"),

    serviceCategory: z.string({
        required_error: "Service category is required",
        invalid_type_error: "Service category must be a string"
    })
        .min(1, "Service category is required"),
});

// **** Provider Subscription Controller **** \\
const ProviderPlanSubscribeZodSchema = z.object({
    planId: z.string({
        required_error: "Plan ID is required",
        invalid_type_error: "Plan ID must be a string"
    })
        .refine(id => Types.ObjectId.isValid(id), {
            message: "Invalid Plan ID",
        }),

    planDuration: z.enum(["1 Month", "3 Months", "6 Months", "12 Months"], {
        errorMap: () => ({ message: "Invalid plan duration" }),
    }),
});

export {
    ProviderAddServiceDetailsZodSchema,
    ProviderPlanSubscribeZodSchema,
};
