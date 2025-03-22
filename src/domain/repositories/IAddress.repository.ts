import { Types } from "mongoose";
import { Address } from "../entities/address.entity";

export interface IAddressRepository {
    createAddress(address: Address): Promise<Address | null>;
    findByUserId(userId: Types.ObjectId, fetchingData?: string): Promise<Partial<Address> | null>;
}