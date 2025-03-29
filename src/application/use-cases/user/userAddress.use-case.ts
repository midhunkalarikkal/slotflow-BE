import { Types } from "mongoose";
import { Address } from "../../../domain/entities/address.entity";
import { Validator } from "../../../infrastructure/validator/validator";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";

type UserFetchAddressResProps = Pick<Address, "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">;

export class UserFetchAddressUseCase {
    constructor(
        private userRepository: UserRepositoryImpl,
        private addressRepository: AddressRepositoryImpl,
    ) { }

    async execute(userId: string): Promise<{ success: boolean, message: string, address: UserFetchAddressResProps | null }> {
        if (!userId) throw new Error("Invalid request.");
        const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
        if (!user) throw new Error("No user found.");
        const address = await this.addressRepository.findAddressByUserId(new Types.ObjectId(userId));
        if (address === null) return { success: true, message: "User Address not yet addedd.", address: null }
        if (!address) throw new Error("Address fetching error.");
        const { _id, userId: uId, createdAt, updatedAt, ...data } = address;
        return { success: true, message: "User address fetched.", address: data }
    }
}

export class UserAddAddressUseCase {
    constructor(
        private userRepository: UserRepositoryImpl,
        private addressRepository: AddressRepositoryImpl,
    ) { }

    async execute(userId: string, addressLine: string, phone: string, place: string, city: string, district: string, pincode: string, state: string, country: string, googleMapLink: string): Promise<{ success: boolean, message: string }> {
        if (!userId || !addressLine || !phone || !place || !city || !district || !pincode || !state || !country || !googleMapLink) throw new Error("Invalid request.");
        Validator.validateAddressLine(addressLine);
        Validator.validatePhone(phone);
        Validator.validatePlace(place);
        Validator.validateCity(city);
        Validator.validateDistrict(district);
        Validator.validatePincode(pincode);
        Validator.validateState(state);
        Validator.validateCountry(country);
        Validator.validateGoogleMapLink(googleMapLink);

        const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
        if(!user) throw new Error("Please logout and try again.");

        const address = await this.addressRepository.createAddress({userId: new Types.ObjectId(userId), addressLine, phone, place, city, district, pincode, state, country, googleMapLink});
        if(!address) throw new Error("Address adding error.");

        if (user && address && address._id) {
            user.addressId = address._id;
            const updatedUser = await this.userRepository.updateUser(user);
            if (!updatedUser) throw new Error("Failed to update user with address.");
        }

        return {success: true, message: "Address added successfully" };
    }
}