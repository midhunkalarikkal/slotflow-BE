import { 
    ProviderFetchAddressRequest, 
    ProviderFetchAddressResponse, 
} from "../../infrastructure/dtos/provider.dto";
import { Validator } from "../../infrastructure/validator/validator";
import { AddAddressRequest, ApiResponse } from "../../infrastructure/dtos/common.dto";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";


export class ProviderAddAddressUseCase {
    constructor(
        private providerRepositoryImpl: ProviderRepositoryImpl, 
        private addressRepositoryImpl: AddressRepositoryImpl,
    ){}

    async execute(payload: AddAddressRequest): Promise<ApiResponse> {
        
        const { userId, addressLine, phone, place, city, district, pincode, state, country, googleMapLink } = payload;
        if(!userId || !addressLine || !phone || !place || !city || !district || !pincode || !state || !country || !googleMapLink) throw new Error("Invalid request.");

        Validator.validateObjectId(userId,"providerId");
        Validator.validateAddressLine(addressLine);
        Validator.validatePhone(phone);
        Validator.validatePlace(place);
        Validator.validateCity(city);
        Validator.validateDistrict(district);
        Validator.validatePincode(pincode);
        Validator.validateState(state);
        Validator.validateCountry(country);
        Validator.validateGoogleMapLink(googleMapLink);

        const provider = await this.providerRepositoryImpl.findProviderById(userId);
        if(!provider) throw new Error("Please logout and try again.");

        const address = await this.addressRepositoryImpl.createAddress({userId: userId, addressLine, phone, place, city, district, pincode, state, country, googleMapLink});
        if(!address) throw new Error("Address adding error.");

        if (provider && address && address._id) {
            provider.addressId = address._id;
            const updatedProvider = await this.providerRepositoryImpl.updateProvider(provider);
            if (!updatedProvider) throw new Error("Failed to update provider with address.");
        }

        return {success: true, message: "Address added successfully" };
    }
}


export class ProviderFetchAddressUseCase {
    constructor(private addressRepositoryImpl: AddressRepositoryImpl) { }

    async execute({ providerId }: ProviderFetchAddressRequest): Promise<ApiResponse<ProviderFetchAddressResponse>> {

        Validator.validateObjectId(providerId, "providerId");
        
        if (!providerId) throw new Error("Invalid request.");
        const address = await this.addressRepositoryImpl.findAddressByUserId(providerId);
        if(address === null) return { success: true, message: "Provider address not yet addedd.", data: {} };
        if (!address) throw new Error("Provider address fetching error.");
        const { userId, createdAt, updatedAt, ...rest } = address;
        return { success: true, message: "Provider address fetched.", data: rest };
    }
}