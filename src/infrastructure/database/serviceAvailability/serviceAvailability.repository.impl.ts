import { Types } from 'mongoose';
import { IServiceAvailability, ServiceAvailabilityModel } from './serviceAvailability.model';
import { Availability, FontendAvailability, ServiceAvailability } from '../../../domain/entities/serviceAvailability.entity';
import { IServiceAvailabilityRepository } from '../../../domain/repositories/IServiceAvailability.repository';

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

    async createServiceAvailabilities(providerId: Types.ObjectId, availabilities: Array<Availability>): Promise<ServiceAvailability> {
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

    async findServiceAvailabilityByProviderId(providerId: Types.ObjectId, date: Date): Promise<Array<FontendAvailability> | null> {

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        try{
            const availability = await ServiceAvailabilityModel.aggregate([
                 {
                $match: {
                    providerId: providerId
                }
            },
            {
                $lookup: {
                    from: "bookings",
                    let: { providerId: "$providerId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$serviceProviderId", "$$providerId"] },
                                        { $gte: ["$appointmentDate", startOfDay] },
                                        { $lte: ["$appointmentDate", endOfDay] },
                                        { $in: ["$appointmentStatus", ["booked", "completed"]] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                slotId: 1
                            }
                        }
                    ],
                    as: "providerBookings"
                }
            },
            {
                $addFields: {
                    availabilities: {
                        $map: {
                            input: "$availabilities",
                            as: "availability",
                            in: {
                                $mergeObjects: [
                                    "$$availability",
                                    {
                                        slots: {
                                            $map: {
                                                input: "$$availability.slots",
                                                as: "slot",
                                                in: {
                                                    $mergeObjects: [
                                                        "$$slot",
                                                        {
                                                            available: {
                                                                $not: {
                                                                    $in: [
                                                                        "$$slot._id",
                                                                        {
                                                                            $map: {
                                                                                input: "$providerBookings",
                                                                                as: "booking",
                                                                                in: "$$booking.slotId"
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
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
                $project: {
                    providerBookings: 0,
                    _id: 0,
                    providerId: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0
                }
            }
            ]);
            console.log("availability : ",availability);
            return availability?.[0] || null;
        }catch(error){
            throw new Error("Service availability fetching error.");
        }
    }

    async updateServiceAvailability(providerId: Types.ObjectId, day: string, slotId: Types.ObjectId, options : { session?: any }): Promise<ServiceAvailability | null> {
        try{
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
        }catch(error){
            throw new Error("Service availability updating error.");
        }
    }

    async findServiceAvailabilityWithLiveData(providerId: Types.ObjectId, date: Date, day: string): Promise<{} | null> {
        try{
            const availability = await ServiceAvailabilityModel.aggregate([
                {
                    $match : { providerId : providerId }
                }
            ]);

            return availability || null;
        }catch(error){
            throw new Error("Availability fetching error");
        }
    }
}