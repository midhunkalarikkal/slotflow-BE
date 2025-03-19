import { Types } from 'mongoose';

export class ProviderService {
    constructor(
        public providerId: Types.ObjectId,
        public serviceCategory: string,
        public serviceName: string,
        public serviceDescription: string,
        public servicePrice: number,
        public providerAdhaar: string,
        public providerExperience: string,
        public providerCertificateUrl: string,
        public _id?: Types.ObjectId,
    ){}
}