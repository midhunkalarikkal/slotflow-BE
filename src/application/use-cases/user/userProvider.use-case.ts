import { Types } from "mongoose";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../infrastructure/database/providerService/providerService.repository.impl";
import { FindProvidersUsingServiceCategoryIdsResProps } from "../../../domain/repositories/IProviderService.repository";

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
        const providers = await this.providerServiceRepository.findProvidersUsingServiceCategoryIds(convertedServiceIds)
        if(!providers) throw new Error("Providers fetching error.");

        return { success: true, message: "Providers fetched successfully.", providers };
    }
}