import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

export class ProviderUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl, 
        private addressRepository: AddressRepositoryImpl,
    ){}

    async execute(providerId: string, addressLine: string, phone: string, place: string, city: string, district: string, pincode: string, state: string,  country: string, googleMapLink: string): Promise<{success: boolean, message: string, address: boolean}> {
        if(!providerId) throw new Error("Invalid request.");
        const provider = await this.providerRepository.findProviderById(providerId);
        if(!provider) throw new Error("No user foun.d");
        const result = await this.addressRepository.createAddress({userId: providerId, addressLine, phone, place, city, district, pincode, state, country, googleMapLink});
        return {success: true, message: "Address added successfully", address: result };
    }
}