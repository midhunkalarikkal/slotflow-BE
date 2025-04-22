import { Types } from "mongoose";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../infrastructure/database/providerService/providerService.repository.impl";
import { FindProvidersUsingServiceCategoryIdsResProps } from "../../../domain/repositories/IProviderService.repository";
import { extractS3Key } from "../../../infrastructure/helpers/helper";
import { generateSignedUrl } from "../../../config/aws_s3";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { Provider } from "../../../domain/entities/provider.entity";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";
import { Address } from "../../../domain/entities/address.entity";
import { ProviderService } from "../../../domain/entities/providerService.entity";
import { Service } from "../../../domain/entities/service.entity";
import { ServiceAvailabilityRepositoryImpl } from "../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { ServiceAvailability } from "../../../domain/entities/serviceAvailability.entity";

interface UserFetchServiceProvidersResProps extends CommonResponse {
  providers: Array<FindProvidersUsingServiceCategoryIdsResProps>
}

interface UserFetchServiceProviderDetailsResProps extends CommonResponse {
  provider: Pick<Provider, "_id" | "username" | "email" | "profileImage" | "trustedBySlotflow" | "phone">
}

interface UserFetchServiceProviderAddressResProps extends CommonResponse {
  address: Pick<Address, "userId" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">
}

type FindProviderServiceProps = Omit<ProviderService, "serviceCategory">;
interface FindProviderServiceResProps extends FindProviderServiceProps {
  serviceCategory: Pick<Service, "serviceName">
}
interface UserFetchProviderServiceResProps extends CommonResponse {
  service: FindProviderServiceResProps | {};
}

interface UserFetchProviderServiceAvailabilityResProps extends CommonResponse {
    availability: Pick<ServiceAvailability, "availability"> | {};
}

export class UserFetchServiceProvidersUseCase {
  constructor(
    private userRepository: UserRepositoryImpl,
    private providerServiceRepository: ProviderServiceRepositoryImpl,
  ) { }

  async execute(userId: string, serviceIds: string[]): Promise<UserFetchServiceProvidersResProps> {
    if (!userId || !serviceIds) throw new Error("Invalid request.");

    const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const convertedServiceIds = serviceIds.map((id) => new Types.ObjectId(id));
    const providers = await this.providerServiceRepository.findProvidersUsingServiceCategoryIds(convertedServiceIds);
    if (!providers) throw new Error("Providers fetching error.");

    const updatedproviders: FindProvidersUsingServiceCategoryIdsResProps[] = await Promise.all(
      providers.map(async (provider) => {
        let profileImageUrl = provider.provider.profileImage;

        if (profileImageUrl) {
          const s3Key = await extractS3Key(profileImageUrl);
          const signedUrl = await generateSignedUrl(s3Key);
          provider.provider.profileImage = signedUrl;
        }

        return provider;
      })
    )

    return { success: true, message: "Providers fetched successfully.", providers: updatedproviders };
  }
}

export class UserFetchServiceProviderProfileDetailsUseCase {
  constructor(
    private userRepository: UserRepositoryImpl,
    private providerRepository: ProviderRepositoryImpl,
  ) { }

  async execute(userId: string, providerId: string): Promise<UserFetchServiceProviderDetailsResProps> {
    if (!userId || !providerId) throw new Error("Invalid request");

    const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
    if (!provider) throw new Error("No provider found");

    if (provider.profileImage) {
      const s3Key = await extractS3Key(provider.profileImage);
      const signedUrl = await generateSignedUrl(s3Key);
      provider.profileImage = signedUrl;
    }

    let { _id, username, email, phone, profileImage, trustedBySlotflow } = provider;

    return { success: true, message: "Service provider details fetched", provider: { _id, username, email, phone, profileImage, trustedBySlotflow } }
  }
}

export class UserFetchServiceProviderAddressUseCase {
  constructor(
    private userRepository: UserRepositoryImpl,
    private addressRepository: AddressRepositoryImpl,
  ) { }

  async execute(userId: string, providerId: string): Promise<UserFetchServiceProviderAddressResProps> {
    if (!userId || !providerId) throw new Error("Invalid request");

    const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const address = await this.addressRepository.findAddressByUserId(new Types.ObjectId(providerId));
    if (!address) throw new Error("No address found");

    let { createdAt, updatedAt, _id, ...data } = address;

    return { success: true, message: "Service provider address fetched", address: data }
  }
}

export class UserFetchServiceProviderServiceDetailsUseCase {
  constructor(
    private userRepository: UserRepositoryImpl,
    private providerServiceRepository: ProviderServiceRepositoryImpl,
  ) { }

  async execute(userId: string, providerId: string): Promise<UserFetchProviderServiceResProps> {
    if (!userId || !providerId) throw new Error("Invalid request");

    const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const serviceData = await this.providerServiceRepository.findProviderServiceByProviderId(new Types.ObjectId(providerId));
    console.log("service Data : ",serviceData);

    function isServiceData(obj: any): obj is FindProviderServiceResProps {
      return obj && typeof obj === 'object' && '_id' in obj;
    }

    if (!isServiceData(serviceData)) {
      return { success: true, message: "Service fetched successfully.", service: {} };
    }

    const { serviceName, serviceDescription, servicePrice, providerExperience, serviceCategory } = serviceData;

    return { success: true, message: "Service provider address fetched", service : { serviceName, serviceDescription, servicePrice, providerExperience, serviceCategory } }
  }
}

export class UserFetchServiceProviderServiceAvailabilityUseCase {
    constructor(
        private userRepository: UserRepositoryImpl,
        private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl,
    ) { }

    async execute(userId: string,providerId: string): Promise<UserFetchProviderServiceAvailabilityResProps> {
        if (!userId || !providerId) throw new Error("Invalid request.");

        const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

        const availability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId));
        if (availability == null) return { success: true, message: "Service availability fetched successfully.", availability: {} };

        const { _id, providerId: spId, createdAt, updatedAt, ...rest } = availability;
        return { success: true, message: "Service availability fetched successfully.", availability: rest };
    }
}