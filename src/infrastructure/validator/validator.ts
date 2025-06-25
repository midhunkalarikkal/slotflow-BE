import dayjs from "dayjs";
import { Types } from 'mongoose';
import validator from 'validator';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { validateEmail, validateOtp, validatePassword, validatePhone, validateUsername } from '@codebymk/validator';
import { daysArray, subscriptionMonthArray, validSlotDuration } from "../helpers/constants";

dayjs.extend(customParseFormat);

export class Validator {

    // app service name, that is the admin is adding different categories to the system for the providers can choose
    // service category, that is providers choose these app service names as their service categories
    // this can be used for validating both app service name and service category
    static validateAppServiceName(serviceName: string): void {
        if (!serviceName || serviceName.trim().length === 0) throw new Error("Service name is required.");
        if (!/^[A-Za-z0-9 ]{4,50}$/.test(serviceName)) {
            throw new Error("Invalid service Name, only letters allowed.");
        }

        if (serviceName.length > 50 || serviceName.length < 4) {
            throw new Error("Allowed length is 4 to 40 characters.")
        }
    }
    


    // Address Validation
    // Address Line
    static validateAddressLine(addressLine: string): void {
        if (!/^[a-zA-Z0-9 .,#-]{10,150}$/.test(addressLine)) throw new Error("Address line must be 10–150 characters long and can only include letters, numbers, spaces, and the symbols . , # -");
        if (addressLine.length < 10) throw new Error("Address line length should be more than 10.");
        if (addressLine.length > 150) throw new Error("Address line length should be less than 150");
    }

    // Place
    static validatePlace(place: string): void {
        if (!place || place.trim().length < 3) throw new Error("Place is required and should have at least 3 characters.");
        if (place.trim().length > 50) throw new Error("Place should have less than 50 characters.");
        if (!/^[a-zA-Z .-]{3,50}$/.test(place)) throw new Error("Place name must be 3–50 characters long and can only include letters, spaces, dots, and hyphens");
    }

    // Phone
    static validatePhone(phone: string): void {
        if (!phone || phone.trim().length < 7) throw new Error("Phone is required and should have at least 7 characters.");
        if (phone.trim().length > 20) throw new Error("Phone should have less than 20 characters.");
        if (!/^\+?[0-9\s\-().]{7,20}$/.test(phone)) throw new Error("Invalid phone number. Only digits, spaces, dashes (-), dots (.), parentheses (), and an optional + at the beginning are allowed. Length must be between 7 to 20 characters.");
    }

    // City
    static validateCity(city: string): void {
        if (!city || city.trim().length < 3) throw new Error("City is required and should have at least 3 characters.");
        if (city.trim().length > 50) throw new Error("City should have less than 50 characters.");
        if (!/^[a-zA-Z ]{3,50}$/.test(city)) throw new Error("City must only contain letters and spaces");
    }

    // District
    static validateDistrict(district: string): void {
        if (!district || district.trim().length < 3) throw new Error("District is required and should have at least 3 characters.");
        if (district.trim().length > 50) throw new Error("District should have less than 50 characters.");
        if (!/^[a-zA-Z ]{3,50}$/.test(district)) throw new Error("District must only contain letters and spaces");
    }

    // Pincode
    static validatePincode(pincode: string): void { 
        if (!pincode || pincode.trim().length < 3) throw new Error("Pincode is required and should have at least 3 characters.");
        if (pincode.trim().length > 12) throw new Error("Pincode should have less than 12 characters.");
        if (!/^[A-Za-z0-9\s-]{3,12}$/.test(pincode)) throw new Error("Invalid postal code");
    }

    // State
    static validateState(state: string): void {
        if (!state || state.trim().length < 2) throw new Error("State is required and should have at least 2 characters.");
        if (state.trim().length > 50) throw new Error("State should have less than 50 characters.");
        if (!/^[a-zA-Z ]{2,50}$/.test(state)) throw new Error("State must only contain letters and spaces");
    }

    // Country
    static validateCountry(country: string): void {
        if (!country || country.trim().length < 2) throw new Error("Country is required and should have at least 2 characters.");
        if (country.trim().length > 50) throw new Error("Country should have less than 50 characters.");
        if (!/^[a-zA-Z ]{2,50}$/.test(country)) throw new Error("Country should only contain alphabets and spaces");
    }

    // Google Map Link
    static validateGoogleMapLink(googleMapLink: string): void {
        if (!validator.isURL(googleMapLink)) throw new Error("Invalid Google Map link.");
        if (!googleMapLink.startsWith("https://maps.app.goo.gl/")) throw new Error("Invalid google map url.");
    }





    // **** Provider service 
    // Service name
    static validateServiceName(serviceName: string): void {
        if (!serviceName || serviceName.trim().length === 0) throw new Error("Service name is required.");
        if (!/^[A-Za-z ]{4,50}$/.test(serviceName.trim())) throw new Error("Invalid service name. Service name should contain only alphabets and spaces and be between 4 and 50 characters.");
    }

    // Service description
    static validateServiceDescription(serviceDescription: string): void {
        if (!serviceDescription || serviceDescription.trim().length === 0) throw new Error("Service description is required.");
        if (!/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{10,500}$/.test(serviceDescription.trim())) throw new Error("Invalid service description. Service description should contain alphanumeric characters, spaces, and special characters, and be between 10 and 500 characters.");
    }

    // Service price
    static validateServicePrice(servicePrice: number): void {
        if (!servicePrice) {
            throw new Error("Service price is required.");
        }

        if (typeof servicePrice !== "number") {
            throw new Error("Invalid service price Must be a number.");
        }
        if (servicePrice < 1 || servicePrice > 1000000) throw new Error("Invalid service price. Service price must be between 1 and 1000000.");
    }

    // Provider adhaar number
    static validateProviderAdhaar(providerAdhaar: string): void {
        if (!providerAdhaar) {
            throw new Error("Adhaar number is required.");
        }

        if (typeof providerAdhaar !== "string") {
            throw new Error("Invalid adhaar number. Must be a string.");
        }

        if (!/^\d{6}$/.test(providerAdhaar)) {
            throw new Error("Invalid adhaar number. Please enter exactly 6 digits.");
        }
    }

    // Provider experience
    static validateProviderExperience(providerExperience: string): void {
        if (!providerExperience || providerExperience.trim().length === 0) throw new Error("Provider experience is required.");
        if (!/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{1,500}$/.test(providerExperience.trim())) throw new Error("Invalid experience. Provider experience should contain alphanumeric characters, spaces, and special characters, and be between 1 and 500 characters.");
    }

    // provider service mode, that is the user can pick a service mode while booking an appointment
    static validateServiceMode(value: string): void {
        const serviceModes = ["online", "offline"];
        if (!serviceModes.includes(value)) {
            throw new Error("Invalid service mode.");
        }
    }





    // Service availability
    static validateDay(day: string): void {
        if (!day || day.trim().length === 0) throw new Error("Day is required.");
        if (!daysArray.includes(day)) throw new Error("Invalid day. Day must be one of: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.");
    }

    static validateDuration(duration: string): void {
        if (!duration || duration.trim().length === 0) throw new Error("Duration is required.");
        if (!validSlotDuration.includes(duration.trim().toLowerCase())) throw new Error("Invalid duration. Duration must be one of: 15 minutes, 30 minutes, 1 hour.");
    }

    static validateTiming(endTime: string, startTime: string): void {
        const format = "hh:mm A";

        const start = dayjs(startTime, format);
        const end = dayjs(endTime, format);

        if (!start.isValid() || !end.isValid()) {
            throw new Error("Invalid time format.");
        }

        if (!start.isBefore(end)) {
            throw new Error("Start time is greater than endTime.")
        }

    }

    static validateModes(modes: string[]): void {
        const validModes = ["online", "offline"];

        if (!modes) {
            throw new Error("Modes is required.");
        }

        if (Array.isArray(modes)) {
            if (modes.length === 0) {
                throw new Error("Modes array cannot be empty.");
            }
            for (const mode of modes) {
                if (typeof mode !== "string" || !validModes.includes(mode.trim().toLowerCase())) {
                    throw new Error("Invalid mode. Mode must be 'online' or 'offline'.");
                }
            }
        }
    }


    // **** Plan validator
    // Plan Name – only uppercase/lowercase letters, 4 to 20 characters
    static validatePlanName(planName: string): void {
        if (!planName || planName.trim().length === 0)
            throw new Error("Plan name is required.");
        if (!/^[a-zA-Z ]{4,20}$/.test(planName.trim()))
            throw new Error("Invalid plan name. Only alphabets and spaces are allowed, length between 4 and 20.");
    }

    // Description – allow alphabets, numbers, spaces, punctuation; 10 to 200 chars
    static validatePlanDescription(description: string): void {
        if (!description || description.trim().length === 0)
            throw new Error("Description is required.");
        if (description.length < 10 || description.length > 200)
            throw new Error("Description must be between 10 and 200 characters.");
        if (!/^[\w\d\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{10,200}$/.test(description.trim()))
            throw new Error("Invalid description. Contains unsupported characters.");
    }

    // Price – number between 0 and 100000
    static validatePlanPrice(price: number): void {
        if (typeof price !== "number" || isNaN(price))
            throw new Error("Price must be a number.");
        if (price < 0 || price > 100000)
            throw new Error("Price must be between 0 and 100000.");
    }

    // Features – non-empty array of strings
    static validatePlanFeatures(features: string[]): void {
        if (!Array.isArray(features) || features.length === 0)
            throw new Error("At least one feature is required.");
        for (const feature of features) {
            if (typeof feature !== "string" || feature.trim().length === 0)
                throw new Error("Each feature must be a non-empty string.");
            if(!/^[\w\d\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{5,100}$/.test(feature.trim()))
                throw new Error("Invalid feature.");
        }
    }

    // Max Booking Per Month – number between 0 and 10000
    static validatePlanMaxBookingPerMonth(maxBookingPerMonth: number): void {
        if (typeof maxBookingPerMonth !== "number" || isNaN(maxBookingPerMonth))
            throw new Error("Max booking per month must be a number.");
        if (maxBookingPerMonth < 0 || maxBookingPerMonth > 10000)
            throw new Error("Max booking per month must be between 0 and 10000.");
    }

    // Plan duration
    static validatePlanDuration(value: string): void {
        if (!subscriptionMonthArray.includes(value)) {
            throw new Error("Invalid duration.");
        }
    }






    // **** Common validations
    static validateBooleanValue(value: boolean, label: string): void {
        if (typeof value !== "boolean")
            throw new Error(`${label} must be a boolean.`);
    }

    static validateObjectId(id: Types.ObjectId, label = "ID"): void {
        if (
            !Types.ObjectId.isValid(id) ||
            new Types.ObjectId(id).toString() !== id.toString()
        ) {
            throw new Error(`Invalid ${label}. Must be a valid ObjectId.`);
        }
    }

    static validateDate(value: Date): void {
        if (!(value instanceof Date) || isNaN(value.getTime())) {
            throw new Error("Invalid date");
        }
    }

    static validateRole(value: string): void {
        const roles = ["ADMIN", "USER", "PROVIDER"];
        if (!roles.includes(value)) {
            throw new Error("Invalid role. Must be one of: Admin, User, Provider.");
        }
    }

    static validateFile(file: Express.Multer.File): void {
        if (!file) {
            throw new Error("File is required.");
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        const maxSizeInBytes = 5 * 1024 * 1024;

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error(`Invalid file type. Allowed types are: ${allowedMimeTypes.join(", ")}`);
        }

        if (file.size > maxSizeInBytes) {
            throw new Error(`File size exceeds the maximum limit of ${maxSizeInBytes / (1024 * 1024)} MB.`);
        }
    }

    static validateStripeSessionId(value: string): void {
        if (typeof value !== "string" || !value.trim()) {
            throw new Error("Payment Intent ID must be a non-empty string.");
        }
        // Stripe Payment Intent ID pattern
        const pattern = /^cs_test_[a-zA-Z0-9]+$/;
        if (!pattern.test(value)) {
            throw new Error("Invalid Stripe Payment Intent ID format.");
        }
    }

}




type ValidationResult =
    | null
    | { status: boolean, message?: string, point?: number };

export class CustomValidator {
    static validator(id: string, value: string | number): ValidationResult {
        switch (id) {
            case "username": {
                const { status, message } = validateUsername(
                    value as string,
                    {
                        minLength: 4,
                        maxLength: 30,
                        uppercase: true,
                        digits: false,
                        specialCharacters: false,
                        allowSpace: true,
                    }
                );
                return status ? null : { status, message };
            }

            case "email": {
                const { status, message } = validateEmail(value as string);
                return status ? null : { status, message };
            }

            case "password":
            case "confirmPassword": {
                const { status, message, point } = validatePassword(value as string, {
                    returnPoint: true,
                    minLength: 8,
                    maxLength: 50,
                    minDigits: 1,
                    minLowercase: 1,
                    minSpecialCharacter: 1,
                    minUppercase: 1,
                    pointsForLowercase: 25,
                    pointsForUppercase: 25,
                    pointsForDigits: 25,
                    pointsForSpecialCharacter: 25,
                });
                return status ? { status, point } : { status, message, point };
            }

            case "otp": {
                const { status, message } = validateOtp(value as string, {
                    length: 6
                });
                return status ? null : { status, message };
            }

            case "role": {
                const roles = ["ADMIN", "USER", "PROVIDER"];
                if (!roles.includes(value as string)) {
                    return { status: false, message: "Invalid role." };
                }
                return null;
            }

            default:
                return { status: false, message: "No validation found" };
        }
    }
}

export const validateOrThrow = (id: string, value: string | number) => {
  const result = CustomValidator.validator(id, value);
  if (result && result.status === false) {
    throw new Error(result.message);
  }
};