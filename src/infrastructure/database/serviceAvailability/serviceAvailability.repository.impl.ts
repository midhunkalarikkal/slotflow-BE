import { Availability, ServiceAvailability } from '../../../domain/entities/serviceAvailability.entity';
import { IServiceAvailability, ServiceAvailabilityModel } from './serviceAvailability.model';
import { IServiceAvailabilityRepository } from '../../../domain/repositories/IServiceAvailability.repository';
import { Types } from 'mongoose';

export class ServiceAvailabilityRepositoryImpl implements IServiceAvailabilityRepository {
    private mapToEntity(serviceAvailability: IServiceAvailability): ServiceAvailability {
        return new ServiceAvailability(
            serviceAvailability.providerId,
            serviceAvailability.availability,
            serviceAvailability._id,
        )
    }

    async createServiceAvailability(providerId: Types.ObjectId, availability: Availability[]): Promise<ServiceAvailability> {
        try {
            // const modifiedAvailability = await Promise.all(availability.availability.map(async (avail: any) => {
            //     const slotsMap = new Map<string, boolean>();
            //     avail.slots.forEach((slot: string) => {
            //         slotsMap.set(slot, false);
            //     });

            //     return {
            //         ...avail,
            //         slots: slotsMap,
            //     };
            // }));
            // const serviceAvailability = new ServiceAvailability(availability.providerId, modifiedAvailability,new Types.ObjectId)
            const serviceAvailability = {
                providerId,availability
            }
            const newServiceAvailability = await ServiceAvailabilityModel.create(serviceAvailability);
            return this.mapToEntity(newServiceAvailability);
        } catch (error) {
            console.log("error : ",error);
            throw new Error("Service Availability adding failed.");
        }
    }

    async findServiceAvailabilityByProviderId(providerId: Types.ObjectId): Promise<ServiceAvailability | null> {
        try{
            if(!providerId) throw new Error("Invalid request.");
            const availability = await ServiceAvailabilityModel.findOne({providerId});
            return availability ? this.mapToEntity(availability) : null;
        }catch(error){
            throw new Error("Service availability fetching error.");
        }
    }
}