import { ServiceAvailability } from '../../../domain/entities/serviceAvailability.entity';
import { IServiceAvailability, ServiceAvailabilityModel } from './serviceAvailability.model';
import { IServiceAvailabilityRepository } from '../../../domain/repositories/IServiceAvailability.repository';

export class ServiceAvailabilityRepositoryImpl implements IServiceAvailabilityRepository {
    private mapToEntity(serviceAvailability: IServiceAvailability): ServiceAvailability {
        return new ServiceAvailability(
            serviceAvailability.providerId,
            serviceAvailability.availability,
            serviceAvailability._id,
        )
    }

    async createServiceAvailability(availability: ServiceAvailability): Promise<ServiceAvailability> {
        try {
            const modifiedAvailability = await Promise.all(availability.availability.map(async (avail: any) => {
                const slotsMap = new Map<string, boolean>();
                avail.slots.forEach((slot: string) => {
                    slotsMap.set(slot, false); // Default: false
                });

                return {
                    ...avail,
                    slots: slotsMap,
                };
            }));
            const serviceAvailability = new ServiceAvailability(availability.providerId, modifiedAvailability)
            const newServiceAvailability = await ServiceAvailabilityModel.create(serviceAvailability);
            return this.mapToEntity(newServiceAvailability);
        } catch (error) {
            console.log("Repository implementation : ", error)
            throw new Error("Service Availability adding failed.");
        }
    }
}