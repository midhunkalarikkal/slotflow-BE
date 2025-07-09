import dayjs from "dayjs";
import { Types } from "mongoose";
import {
  FindProviderServiceResponse,
  UserFetchProviderServiceResponse,
  UserFetchServiceProvidersResponse,
  UserFetchServiceProvidersRequest,
  UserFetchServiceProviderAddressRequest,
  UserFetchServiceProviderDetailsRequest,
  UserFetchServiceproviderServiceRequest,
  UserFetchServiceProviderDetailsResponse,
  UserFetchServiceProviderAddressResponse,
  UserFetchProviderServiceAvailabilityRequest,
  FindProvidersUsingServiceCategoryIdsResponse,
  UserFetchProviderServiceAvailabilityResponse,
} from "../../infrastructure/dtos/user.dto";
import { generateSignedUrl } from "../../config/aws_s3";
import { extractS3Key } from "../../infrastructure/helpers/helper";
import { ApiResponse } from "../../infrastructure/dtos/common.dto";
import { Validator } from "../../infrastructure/validator/validator";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";


export class UserFetchServiceProvidersUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl,
    private providerServiceRepositoryImpl: ProviderServiceRepositoryImpl,
  ) { }

  async execute({ userId, serviceIds }: UserFetchServiceProvidersRequest): Promise<ApiResponse<Array<UserFetchServiceProvidersResponse>>> {
    if (!userId || !serviceIds) throw new Error("Invalid request.");

    Validator.validateObjectId(userId, "userId");

    const user = await this.userRepositoryImpl.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const providers = await this.providerServiceRepositoryImpl.findProvidersUsingServiceCategoryIds(serviceIds);
    if (!providers) throw new Error("Providers fetching error.");

    const updatedproviders: FindProvidersUsingServiceCategoryIdsResponse[] = await Promise.all(
      providers.map(async (provider) => {
        let profileImageUrl = provider?.provider?.profileImage;

        if (profileImageUrl) {
          const s3Key = await extractS3Key(profileImageUrl);
          const signedUrl = await generateSignedUrl(s3Key);
          provider.provider.profileImage = signedUrl;
        }

        return provider;
      })
    )

    return { success: true, message: "Providers fetched successfully.", data: updatedproviders };
  }
}


export class UserFetchServiceProviderProfileDetailsUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl,
    private providerRepositoryImpl: ProviderRepositoryImpl,
  ) { }

  async execute({ userId, providerId }: UserFetchServiceProviderDetailsRequest): Promise<ApiResponse<UserFetchServiceProviderDetailsResponse>> {
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

    return { success: true, message: "Service provider details fetched", data: { _id, username, email, phone, profileImage, trustedBySlotflow } }
  }
}


export class UserFetchServiceProviderAddressUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl,
    private addressRepositoryImpl: AddressRepositoryImpl,
  ) { }

  async execute({ userId, providerId }: UserFetchServiceProviderAddressRequest): Promise<ApiResponse<UserFetchServiceProviderAddressResponse>> {
    if (!userId || !providerId) throw new Error("Invalid request");

    Validator.validateObjectId(userId, "userId");
    Validator.validateObjectId(providerId, "providerId");

    const user = await this.userRepositoryImpl.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const address = await this.addressRepositoryImpl.findAddressByUserId(new Types.ObjectId(providerId));
    if (!address) throw new Error("No address found");

    let { createdAt, updatedAt, _id, ...rest } = address;

    return { success: true, message: "Service provider address fetched", data: rest }
  }
}


export class UserFetchServiceProviderServiceDetailsUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl,
    private providerServiceRepositoryImpl: ProviderServiceRepositoryImpl,
  ) { }

  async execute({ userId, providerId }: UserFetchServiceproviderServiceRequest): Promise<ApiResponse<UserFetchProviderServiceResponse>> {
    if (!userId || !providerId) throw new Error("Invalid request");

    Validator.validateObjectId(userId, "userId");
    Validator.validateObjectId(providerId, "providerId");

    const user = await this.userRepositoryImpl.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const serviceData = await this.providerServiceRepositoryImpl.findProviderServiceByProviderId(new Types.ObjectId(providerId));

    function isServiceData(obj: any): obj is FindProviderServiceResponse {
      return obj && typeof obj === 'object' && '_id' in obj;
    }

    if (!isServiceData(serviceData)) {
      return { success: true, message: "Service fetched successfully.", data: {} };
    }

    const { serviceName, serviceDescription, servicePrice, providerExperience, serviceCategory } = serviceData;

    return { success: true, message: "Service provider address fetched", data: { serviceName, serviceDescription, servicePrice, providerExperience, serviceCategory } }
  }
}


export class UserFetchServiceProviderServiceAvailabilityUseCase {
  constructor(
    private userRepositoryImpl: UserRepositoryImpl,
    private serviceAvailabilityRepositoryImpl: ServiceAvailabilityRepositoryImpl,
  ) { }

  async execute({ userId, providerId, date }: UserFetchProviderServiceAvailabilityRequest): Promise<ApiResponse<UserFetchProviderServiceAvailabilityResponse>> {
    if (!userId || !providerId || !date) throw new Error("Invalid request.");
    const currentDateTime = dayjs();
    const selectedDate = dayjs(date).format('YYYY-MM-DD');

    Validator.validateObjectId(userId, "userId");
    Validator.validateObjectId(providerId, "providerId");
    Validator.validateDate(date);

    const user = await this.userRepositoryImpl.findUserById(new Types.ObjectId(userId));
    if (!user) throw new Error("No user found");

    const availability = await this.serviceAvailabilityRepositoryImpl.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId), date);
    if (availability == null) return { success: true, message: "Service availability fetched successfully.", data: {} };

    const updatedSlots = availability.slots.map((slot) => {
      const slotDateTime = dayjs(`${selectedDate} ${slot.time}`, 'YYYY-MM-DD hh:mm A');
      const isWithin2Hours = slotDateTime.diff(currentDateTime, 'minute') < 120;
      return {
        ...slot,
        available: !isWithin2Hours
      }
    });

    return { success: true, message: "Service availability fetched successfully.", data: { ...availability, slots: updatedSlots } };
  }
}