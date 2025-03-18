import { Types } from "mongoose";

interface availability {
    day: string,
    duration: string,
    startTime: string,
    endTime: string,
    slots: string[],
    modes: [string],
}

export class ServiceAvailability {
    constructor(
        public providerId: Types.ObjectId | string,
        public availability: [],
        public _id?: Types.ObjectId,
    ){}
}