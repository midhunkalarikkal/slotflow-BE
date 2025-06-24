import { z } from "zod";
import { Types } from "mongoose";
import { booleanField, numberField, objectIdField, stringField } from "./common.zod";

// **** admin provider controller **** \\
// Admin provider controllers provider id only zod schema
const AdminProviderIdZodSchema = z.object({
    providerId: objectIdField("Provider ID"),
});

// Admin provider approve controller zod validation
const AdminApproveProviderZodSchema = z.object({
    providerId: objectIdField("Provider ID"),
});

// Admin provider block status change controller zod validation
const AdminChangeProviderStatusZodSchema = z.object({
    providerId: objectIdField("Provider ID"),
    isBlocked: booleanField("Provider isBlocked"),
});

// Admin provider trust tag change controller zod validation
const AdminChangeProviderTrustedTagZodSchema = z.object({
    providerId: objectIdField("Provider ID"),
    trustedBySlotflow: booleanField("Provider trusted by slotflow"),
});





// **** admin user controller **** \\
// Admin user change block status controller zod validation
const AdminChangeUserBlockStatusZOdSchema = z.object({
    userId: objectIdField("User ID"),
    isBlocked: booleanField("User isBlocked")
})





// **** admin service controller **** \\
// Admin adding new app service name controller zod validation
const AdminAddServiceXZodSchema = z.object({
    appServiceName: stringField("Service name", 4, 50, /^[A-Za-z0-9 ]{4,50}$/, "Service name can only contain letters, numbers, and spaces"),
});

// Admin change app service block status controller zod validation
const AdminChangeServiceBlockStatusZodSchema = z.object({
    serviceId: objectIdField("Service ID"),
    isBlocked: booleanField("Service iBlocked"),
});









// **** admin plan controller **** \\
//Admin add new plan controller zod validation
const AdminAddNewPlanZodSchema = z.object({
    planName: stringField("PlanName",4,20,/^[a-zA-Z]{4,20}$/,"Invalid plan name. Only alphabets and spaces are allowed, length between 4 and 20."),
    description: stringField("Plan description",10,200,/^[\w\d\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{10,200}$/,"Invalid description. Contains unsupported characters."),
    price: numberField("Plan price",0,100000),
    features: z.array(
    stringField("Feature", 1, 50)
  )
  .min(1, "At least one feature is required")
  .max(10, "Maximum 10 features allowed"),
    maxBookingPerMonth: numberField("Plan maximum booking",0,10000),
    adVisibility: booleanField("Plan adVisibility"),
});

// Admin change plan block status controller zod validation
const AdminChangePlanIsBlockStatusZodSchema = z.object({
    planId: objectIdField("Plan Id"),
    isBlocked: booleanField("Plan isBlocked")
});





// **** admin subscription controller **** \\
// Admin fetch subsctiondetails controller zod validation
const AdminGetSubscriptionDetailsParamsZodSchmea = z.object({
    subscriptionId: objectIdField("Subscription ID")
});



export {
    AdminAddNewPlanZodSchema,
    AdminProviderIdZodSchema,
    AdminAddServiceXZodSchema,
    AdminApproveProviderZodSchema,
    AdminChangeUserBlockStatusZOdSchema,
    AdminChangeProviderStatusZodSchema,
    AdminChangeProviderTrustedTagZodSchema,
    AdminChangeServiceBlockStatusZodSchema,
    AdminGetSubscriptionDetailsParamsZodSchmea,
    AdminChangePlanIsBlockStatusZodSchema
};
