import { Types } from "mongoose";
import { Provider } from "../../../domain/entities/provider.entity";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";
import { Address } from "../../../domain/entities/address.entity";

type ProviderFetchProfileDetailsResProps = Pick<Provider, "username" | "email" | "isAdminVerified" | "isBlocked" | "isEmailVerified" | "phone" | "profileImage" | "createdAt">;
type ProviderFetchAddressResProps = Pick<Address,  "_id" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">;

export class ProviderFetchProfileDetailsUseCase {
    constructor(private providerRepositoryImpl: ProviderRepositoryImpl){ }

    async execute(providerId: string): Promise<{success: boolean, message: string, provider: ProviderFetchProfileDetailsResProps}> {
        if(!providerId) throw new Error("Invalid request.");
        const provider = await  this.providerRepositoryImpl.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("Provider profile fetching error.");
        const {_id, password , addressId, serviceId, subscription, updatedAt, ...rest} = provider;
        return { success: true, message: "Provider prfile detailed fetched.", provider: rest};
    }
}


export class ProviderFetchAddressUseCase {
    constructor(private addressRepository: AddressRepositoryImpl) { }
    
    async execute(providerId: string): Promise<{ success: boolean, message: string, address: ProviderFetchAddressResProps}> {
        if(!providerId) throw new Error("Invalid request.");
        const address = await this.addressRepository.findAddressByUserId(new Types.ObjectId(providerId));
        if(!address) throw new Error("Provider address fetching error.");
        const {userId, createdAt, updatedAt, ...rest} = address;
        return { success: true, message: "Provider address fetched.", address: rest};
    }
}