import { AddressModel, IAddress } from "./address.model";
import { Address } from "../../../domain/entities/address.entity";
import { IAddressRepository } from "../../../domain/repositories/IAddress.repository";
import { Types } from "mongoose";

export class AddressRepositoryImpl implements IAddressRepository {
    private mapToEntity(address: IAddress): Address {
            return new Address(
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
                address._id,
            )
        }

    async createAddress(address: Address): Promise<Address | null> {
        try{
            const newAddress = await AddressModel.create(address);
            return newAddress ? this.mapToEntity(newAddress) : null;
        }catch(error){
            throw new Error("Address adding error.");
        }
    }

    async findByUserId(userId: Types.ObjectId, fetchingData: string): Promise<Partial<Address> | null> {
        try{
            if(!userId) throw new Error("Invalid request");
            const address = await AddressModel.findOne({ userId: userId }).select(fetchingData);
            return address ? this.mapToEntity(address) : null;
        }catch(error){
            throw new Error("Address fetching error.");
        }
    }
}