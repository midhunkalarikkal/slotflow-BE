import { AddressModel, IAddress } from "./address.model";
import { Address } from "../../../domain/entities/address.entity";
import { IAddressRepository } from "../../../domain/repositories/IAddress.repository";

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
}