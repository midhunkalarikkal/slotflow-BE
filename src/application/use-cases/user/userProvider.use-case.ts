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

interface UserFetchServiceProvidersResProps extends CommonResponse {
    providers: Array<FindProvidersUsingServiceCategoryIdsResProps>
}

interface UserFetchServiceProviderDetailsResProps extends CommonResponse {
  provider: Pick<Provider, "_id" | "username" | "email" | "profileImage" | "trustedBySlotflow" | "phone">
}

interface UserFetchServiceProviderAddressResProps extends CommonResponse {
  address: Pick<Address, "userId" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">
}

export class UserFetchServiceProvidersUseCase {
    constructor(
        private userRepository: UserRepositoryImpl,
        private providerServiceRepository: ProviderServiceRepositoryImpl,
    ) { }

    async execute(userId: string, serviceIds: string[]): Promise<UserFetchServiceProvidersResProps> {
        if(!userId || !serviceIds) throw new Error("Invalid request.");

        const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
        if(!user) throw new Error("No user found");

        const convertedServiceIds = serviceIds.map((id) => new Types.ObjectId(id));
        const providers = await this.providerServiceRepository.findProvidersUsingServiceCategoryIds(convertedServiceIds);
        if(!providers) throw new Error("Providers fetching error.");

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

  async execute(userId: string, providerId: string) : Promise<UserFetchServiceProviderDetailsResProps> {
    if(!userId || !providerId) throw new Error("Invalid request");

    const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
    if(!user) throw new Error("No user found");

    const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
    if(!provider) throw new Error("Nor provider found");

    if(provider.profileImage) {
        const s3Key = await extractS3Key(provider.profileImage);
        const signedUrl = await generateSignedUrl(s3Key);
        provider.profileImage = signedUrl;
    }

    let { _id, username, email, phone, profileImage, trustedBySlotflow } = provider;

    return { success : true, message: "Service provider details fetched", provider : { _id, username, email, phone, profileImage, trustedBySlotflow } }
  }
}

export class UserFetchServiceProviderAddressUseCase {
  constructor(
    private userRepository: UserRepositoryImpl,
    private addressRepository: AddressRepositoryImpl,
  ) { }

  async execute(userId: string, providerId: string) : Promise<UserFetchServiceProviderAddressResProps> {
    if(!userId || !providerId) throw new Error("Invalid request");

    const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
    if(!user) throw new Error("No user found");

    const address = await this.addressRepository.findAddressByUserId(new Types.ObjectId(providerId));
    if(!address) throw new Error("Nor address found");

    let { createdAt, updatedAt , _id, ...data} = address;

    return { success : true, message: "Service provider address fetched", address : data }
  }
}