import { Types } from "mongoose";
import { Address } from "../../../domain/entities/address.entity";
import { AddressRepositoryImpl } from "../../../infrastructure/database/address/address.repository.impl";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";

type UserFetchAddressResProps = Pick<Address, "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">;

export class UserFetchAddressUseCase {
    constructor(
        private userRepository: UserRepositoryImpl,
        private addressRepository: AddressRepositoryImpl,
    ) { }

    async execute(userId: string): Promise<{ success: boolean , message: string, address: UserFetchAddressResProps | null }> {
        if(!userId) throw new Error("Invalid request.");
        const user = await this.userRepository.findUserById(new Types.ObjectId(userId));
        if(!user) throw new Error("No user found.");
        const address = await this.addressRepository.findAddressByUserId(new Types.ObjectId(userId));
        if(address === null) return { success: true, message: "User Address not yet addedd.", address: null }
        if(!address) throw new Error("Address fetching error.");
        const { _id, userId: uId, createdAt, updatedAt, ...data } = address;
        return{ success: true, message: "User address fetched.", address: data }
    }
}