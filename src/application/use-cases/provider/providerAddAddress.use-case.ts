import { Types } from "mongoose";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { Validator } from "../../../infrastructure/validator/validator";

export class ProviderAddAddressUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl, 
        private addressRepository: AddressRepositoryImpl,
    ){}

    async execute(providerId: string, addressLine: string, phone: string, place: string, city: string, district: string, pincode: string, state: string,  country: string, googleMapLink: string): Promise<{success: boolean, message: string }> {
        
        if(!providerId || !addressLine || !phone || !place || !city || !district || !pincode || !state || !country || !googleMapLink) throw new Error("Invalid request.");
        Validator.validateAddressLine(addressLine);
        Validator.validatePhone(phone);
        Validator.validatePlace(place);
        Validator.validateCity(city);
        Validator.validateDistrict(district);
        Validator.validatePincode(pincode);
        Validator.validateState(state);
        Validator.validateCountry(country);
        Validator.validateGoogleMapLink(googleMapLink);

        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("Please logout and try again.");

        const address = await this.addressRepository.createAddress({userId: providerId, addressLine, phone, place, city, district, pincode, state, country, googleMapLink});
        if(!address) throw new Error("Address adding error.");

        if (provider && address && address._id) {
            provider.addressId = address._id;
            const updatedProvider = await this.providerRepository.updateProvider(provider);
            if (!updatedProvider) throw new Error("Failed to update provider with address ID.");
        }

        return {success: true, message: "Address added successfully" };
    }
}