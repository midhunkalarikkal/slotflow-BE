import { Types } from 'mongoose';

export class ProviderService {
    constructor(
        public _id: Types.ObjectId,
        public providerId: Types.ObjectId,
        public serviceCategory: Types.ObjectId,
        public serviceName: string,
        public serviceDescription: string,
        public servicePrice: number,
        public providerAdhaar: string,
        public providerExperience: string,
        public providerCertificateUrl: string,
        public createdAt: Date,
        public updatedAt: Date,
    ){}
}