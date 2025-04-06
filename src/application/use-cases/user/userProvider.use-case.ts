import { Types } from "mongoose";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../infrastructure/database/providerService/providerService.repository.impl";
import { FindProvidersUsingServiceCategoryIdsResProps } from "../../../domain/repositories/IProviderService.repository";
import { extractS3Key } from "../../../infrastructure/helpers/helper";
import { generateSignedUrl } from "../../../config/aws_s3";

interface UserFetchServiceProvidersResProps extends CommonResponse {
    providers: Array<FindProvidersUsingServiceCategoryIdsResProps>
}

export class UserFetchServiceProviderUseCase {
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