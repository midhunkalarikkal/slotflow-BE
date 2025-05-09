import { Types } from 'mongoose';
import { IServiceAvailability, ServiceAvailabilityModel } from './serviceAvailability.model';
import { Availability, ServiceAvailability } from '../../../domain/entities/serviceAvailability.entity';
import { IServiceAvailabilityRepository } from '../../../domain/repositories/IServiceAvailability.repository';

export class ServiceAvailabilityRepositoryImpl implements IServiceAvailabilityRepository {
    private mapToEntity(serviceAvailability: IServiceAvailability): ServiceAvailability {
        return new ServiceAvailability(
            serviceAvailability._id,
            serviceAvailability.providerId,
            serviceAvailability.availability,
            serviceAvailability.createdAt,
            serviceAvailability.updatedAt,
        )
    }

    async createServiceAvailability(providerId: Types.ObjectId, availability: Array<Availability>): Promise<ServiceAvailability> {
        try {
            const serviceAvailability = {
                providerId,availability
            }
            const newServiceAvailability = await ServiceAvailabilityModel.create(serviceAvailability);
            return this.mapToEntity(newServiceAvailability);
        } catch (error) {
            throw new Error("Service Availability adding failed.");
        }
    }

    async findServiceAvailabilityByProviderId(providerId: Types.ObjectId): Promise<ServiceAvailability | null> {
        try{
            const availability = await ServiceAvailabilityModel.findOne({providerId});
            return availability ? this.mapToEntity(availability) : null;
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
}