import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProviderService extends Document {
    _id: Types.ObjectId;
    providerId: Types.ObjectId;
    serviceCategory: Types.ObjectId;
    serviceName: string;
    serviceDescription: string;
    servicePrice: number;
    providerAdhaar: string;
    providerExperience: string;
    providerCertificateUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProviderServiceSchema = new Schema<IProviderService>({
    providerId: {
        type:  Schema.Types.ObjectId,
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
    },
    serviceDescription: {
        type: String,
        required: true,
    },
    servicePrice: {
        type: Number,
        required: true,
    },
    providerAdhaar: {
        type: String,
        required: true,
    },
    providerExperience: {
        type: String,
        required: true,
    },
    providerCertificateUrl: {
        type: String,
        required: true,
    }
},{
    timestamps: true
});

export const ProviderServiceModel = mongoose.model<IProviderService>('ProviderService', ProviderServiceSchema);