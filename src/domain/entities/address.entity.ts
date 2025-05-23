import { Types } from "mongoose";

export class Address {
    constructor(
        public _id: Types.ObjectId,
        public userId: Types.ObjectId,
        public addressLine: string,
        public phone: string,
        public place: string,
        public city: string,
        public district: string,
        public pincode: string,
        public state: string,
        public country: string,
        public googleMapLink: string,
        public createdAt: Date,
        public updatedAt: Date,
    ){}
}