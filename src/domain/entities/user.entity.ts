import { Types } from "mongoose";

export class User {
    constructor(
        public _id: Types.ObjectId,
        public username: string,
        public email: string,
        public password: string,
        public isBlocked: boolean,
        public isEmailVerified: boolean,
        public phone: string,
        public profileImage: string,
        public addressId: Types.ObjectId,
        public bookingsId: Types.ObjectId,
        public verificationToken: string,
        public createdAt: Date,
        public updatedAt: Date,
    ) {

    }
    
}
