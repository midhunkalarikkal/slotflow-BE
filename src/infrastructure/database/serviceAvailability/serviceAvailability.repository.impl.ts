import { Types } from 'mongoose';
import { IServiceAvailability, ServiceAvailabilityModel } from './serviceAvailability.model';
import { FontendAvailabilityForResponse, FrontendAvailabilityForRequest, ServiceAvailability } from '../../../domain/entities/serviceAvailability.entity';
import { IServiceAvailabilityRepository } from '../../../domain/repositories/IServiceAvailability.repository';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export class ServiceAvailabilityRepositoryImpl implements IServiceAvailabilityRepository {
    private mapToEntity(serviceAvailability: IServiceAvailability): ServiceAvailability {
        return new ServiceAvailability(
            serviceAvailability._id,
            serviceAvailability.providerId,
            serviceAvailability.availabilities,
            serviceAvailability.createdAt,
            serviceAvailability.updatedAt,
        )
    }

    async createServiceAvailabilities(providerId: Types.ObjectId, availabilities: Array<FrontendAvailabilityForRequest>): Promise<ServiceAvailability> {
        try {
            const serviceAvailability = {
                providerId, availabilities
            }
            const newServiceAvailability = await ServiceAvailabilityModel.create(serviceAvailability);
            return this.mapToEntity(newServiceAvailability);
        } catch (error) {
            throw new Error("Service Availability adding failed.");
        }
    }

    async findServiceAvailabilityByProviderId(providerId: Types.ObjectId, date: Date): Promise<FontendAvailabilityForResponse | null> {

        console.log("date : ",date);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const targetDay = daysOfWeek[date.getDay()];
        console.log("targetDay : ",targetDay);

        try {
            const availability = await ServiceAvailabilityModel.aggregate([
                {
                    $match: {
                        providerId: providerId,
                    }
                },
                {
                    $addFields : {
                        availabilityForDay : {
                            $arrayElemAt : [
                                {
                                    $filter : {
                                        input: "$availabilities",
                                        as: "availability",
                                        cond: { $eq : [ "$$availability.day", targetDay ]}
                                    }
                                },
                                0
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: "bookings",
                        let: { providerId: "$providerId", startOfDay: startOfDay, endOfDay: endOfDay }, 
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$serviceProviderId", "$$providerId"] },
                                            { $gte: ["$appointmentDate", "$$startOfDay"] },
                                            { $lte: ["$appointmentDate", "$$endOfDay"] },
                                        ]
                                    }
                                }
                            },
                            {
                                $project: {
                                    appointmentDate: 1,
                                    slotId: 1
                                }
                            }
                        ],
                        as: "providerBookings"
                    }
                },
                {
                    $addFields: {
                        bookedSlots: {
                            $map: {
                                input: "$providerBookings",
                                as: "booking",
                                in: "$$booking.slotId"
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        "availabilityForDay.slots": {
                            $map: {
                                input: "$availabilityForDay.slots",
                                as: "slot",
                                in: {
                                    $mergeObjects: [
                                        "$$slot",
                                        {
                                            available: {
                                                $not: {
                                                    $in: ["$$slot._id", "$bookedSlots"]
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $replaceWith: "$availabilityForDay"
                },
            ]);
            return availability[0] || null;
        } catch (error) {
            throw new Error("Service availability fetching error.");
        }
    }

    async updateServiceAvailability(providerId: Types.ObjectId, day: string, slotId: Types.ObjectId, options: { session?: any }): Promise<ServiceAvailability | null> {
        try {
            const updatedServiceAvailability = await ServiceAvailabilityModel.findOneAndUpdate(
                { providerId, "availability.day": day, "availability.slots._id": new Types.ObjectId(slotId) },
                {
                    $set: {
                        "availability.$[dayElem].slots.$[slotElem].available": false
                    }
                },
                {
                    new: true,
                    arrayFilters: [
                        { "dayElem.day": day },
                        { "slotElem._id": new Types.ObjectId(slotId) }
                    ]
                }
            );

            return updatedServiceAvailability ? this.mapToEntity(updatedServiceAvailability) : null;
        } catch (error) {
            throw new Error("Service availability updating error.");
        }
    }

    async findServiceAvailabilityWithLiveData(providerId: Types.ObjectId, date: Date, day: string): Promise<{} | null> {
        try {
            const availability = await ServiceAvailabilityModel.aggregate([
                {
                    $match: { providerId: providerId }
                }
            ]);

            return availability || null;
        } catch (error) {
            throw new Error("Availability fetching error");
        }
    }
}