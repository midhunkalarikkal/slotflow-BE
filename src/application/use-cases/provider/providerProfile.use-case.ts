import { Types } from "mongoose";
import { Provider } from "../../../domain/entities/provider.entity";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

type ProviderProfileDetailsResProps = Pick<Provider, "username" | "email" | "isAdminVerified" | "isBlocked" | "isEmailVerified" | "phone" | "profileImage" | "createdAt">;

export class ProviderFetchProfileDetailsUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl){ }

    async execute(providerId: string): Promise<{success: boolean, message: string, provider: ProviderProfileDetailsResProps}> {
        const provider = await  this.providerRepositoryImpl.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("Provider profile fetching error.");
        const {_id, password , addressId, serviceId, subscription, updatedAt, ...rest} = provider;
        return { success: true, message: "Provider prfile detailed fetched.", provider: rest};
    }
}