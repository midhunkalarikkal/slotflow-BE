import { Types } from "mongoose";

export interface TimeSlot {
    slot: string,
    available: boolean,
}

export interface availability {
    day: string,
    duration: string,
    startTime: string,
    endTime: string,
    modes: [string],
    slots: TimeSlot[],
}

export class ServiceAvailability {
    constructor(
        public providerId: Types.ObjectId,
        public availability: availability[],
        public _id?: Types.ObjectId,
    ){}
}