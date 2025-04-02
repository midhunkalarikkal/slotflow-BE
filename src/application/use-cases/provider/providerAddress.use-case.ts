import { Types } from "mongoose";
import { Address } from "../../../domain/entities/address.entity";
import { Validator } from "../../../infrastructure/validator/validator";
import { CommonResponse } from "../../../shared/interface/commonInterface";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";


interface ProviderFetchAddressResProps extends CommonResponse {
    address: Pick<Address, "_id" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink"> | {};
}


export class ProviderAddAddressUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl, 
        private addressRepository: AddressRepositoryImpl,
    ){}

    async execute(providerId: string, addressLine: string, phone: string, place: string, city: string, district: string, pincode: string, state: string,  country: string, googleMapLink: string): Promise<CommonResponse> {
        
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

        const address = await this.addressRepository.createAddress({userId: new Types.ObjectId(providerId), addressLine, phone, place, city, district, pincode, state, country, googleMapLink});
        if(!address) throw new Error("Address adding error.");

        if (provider && address && address._id) {
            provider.addressId = address._id;
            const updatedProvider = await this.providerRepository.updateProvider(provider);
            if (!updatedProvider) throw new Error("Failed to update provider with address.");
        }

        return {success: true, message: "Address added successfully" };
    }
}


export class ProviderFetchAddressUseCase {
    constructor(private addressRepository: AddressRepositoryImpl) { }

    async execute(providerId: string): Promise<ProviderFetchAddressResProps> {
        if (!providerId) throw new Error("Invalid request.");
        const address = await this.addressRepository.findAddressByUserId(new Types.ObjectId(providerId));
        if(address === null) return { success: true, message: "Provider address not yet addedd.", address: {} };
        if (!address) throw new Error("Provider address fetching error.");
        const { userId, createdAt, updatedAt, ...data } = address;
        return { success: true, message: "Provider address fetched.", address: data };
    }
}