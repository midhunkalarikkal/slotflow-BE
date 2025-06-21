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
        required: true,
    },
    serviceCategory: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    serviceName: {
        type: String,
        required: true,
        match: [/^[A-Za-z ]{4,25}$/, "Service name should contain only alphabets and spaces (4–25 chars)"]
    },
    serviceDescription: {
        type: String,
        required: true,
        match: [/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{4,250}$/, "Invalid service description"]
    },
    servicePrice: {
        type: Number,
        required: true,
        min: [1, "Price must be at least 1"],
        max: [10000000, "Price must be at most 1 crore"]
    },
    providerAdhaar: {
        type: Number,
        required: true,
        min: [111111, "Invalid adhaar number."],
        max: [999999, "Invalid adhaar number."],
    },
    providerExperience: {
        type: String,
        required: true,
        maxlength: [100, "Experience must be at most 100 characters"],
        match: [/^[\w\d !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{1,100}$/, "Invalid experience"]
    },
    providerCertificateUrl: {
        type: String,
        required: true,
        validate: {
            validator: (v: string) => {
                try {
                    new URL(v);
                    return true;
                } catch {
                    return false;
                }
            },
            message: "Invalid certificate URL"
        }
    }
}, {
    timestamps: true
});

export const ProviderServiceModel = mongoose.model<IProviderService>('ProviderService', ProviderServiceSchema);