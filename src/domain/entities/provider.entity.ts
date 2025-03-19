import { Types } from "mongoose";

export class Provider {
    constructor(
        public username : string,
        public email : string,
        public password : string,
        public phone : string | null,
        public profileImage: string | null,
        public addressId: Types.ObjectId | null | string,
        public serviceId: Types.ObjectId | null | string,
        public subscription: [Types.ObjectId | string] | null,
        public isBlocked: boolean,
        public isEmailVerified: boolean,
        public isAdminVerified: boolean,
        public _id?: Types.ObjectId,
        public verificationToken?: string,
        public serviceAvailability?: Types.ObjectId,
    ){}
}