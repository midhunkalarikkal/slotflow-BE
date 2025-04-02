import { Types } from "mongoose";
import { Address } from "../entities/address.entity";
import { CreateAddressReqProps } from "../../shared/interface/addressInterface";

export interface IAddressRepository {
    
    createAddress(address: CreateAddressReqProps): Promise<Address>;

    findAddressByUserId(userId: Types.ObjectId): Promise<Address | null>;
}