import { z } from "zod";
import { Types } from "mongoose";

// **** admin plan controller **** \\
const AdminAddNewPlanZodSchema = z.object({
    planName: z
        .string({
            required_error: "Plan name is required",
            invalid_type_error: "Plan name must be a string"
        })
        .min(4, "Plan name must be at least 4 characters")
        .max(20, "Plan name must be at most 20 characters")
        .regex(/^[A-Za-z\s]+$/, "Plan name must contain only alphabets and spaces"),

    description: z
        .string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string"
        })
        .min(10, "Description must be at least 10 characters")
        .max(200, "Description must be at most 200 characters")
        .regex(/^[\w\d\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/, "Description contains invalid characters"),

    price: z
        .number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number"
        })
        .min(0, "Price must be at least 0")
        .max(100000, "Price must be at most 100000"),

    features: z
        .array(
            z.string({
                required_error: "Feature is required",
                invalid_type_error: "Feature must be a string"
            }).min(1, "Feature cannot be empty")
        )
        .min(1, "At least one feature is required")
        .max(10, "Maximum 10 features allowed"),

    maxBookingPerMonth: z
        .number({
            required_error: "Maximum bookings per month is required",
            invalid_type_error: "Maximum bookings must be a number"
        })
        .min(0, "Min value is 0")
        .max(10000, "Max value is 10000"),

    adVisibility: z.enum(["true", "false"], {
        required_error: "Ad visibility is required",
        invalid_type_error: "Ad visibility must be 'true' or 'false'"
    }),
});

const AdminChangePlanIsBlockedStatusReqParamsZodSchema = z.object({
    planId: z.string({
        required_error: "Plan ID is required",
        invalid_type_error: "Plan ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid Plan ID format",
    })
});

const AdminChangePlanIsBlockedStatusReqQueryZodSchema = z.object({
    isBlocked: z.enum(["true", "false"], {
        required_error: "Blocked status is required",
        invalid_type_error: "Blocked status must be 'true' or 'false'",
    }),
});

// **** admin provider controller **** \\
const AdminApproveProviderZodSchema = z.object({
    providerId: z.string({
        required_error: "Provider ID is required",
        invalid_type_error: "Provider ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid Provider ID format",
    })
});

const AdminChangeProviderStatusZodSchema = z.object({
    providerId: z.string({
        required_error: "Provider ID is required",
        invalid_type_error: "Provider ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid Provider ID format",
    }),
    isBlocked: z.enum(["true", "false"], {
        required_error: "Blocked status is required",
        invalid_type_error: "Blocked status must be 'true' or 'false'",
    }),
});

const AdminChangeProviderTrustedTagZodSchema = z.object({
    providerId: z.string({
        required_error: "Provider ID is required",
        invalid_type_error: "Provider ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid Provider ID format",
    }),
    trustedBySlotflow: z.enum(["true", "false"], {
        required_error: "Trusted tag status is required",
        invalid_type_error: "Trusted tag must be 'true' or 'false'",
    }),
});

const AdminProviderIdZodSchema = z.object({
    providerId: z.string({
        required_error: "Provider ID is required",
        invalid_type_error: "Provider ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid Provider ID format",
    }),
});

const AdminDateZodSchema = z.object({
    date: z.date({
        required_error: "Date is required",
        invalid_type_error: "Date must be a valid Date object",
    }),
});

// **** admin service controller **** \\
const AdminAddServiceXZodSchema = z.object({
    serviceName: z.string({
        required_error: "Service name is required",
        invalid_type_error: "Service name must be a string"
    }).min(4, "Minimun length is 4 characters")
      .max(25, "Maximum length is 25"),
});

const AdminChangeServiceStatusParamsZodSchema = z.object({
    serviceId: z.string({
        required_error: "Service ID is required",
        invalid_type_error: "Service ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid Service ID format",
    }),
});

const AdminChangeServiceStatusQueryZodSchema = z.object({
    isBlocked: z.enum(["true", "false"], {
        required_error: "isBlocked is required",
        invalid_type_error: "isBlocked must be 'true' or 'false'",
    }),
});

// **** admin subscription controller **** \\
const AdminGetSubscriptionDetailsParamsZodSchmea = z.object({
    subscriptionId: z.string({
        required_error: "Subscription ID is required",
        invalid_type_error: "Subscription ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid Subscription ID format",
    }),
});

// **** admin user controller **** \\
const AdminChangeUserStatusZOdSchema = z.object({
    userId: z.string({
        required_error: "User ID is required",
        invalid_type_error: "User ID must be a string"
    }).refine(id => Types.ObjectId.isValid(id), {
        message: "Invalid User ID format",
    }),
    isBlocked: z.enum(["true", "false"], {
        required_error: "Blocked status is required",
        invalid_type_error: "Blocked status must be 'true' or 'false'",
    }),
})

export {
    AdminDateZodSchema,
    AdminAddNewPlanZodSchema,
    AdminProviderIdZodSchema,
    AdminAddServiceXZodSchema,
    AdminApproveProviderZodSchema,
    AdminChangeUserStatusZOdSchema,
    AdminChangeProviderStatusZodSchema,
    AdminChangeProviderTrustedTagZodSchema,
    AdminChangeServiceStatusQueryZodSchema,
    AdminChangeServiceStatusParamsZodSchema,
    AdminGetSubscriptionDetailsParamsZodSchmea,
    AdminChangePlanIsBlockedStatusReqQueryZodSchema,
    AdminChangePlanIsBlockedStatusReqParamsZodSchema,
};
