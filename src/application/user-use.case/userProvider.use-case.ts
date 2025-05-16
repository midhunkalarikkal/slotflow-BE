import { Types } from "mongoose";
import { generateSignedUrl } from "../../config/aws_s3";
import { extractS3Key } from "../../infrastructure/helpers/helper";
import { Validator } from "../../infrastructure/validator/validator";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { 
  FindProviderServiceResProps, 
  UserFetchProviderServiceUseCaseResponse, 
  UserFetchServiceProvidersUseCaseResponse, 
  FindProvidersUsingServiceCategoryIdsResProps, 
  UserFetchServiceProviderAddressUseCaseResponse, 
  UserFetchServiceProviderDetailsUseCaseResponse, 
  UserFetchServiceProvidersUseCaseRequestPayload, 
  UserFetchProviderServiceAvailabilityUseCaseResponse, 
  UserFetchServiceProviderAddressUseCaseRequestPayload, 
  UserFetchServiceProviderDetailsUseCaseRequestPayload, 
  UserFetchServiceproviderServiceUsecaseRequestPayload, 
  UserFetchProviderServiceAvailabilityUseCaseRequestPayload
} from "../../infrastructure/dtos/user.dto";

export class UserFetchServiceProvidersUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl,
    private providerServiceRepositoryImpl: ProviderServiceRepositoryImpl,
  ) { }

  async execute(data: UserFetchServiceProvidersUseCaseRequestPayload): Promise<UserFetchServiceProvidersUseCaseResponse> {
    const { userId, serviceIds } = data;
    if (!userId || !serviceIds) throw new Error("Invalid request.");

    Validator.validateObjectId(userId, "userId");

    const user = await this.userRepositoryImpl.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const providers = await this.providerServiceRepositoryImpl.findProvidersUsingServiceCategoryIds(serviceIds);
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
    private userRepositoryImpl: UserRepositoryImpl,
    private providerRepositoryImpl: ProviderRepositoryImpl,
  ) { }

  async execute(data: UserFetchServiceProviderDetailsUseCaseRequestPayload): Promise<UserFetchServiceProviderDetailsUseCaseResponse> {
    const { userId, providerId } = data;
    if (!userId || !providerId) throw new Error("Invalid request");

    Validator.validateObjectId(userId, "userId");
    Validator.validateObjectId(providerId, "providerId");

    const user = await this.userRepositoryImpl.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const provider = await this.providerRepositoryImpl.findProviderById(new Types.ObjectId(providerId));
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
    private userRepositoryImpl: UserRepositoryImpl,
    private addressRepositoryImpl: AddressRepositoryImpl,
  ) { }

  async execute(data: UserFetchServiceProviderAddressUseCaseRequestPayload): Promise<UserFetchServiceProviderAddressUseCaseResponse> {
    const { userId, providerId} = data;
    if (!userId || !providerId) throw new Error("Invalid request");
    
    Validator.validateObjectId(userId, "userId");
    Validator.validateObjectId(providerId, "providerId");

    const user = await this.userRepositoryImpl.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const address = await this.addressRepositoryImpl.findAddressByUserId(new Types.ObjectId(providerId));
    if (!address) throw new Error("No address found");

    let { createdAt, updatedAt, _id, ...rest } = address;

    return { success: true, message: "Service provider address fetched", address: rest }
  }
}


export class UserFetchServiceProviderServiceDetailsUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl,
    private providerServiceRepositoryImpl: ProviderServiceRepositoryImpl,
  ) { }

  async execute(data: UserFetchServiceproviderServiceUsecaseRequestPayload): Promise<UserFetchProviderServiceUseCaseResponse> {
    const { userId, providerId } = data;
    if (!userId || !providerId) throw new Error("Invalid request");

    Validator.validateObjectId(userId, "userId");
    Validator.validateObjectId(providerId, "providerId");

    const user = await this.userRepositoryImpl.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const serviceData = await this.providerServiceRepositoryImpl.findProviderServiceByProviderId(new Types.ObjectId(providerId));

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
        private userRepositoryImpl: UserRepositoryImpl,
        private serviceAvailabilityRepositoryImpl: ServiceAvailabilityRepositoryImpl,
    ) { }

    async execute(data: UserFetchProviderServiceAvailabilityUseCaseRequestPayload): Promise<UserFetchProviderServiceAvailabilityUseCaseResponse> {
      const { userId, providerId, date } = data;
        if (!userId || !providerId || !date) throw new Error("Invalid request.");

        Validator.validateObjectId(userId, "userId");
        Validator.validateObjectId(providerId, "providerId");
        Validator.validateDate(date);

        const user = await this.userRepositoryImpl.findUserById(new Types.ObjectId(userId));
        if (!user) throw new Error("No user found");

        const availability = await this.serviceAvailabilityRepositoryImpl.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId), date);
        if (availability == null) return { success: true, message: "Service availability fetched successfully.", availability: {} };

        return { success: true, message: "Service availability fetched successfully.", availability };
    }
}