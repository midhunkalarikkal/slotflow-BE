import { Types } from "mongoose";
import { Address } from "../entities/address.entity";
import { AddAddressRequest } from "../../infrastructure/dtos/common.dto";

export interface IAddressRepository {
    
    createAddress(address: AddAddressRequest): Promise<Address>;

    findAddressByUserId(userId: Types.ObjectId): Promise<Address | null>;
}