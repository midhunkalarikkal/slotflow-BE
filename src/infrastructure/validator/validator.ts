import { Types } from 'mongoose';
import validator from 'validator';

export class Validator {

    // Sign in Sign up
    // Username
    static validateUsername(username: string): void {
        if (!username || username.trim().length === 0) throw new Error("Username is required.");
        if (!/^[A-Za-z ]{4,25}$/.test(username)) throw new Error("Invalid username. Username should contain only alphabets and spaces and be between 4 and 25 characters.");
    }

    // email
    static validateEmail(email: string): void {
        if (!email || email.trim().length === 0) throw new Error("Email is required.");
        if (!validator.isEmail(email)) throw new Error("Invalid email format.");
    }

    // password
    static validatePassword(password: string): void {
        if (!password || password.trim().length === 0) throw new Error("Password is required.");
        if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols.");
    }

    // otp
    static validateOtp(otp: string): void {
        if (!otp || otp.trim().length === 0) throw new Error("OTP is required.");
        if (!validator.isNumeric(otp, { no_symbols: true }) || otp.length !== 6) throw new Error("Invalid OTP. OTP must be a 6-digit number.");
    }





    // Address Validation
    // Address Line
    static validateAddressLine(addressLine: string): void {
        if (!/^[a-zA-Z0-9\s.,#-]+$/.test(addressLine)) throw new Error("Invalid address line, should only contain alphabets, numbers, spaces, and common address characters.");
        if (addressLine.length < 6) throw new Error("Address line length should be more than 6.");
        if (addressLine.length > 150) throw new Error("Address line length should be less than 150");
    }

    // Phone
    static validatePhone(phone: string): void {
        if (!validator.isMobilePhone(phone, ["en-IN"])) throw new Error("Invalid mobile number.");
    }

    // Place
    static validatePlace(place: string): void {
        if (!place || place.trim().length < 2) throw new Error("Place is required and should have at least 2 characters.");
        if (place.trim().length > 50) throw new Error("Place should have less than 50 characters.");
        if (!/^[a-zA-Z\s]+$/.test(place)) throw new Error("Place should only contain alphabets and spaces");
    }

    // City
    static validateCity(city: string): void {
        if (!city || city.trim().length < 2) throw new Error("City is required and should have at least 2 characters.");
        if (city.trim().length > 50) throw new Error("City should have less than 50 characters.");
        if (!/^[a-zA-Z\s]+$/.test(city)) throw new Error("City should only contain alphabets and spaces");
    }

    // District
    static validateDistrict(district: string): void {
        if (!district || district.trim().length < 2) throw new Error("District is required and should have at least 2 characters.");
        if (district.trim().length > 50) throw new Error("District should have less than 50 characters.");
        if (!/^[a-zA-Z\s]+$/.test(district)) throw new Error("District should only contain alphabets and spaces");
    }

    // Pincode
    static validatePincode(pincode: string): void {
        if (!validator.isPostalCode(pincode, "IN")) throw new Error("Invalid pincode.");
    }

    // State
    static validateState(state: string): void {
        if (!state || state.trim().length < 2) throw new Error("State is required and should have at least 2 characters.");
        if (state.trim().length > 50) throw new Error("State should have less than 50 characters.");
        if (!/^[a-zA-Z\s]+$/.test(state)) throw new Error("State should only contain alphabets and spaces");
    }

    // Country
    static validateCountry(country: string): void {
        if (!country || country.trim().length < 2) throw new Error("Country is required and should have at least 2 characters.");
        if (country.trim().length > 50) throw new Error("Country should have less than 50 characters.");
        if (!/^[a-zA-Z\s]+$/.test(country)) throw new Error("Country should only contain alphabets and spaces");
    }

    // Google Map Link
    static validateGoogleMapLink(googleMapLink: string): void {
        if (!validator.isURL(googleMapLink)) throw new Error("Invalid Google Map link.");
        if (!googleMapLink.startsWith("https://maps.app.goo.gl/")) throw new Error("Invalid google map url.");
    }





    // Provider service 
    // Service name
    static validateServiceName(serviceName: string): void {
        if (!serviceName || serviceName.trim().length === 0) throw new Error("Service name is required.");
        if (!/^[A-Za-z ]{4,25}$/.test(serviceName.trim())) throw new Error("Invalid service name. Service name should contain only alphabets and spaces and be between 4 and 25 characters.");
    }

    // Service description
    static validateServiceDescription(serviceDescription: string): void {
        if (!serviceDescription || serviceDescription.trim().length === 0) throw new Error("Service description is required.");
        if (!/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{4,250}$/.test(serviceDescription.trim())) throw new Error("Invalid service description. Service description should contain alphanumeric characters, spaces, and special characters, and be between 4 and 250 characters.");
    }

    // Service price
    static validateServicePrice(servicePrice: number): void {
        if (servicePrice < 1 || servicePrice > 10000000) throw new Error("Invalid service price. Service price must be between 1 and 10000000.");
    }

    // Provider adhaar number
    static validateProviderAdhaar(providerAdhaar: string): void {
        if (!providerAdhaar || providerAdhaar.trim().length === 0) throw new Error("Adhaar number is required.");
        if (!validator.isNumeric(providerAdhaar.trim())) throw new Error("Invalid adhaar number. Adhaar number should contain only numbers.");
        if (providerAdhaar.trim().length !== 6) throw new Error("Invalid adhaar number. Please enter the last 6 digits.");
    }

    // Provider experience
    static validateProviderExperience(providerExperience: string): void {
        if (!providerExperience || providerExperience.trim().length === 0) throw new Error("Provider experience is required.");
        if (!/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{1,100}$/.test(providerExperience.trim())) throw new Error("Invalid experience. Provider experience should contain alphanumeric characters, spaces, and special characters, and be between 1 and 100 characters.");
    }

    static validateServiceMode(value: string): void {
        const serviceModes = ["online", "offline"];
        if (!serviceModes.includes(value)) {
            throw new Error("Invalid service mode.");
        }
    }





    // Service availability
    static validateDay(day: string): void {
        const validDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (!day || day.trim().length === 0) throw new Error("Day is required.");
        if (!validDays.includes(day)) throw new Error("Invalid day. Day must be one of: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.");
    }

    static validateDuration(duration: string): void {
        const validDurations = ["15 minutes", "30 minutes", "1 hour"];
        if (!duration || duration.trim().length === 0) throw new Error("Duration is required.");
        if (!validDurations.includes(duration.trim().toLowerCase())) throw new Error("Invalid duration. Duration must be one of: 15 minutes, 30 minutes, 1 hour.");
    }

    static validateTime(time: string, fieldName: string): void {
        if (!time || time.trim().length === 0) {
            throw new Error(`${fieldName} is required.`);
        }

        const timePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

        if (!timePattern.test(time.trim())) {
            throw new Error(
                `Invalid ${fieldName}. ${fieldName} must be in HH:MM AM/PM format (12-hour).`
            );
        }
    }

    static validateStartTime(startTime: string): void {
        this.validateTime(startTime, "Start time");
    }

    static validateEndTime(endTime: string, startTime: string): void {
        this.validateTime(endTime, "End time");

        if (startTime && endTime) {
            if (endTime <= startTime) {
                throw new Error("End time must be after start time.");
            }
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
        if (!/^[a-zA-Z]{4,20}$/.test(planName.trim()))
            throw new Error("Invalid plan name. Only alphabets are allowed, length between 4 and 20.");
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
        const durations = ["1 Month", "2 Month", "3 Month", "6 Month", "12 Months"];
        if (!durations.includes(value)) {
            throw new Error("Invalid duration.");
        }
    }



    // **** admin app service
    static validateAppServiceName(serviceName: string): void {
        if (!serviceName || serviceName.trim().length === 0) throw new Error("Service name is required.");
        if (!/^[A-Za-z ]{4,25}$/.test(serviceName.trim())) throw new Error("Invalid service name. Service name should contain only alphabets and spaces and be between 4 and 25 characters.");
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
        const pattern = /^pi_[a-zA-Z0-9]+$/;
        if (!pattern.test(value)) {
            throw new Error("Invalid Stripe Payment Intent ID format.");
        }
    }

}