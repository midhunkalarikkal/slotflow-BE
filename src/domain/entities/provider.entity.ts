import { Types } from "mongoose";

export class Provider {
    constructor(
        public username : string,
        public email : string,
        public password : string,
        public phone : string | null,
        public profileImage: string | null,
        public addressId: Types.ObjectId | null,
        public serviceId: Types.ObjectId | null,
        public subscription: [Types.ObjectId] | null,
        public isBlocked: boolean,
        public isEmailVerified: boolean,
        public isAdminVerified: boolean,
        public _id?: Types.ObjectId | string,
        public verificationToken?: string,
    ){}
}