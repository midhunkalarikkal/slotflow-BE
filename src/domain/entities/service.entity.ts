import { Types } from "mongoose";

export class Service {
    constructor(
        public serviceName: string,
        public isBlocked: boolean,
        public _id?: Types.ObjectId,
    ){}
}