import { Types } from "mongoose";

export class User {
    constructor(
        public username: string,
        public email: string,
        public password: string,
        public phone: string | null,
        public profileImage: string | null,
        public addressId: Types.ObjectId | null | string,
        public isBlocked: boolean,
        public isEmailVerified: boolean,
        public _id?: Types.ObjectId,
        public verificationToken?: string | null,
    ) {}
}
