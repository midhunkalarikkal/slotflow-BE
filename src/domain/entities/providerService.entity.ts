import { Types } from 'mongoose';

export class ProviderService {
    constructor(
        public providerId: Types.ObjectId | string,
        public serviceCategory: string,
        public serviceName: string,
        public serviceDescription: string,
        public servicePrice: number,
        public providerAdhaar: string,
        public providerExperience: string,
        public providerCertificateUrl: string
    ){}
}