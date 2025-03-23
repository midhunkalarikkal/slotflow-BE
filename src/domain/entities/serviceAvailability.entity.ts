import { Types } from "mongoose";

export interface TimeSlot {
    slot: string,
    available: boolean,
}

export interface Availability {
    day: string,
    duration: string,
    startTime: string,
    endTime: string,
    modes: string[],
    slots: TimeSlot[],
}

export interface FontendAvailability extends Omit<Availability, "slots"> {
    slots : string[]
}

export class ServiceAvailability {
    constructor(
        public providerId: Types.ObjectId,
        public availability: Availability[],
        public _id: Types.ObjectId,
    ){}
}