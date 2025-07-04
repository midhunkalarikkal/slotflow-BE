import { Types } from "mongoose";
import { Service } from "../entities/service.entity";
import { ProviderService } from "../entities/providerService.entity";

export type CreateProviderServiceReqProps = Pick<ProviderService, "providerId" | "serviceCategory" | "serviceName" | "serviceDescription" | "servicePrice" | "providerAdhaar" | "providerExperience" | "providerCertificateUrl">;

type FindProviderServiceProps = Omit<ProviderService, "serviceCategory">;
export interface FindProviderServiceResponse extends FindProviderServiceProps {
    serviceCategory: Pick<Service, "serviceName">
}

export  interface FindProvidersUsingServiceCategoryIdsResProps {
    _id: Types.ObjectId,
    provider : {
        _id: Types.ObjectId,
        username: string,
        profileImage: string | null,
        trustedBySlotflow: boolean,
    },
    service: {
        serviceCategory: Types.ObjectId,
        serviceName: string,
        servicePrice: number,
        categoryName: string
    }
  }

export interface IProviderServiceRepository {

    createProviderService(providerService: CreateProviderServiceReqProps): Promise<ProviderService | null>;

    findProviderServiceByProviderId(providerId: Types.ObjectId): Promise<FindProviderServiceResponse | {}>;

    findProvidersUsingServiceCategoryIds(serviceCategoryIds: Types.ObjectId[]): Promise<Array<FindProvidersUsingServiceCategoryIdsResProps> | []>
}