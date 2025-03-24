import { Types } from "mongoose";

export class Service {
    constructor(
        public _id: Types.ObjectId,
        public serviceName: string,
        public isBlocked: boolean,
        public createdAt: Date,
        public updatedAt: Date,
    ){}
}