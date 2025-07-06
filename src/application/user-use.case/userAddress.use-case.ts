import { Types } from "mongoose";
import { Validator } from "../../infrastructure/validator/validator";
import { AddAddressRequest, ApiResponse, CommonResponse } from "../../infrastructure/dtos/common.dto";
import { UserRepositoryImpl } from "../../infrastructure/database/user/user.repository.impl";
import { AddressRepositoryImpl } from "../../infrastructure/database/address/address.repository.impl";
import { 
    UserFetchAddressResponse, 
    UserFetchUserAddressRequest, 
} from "../../infrastructure/dtos/user.dto";


export class UserFetchAddressUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private addressRepositoryImpl: AddressRepositoryImpl,
    ) { }

    async execute({userId}: UserFetchUserAddressRequest): Promise<ApiResponse<UserFetchAddressResponse>> {
        if (!userId) throw new Error("Invalid request.");

        Validator.validateObjectId(userId, "userId");

        const user = await this.userRepositoryImpl.findUserById(userId);
        if (!user) throw new Error("No user found.");
        const address = await this.addressRepositoryImpl.findAddressByUserId(userId);
        if (address === null) return { success: true, message: "User Address not yet addedd.", data: {} }
        if (!address) throw new Error("Address fetching error.");
        const { _id, userId: uId, createdAt, updatedAt, ...rest } = address;
        return { success: true, message: "User address fetched.", data: rest }
    }
}


export class UserAddAddressUseCase {
    constructor(
        private userRepositoryImpl: UserRepositoryImpl,
        private addressRepositoryImpl: AddressRepositoryImpl,
    ) { }

    async execute(data: AddAddressRequest): Promise<ApiResponse> {
        const {userId, addressLine, phone, place, city, district, pincode, state, country, googleMapLink} = data;
        if (!userId || !addressLine || !phone || !place || !city || !district || !pincode || !state || !country || !googleMapLink) throw new Error("Invalid request.");
        
        Validator.validateObjectId(userId, "userId");
        Validator.validateAddressLine(addressLine);
        Validator.validatePhone(phone);
        Validator.validatePlace(place);
        Validator.validateCity(city);
        Validator.validateDistrict(district);
        Validator.validatePincode(pincode);
        Validator.validateState(state);
        Validator.validateCountry(country);
        Validator.validateGoogleMapLink(googleMapLink);

        const user = await this.userRepositoryImpl.findUserById(userId);
        if(!user) throw new Error("Please logout and try again.");

        const address = await this.addressRepositoryImpl.createAddress({userId: new Types.ObjectId(userId), addressLine, phone, place, city, district, pincode, state, country, googleMapLink});
        if(!address) throw new Error("Address adding error.");

        if (user && address && address._id) {
            user.addressId = address._id;
            const updatedUser = await this.userRepositoryImpl.updateUser(user);
            if (!updatedUser) throw new Error("Failed to update user with address.");
        }

        return {success: true, message: "Address added successfully" };
    }
}