import { Types } from "mongoose";
import { ProviderService } from "../entities/providerService.entity";

export type CreateProviderServiceReqProps = Pick<ProviderService, "providerId" | "serviceCategory" | "serviceName" | "serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience" | "providerCertificateUrl">;

export interface IProviderServiceRepository {

    createProviderService(providerService: CreateProviderServiceReqProps): Promise<ProviderService | null>;

    findProviderServiceByProviderId(providerId: Types.ObjectId): Promise<ProviderService | null>;
}