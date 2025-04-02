import { Address } from "../../domain/entities/address.entity";

// **** Address creating payload type used in address repository, repositoryImpl
export type CreateAddressReqProps = Pick<Address, "userId" | "addressLine" | "phone" | "place" | "city" | "district" | "pincode" | "state" | "country" | "googleMapLink">;
