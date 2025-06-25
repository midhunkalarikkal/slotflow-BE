import { z } from "zod";
import { enumField, objectIdField, stringArrayField, stringField } from "./common.zod";
import { daysArray, subscriptionMonthArray, validSlotDuration } from "../helpers/constants";


// **** Provider Service Controller **** \\
// Provider add service details controller zod schema
export const ProviderAddServiceDetailsZodSchema = z.object({
    serviceName: stringField("Service name", 4, 50, /^[A-Za-z ]{4,50}$/, "Invalid service name. Service name should contain only alphabets and spaces and be between 4 and 50 characters."),
    serviceDescription: stringField("Service description", 10, 500, /^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{10,500}$/, "Invalid service description. Service description should contain alphanumeric characters, spaces, and special characters, and be between 10 and 500 characters."),
    servicePrice: z.preprocess(
        (val) => {
            if (typeof val === "string" && val.trim() !== "") return Number(val);
            return val;
        },
        z.number({
            required_error: "Service price is required",
            invalid_type_error: "Service price must be a number",
        })
            .min(1, "Service price must be at least 1")
            .max(1000000, "Service price must be at most 1000000")
    ),
    providerAdhaar: stringField("Service provider adhaar number", 6, 6, /^\d{6}$/, "Invalid adhaar number. Please enter exactly 6 digits."),
    providerExperience: stringField("Service provider experience", 1, 500, /^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{1,500}$/, "Invalid experience. Provider experience should contain alphanumeric characters, spaces, and special characters, and be between 1 and 500 characters."),
    serviceCategory: objectIdField("Service Category ID"),
});





// **** Provider service availability controller **** \\
// Provider add service availability
export const ProviderAddServiceAvailabilityZodSchema = z.object({
    availabilities: z.array(
        z.object({
            day: enumField("Availability day", daysArray),
            duration: enumField("Availability duration", validSlotDuration),
            startTime: stringField("Availability startTime",8,8,/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,"Invlid availability startTime"), 
            endTime: stringField("Availability endTime",8,8,/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,"Invalid availability endTime"),
            modes: stringArrayField("Availability modes",1,2,6,7, /^(Online|Offline)$/,"Mode must be either 'Online' or 'Offline'"),
            slots: stringArrayField("Availability slots",1,200,8,8,/^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,"Invalid slot format. Format must be hh:mm AM/PM")
        })
    )
})





// **** Provider Subscription Controller **** \\
// Provider plan subscription duration validation
export const ProviderPlanSubscribeZodSchema = z.object({
    planId: objectIdField("Plan ID"),
    planDuration: enumField("Subscription plan duration",subscriptionMonthArray),
});

