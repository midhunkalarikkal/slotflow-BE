import { Types } from "mongoose";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../infrastructure/database/providerService/providerService.repository.impl";

export class UserFetchServiceProviderUseCase {
    constructor(
        private userRepository: UserRepositoryImpl,
        private providerRepository: ProviderRepositoryImpl,
        private providerServiceRepository: ProviderServiceRepositoryImpl,
    ) { }

    async execute(userId: string, serviceIds: string[]): Promise<{}> {
        if(!userId || !serviceIds) throw new Error("Invalid request.");

        const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
        if(!user) throw new Error("No user found");

        // const providers = await this.providerRepository.

        return {};
    }
}