import { Types } from "mongoose";
import { Address } from "../entities/address.entity";

export interface IAddressRepository {
    createAddress(address: Address): Promise<Address | null>;
    findAddressByUserId(userId: Types.ObjectId): Promise<Partial<Address> | null>;
}