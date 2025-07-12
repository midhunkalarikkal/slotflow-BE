import { Types } from "mongoose";
import { AddressModel, IAddress } from "./address.model";
import { Address } from "../../../domain/entities/address.entity";
import { IAddressRepository } from "../../../domain/repositories/IAddress.repository";
import { AddAddressRequest } from "../../dtos/common.dto";

export class AddressRepositoryImpl implements IAddressRepository {
    private mapToEntity(address: IAddress): Address {
            return new Address(
                address._id,
                address.userId,
                address.addressLine,
                address.phone,
                address.place,
                address.city,
                address.district,
                address.pincode,
                address.state,
                address.country,
                address.googleMapLink,
                address.createdAt,
                address.updatedAt,
            )
        }

    async createAddress(address: AddAddressRequest): Promise<Address> {
        try{
            const newAddress = await AddressModel.create(address);
            return this.mapToEntity(newAddress);
        }catch(error){
            throw new Error("Address adding error.");
        }
    }

    async findAddressByUserId(userId: Types.ObjectId): Promise<Address | null> {
        try{
            const address = await AddressModel.findOne({ userId: userId });
            return address ? this.mapToEntity(address) : null;
        }catch(error){
            throw new Error("Address fetching error.");
        }
    }
}