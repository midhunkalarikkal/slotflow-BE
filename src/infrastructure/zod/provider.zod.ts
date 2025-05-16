import { z } from "zod"

// **** provider service controller **** \\
const ProviderAddServiceDetailsZodSchema = z.object({
    serviceName: z.string()
        .min(4, "Service name must be at least 4 characters long")
        .max(25, "Service name must be at most 25 characters long")
        .regex(/^[A-Za-z ]{4,25}$/, "Service name should only contain alphabets and spaces"),

    serviceDescription: z.string()
        .min(4, "Service description must be at least 4 characters")
        .max(250, "Service description must be at most 250 characters")
        .regex(/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{4,250}$/, "Invalid service description"),

    servicePrice: z.number()
        .min(1, "Service price must be at least 1")
        .max(10000000, "Service price must be less than 1 crore"),

    providerAdhaar: z.string()
        .length(6, "Adhaar number must be exactly 6 digits")
        .regex(/^\d{6}$/, "Adhaar number must contain only digits"),

    providerExperience: z.string()
        .min(1, "Experience is required")
        .max(100, "Experience must be less than 100 characters")
        .regex(/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{1,100}$/, "Invalid experience"),

    providerCertificateUrl: z.string().url("Invalid certificate URL"),

    serviceCategory: z.string().min(1, "Service category is required"),
});

const ProviderPlanSubscribeZodSchema = z.object({
    planId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid plan ID format"),
    planDuration: z.enum(["1 Month", "3 Months", "6 Months", "12 Months"], {
        errorMap: () => ({ message: "Invalid plan duration" }),
    }),
});

export {
    ProviderAddServiceDetailsZodSchema,
    ProviderPlanSubscribeZodSchema,
}