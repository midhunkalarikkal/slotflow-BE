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
        if(!/^[a-zA-Z\s]+$/.test(place)) throw new Error("Place should only contain alphabets and spaces");
    }

    // City
    static validateCity(city: string): void {
        if (!city || city.trim().length < 2) throw new Error("City is required and should have at least 2 characters.");
        if (city.trim().length > 50) throw new Error("City should have less than 50 characters.");
        if(!/^[a-zA-Z\s]+$/.test(city)) throw new Error("City should only contain alphabets and spaces");
    }

    // District
    static validateDistrict(district: string): void {
        if (!district || district.trim().length < 2) throw new Error("District is required and should have at least 2 characters.");
        if (district.trim().length > 50) throw new Error("District should have less than 50 characters.");
        if(!/^[a-zA-Z\s]+$/.test(district)) throw new Error("District should only contain alphabets and spaces");
    }

    // Pincode
    static validatePincode(pincode: string): void {
        if (!validator.isPostalCode(pincode, "IN")) throw new Error("Invalid pincode.");
    }

    // State
    static validateState(state: string): void {
        if (!state || state.trim().length < 2) throw new Error("State is required and should have at least 2 characters.");
        if (state.trim().length > 50) throw new Error("State should have less than 50 characters.");
        if(!/^[a-zA-Z\s]+$/.test(state)) throw new Error("State should only contain alphabets and spaces");
    }

    // Country
    static validateCountry(country: string): void {
        if (!country || country.trim().length < 2) throw new Error("Country is required and should have at least 2 characters.");
        if (country.trim().length > 50) throw new Error("Country should have less than 50 characters.");
        if(!/^[a-zA-Z\s]+$/.test(country)) throw new Error("Country should only contain alphabets and spaces");
    }

    // Google Map Link
    static validateGoogleMapLink(googleMapLink: string): void {
        if (!validator.isURL(googleMapLink)) throw new Error("Invalid Google Map link.");
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
        if (typeof servicePrice !== 'number' || isNaN(servicePrice)) throw new Error("Service price is required and must be a number.");
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
}