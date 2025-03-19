import { Types } from "mongoose";

export class Provider {
    constructor(
        public _id: Types.ObjectId,
        public username: string,
        public email: string,
        public password: string,
        public isBlocked: boolean,
        public isEmailVerified: boolean,
        public isAdminVerified: boolean,
        public phone: string,
        public profileImage: string,
        public addressId: Types.ObjectId,
        public serviceId: Types.ObjectId,
        public serviceAvailabilityId: Types.ObjectId,
        public subscription: [Types.ObjectId],
        public verificationToken: string,
    ){}
}