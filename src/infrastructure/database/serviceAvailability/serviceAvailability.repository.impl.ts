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
}