import { Types } from "mongoose";

export class User {
    constructor(
        public username: string,
        public email: string,
        public password: string,
        public phone: string | null,
        public profileImage: string | null,
        public addressId: Types.ObjectId | null,
        public isBlocked: boolean,
        public isVerified: boolean,
        public _id?: Types.ObjectId | string,
        public verificationToken?: string | null,
    ) {}
}
