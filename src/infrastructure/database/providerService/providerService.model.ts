import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProviderService extends Document {
    _id: Types.ObjectId;
    providerId: Types.ObjectId;
    serviceCategory: Types.ObjectId;
    serviceName: string;
    serviceDescription: string;
    servicePrice: number;
    providerAdhaar: number;
    providerExperience: string;
    providerCertificateUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProviderServiceSchema = new Schema<IProviderService>({
    providerId: {
        type: Schema.Types.ObjectId,
        ref: "Provider",
        required: [true, "Provider ID is required"],
    },
    serviceCategory: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: [true, "Service category is required"],
    },
    serviceName: {
        type: String,
        required: [true, "Service name is required"],
        minlength: [4, "Service name must be at least 4 characters long"],
        maxlength: [50, "Service name must be at most 50 characters long"],
        match: [/^[A-Za-z ]{4,50}$/, "Invalid service name. Service name should contain only alphabets and spaces and be between 4 and 50 characters."]
    },
    serviceDescription: {
        type: String,
        required: [true, "Service description is required"],
        minlength: [10, "Service description must be at least 10 characters long"],
        maxlength: [500, "Service description must be at most 500 characters long"],
        match: [/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{10,500}$/, "Invalid service description. Service description should contain alphanumeric characters, spaces, and special characters, and be between 10 and 500 characters."]
    },
    servicePrice: {
        type: Number,
        required: [true, "Aadhaar number is required"],
        min: [100000, "Invalid Aadhaar number. Must be exactly 6 digits."],
        max: [999999, "Invalid Aadhaar number. Must be exactly 6 digits."],
    },
    providerAdhaar: {
        type: Number,
        required: [true, "Aadhaar number is required"],
        min: [100000, "Invalid Aadhaar number. Must be exactly 6 digits."],
        max: [999999, "Invalid Aadhaar number. Must be exactly 6 digits."],
        match: [/^\d{6}$/, "Invalid adhaar number. Please enter exactly 6 digits."]
    },
    providerExperience: {
        type: String,
        required: [true, "Experience is required"],
        maxlength: [100, "Experience must not exceed 100 characters"],
        match: [/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{1,100}$/, "Invalid experience"]
    },
    providerCertificateUrl: {
        type: String,
        required: [true, "Certificate URL is required"],
        validate: {
            validator: (v: string) => {
                try {
                    new URL(v);
                    return true;
                } catch {
                    return false;
                }
            },
            message: "Invalid certificate URL format",
        }
    }
}, {
    timestamps: true
});

export const ProviderServiceModel = mongoose.model<IProviderService>('ProviderService', ProviderServiceSchema);