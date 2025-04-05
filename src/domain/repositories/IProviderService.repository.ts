import { Types } from "mongoose";
import { ProviderService } from "../entities/providerService.entity";
import { Service } from "../entities/service.entity";

export type CreateProviderServiceReqProps = Pick<ProviderService, "providerId" | "serviceCategory" | "serviceName" | "serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience" | "providerCertificateUrl">;

type FindProviderServiceProps = Omit<ProviderService, "serviceCategory">;
export interface FindProviderServiceResProps extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">
}

export interface IProviderServiceRepository {

    createProviderService(providerService: CreateProviderServiceReqProps): Promise<ProviderService | null>;

    findProviderServiceByProviderId(providerId: Types.ObjectId): Promise<FindProviderServiceResProps | {}>;

}