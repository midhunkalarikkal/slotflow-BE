import { Types } from "mongoose";
import { Address } from "../entities/address.entity";

export type CreateAddressReqProps = Pick<Address, "userId" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">;

export interface IAddressRepository {
    
    createAddress(address: CreateAddressReqProps): Promise<Address>;

    findAddressByUserId(userId: Types.ObjectId): Promise<Address | null>;
}