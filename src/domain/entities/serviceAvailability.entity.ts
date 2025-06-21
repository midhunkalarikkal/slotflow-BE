import { Types } from "mongoose";

export interface TimeSlot {
    time: string,
}

export interface TimeSlotForFrontendResponse {
    time: string,
    available: boolean,
    _id: Types.ObjectId,
}

export interface Availability {
    day: string,
    duration: string,
    startTime: string,
    endTime: string,
    modes: string[],
    slots: TimeSlot[],
}

// Frontend availability interface for sending response
export interface FontendAvailabilityForResponse extends Omit<Availability, "slots"> {
    slots : TimeSlotForFrontendResponse[]
}

// Frontend availability interface for adding to db
export interface FrontendAvailabilityForRequest extends Omit<Availability, "slots"> {
    slots : string[]
}

export interface FrontendAvailabilityUpdatedSlots extends Omit<Availability, "slots"> {
    slots : TimeSlot[]
}

export class ServiceAvailability {
    constructor(
        public _id: Types.ObjectId,
        public providerId: Types.ObjectId,
        public availabilities: Availability[],
        public createdAt: Date,
        public updatedAt: Date,
    ){}
}