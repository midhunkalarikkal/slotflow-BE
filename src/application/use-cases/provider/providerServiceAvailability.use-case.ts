import { Types } from "mongoose";
import { Validator } from "../../../infrastructure/validator/validator";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { Availability, FontendAvailability, ServiceAvailability } from "../../../domain/entities/serviceAvailability.entity";

type ProviderFetchServiceAvailabilityResProps = Pick<ServiceAvailability, "_id" | "availability">;

export class ProviderAddServiceAvailabilityUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl,
    ){}

    async execute(providerId: string, availability: FontendAvailability[]): Promise<{success: boolean, message: string }> {
        if(!providerId || !availability || availability.length  === 0) throw new Error("Invalid request.");

        const convertedProviderId = new Types.ObjectId(providerId);
        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if(!provider) throw new Error("Please logout and try again.");

        availability.map((data) => {
            Validator.validateDay(data.day);
            Validator.validateDuration(data.duration);
            Validator.validateStartTime(data.startTime);
            Validator.validateEndTime(data.endTime, data.startTime);
            Validator.validateModes(data.modes);
        })

        const newAvailability: Availability[] = availability.map((avail: FontendAvailability) => ({
            ...avail,
            slots: avail.slots.map((slot: string) => ({
                slot: slot, available: true
            }))
        }));


        const serviceAvailability = await this.serviceAvailabilityRepository.createServiceAvailability(convertedProviderId, newAvailability)
        if(!serviceAvailability) throw new Error("Service availability adding failed.");

        if (provider && serviceAvailability && serviceAvailability._id) {
            provider.serviceAvailabilityId = serviceAvailability._id;
            const updatedProvider = await this.providerRepository.updateProvider(provider);
            if (!updatedProvider) throw new Error("Failed to update provider with service availability ID.");
        }

        return { success: true, message: "Service availability added successfuly." };
    }
}


export class ProviderFetchServiceAvailabilityUseCase {
    constructor(private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl) { }

    async execute(providerId: string): Promise<{ success: boolean, message: string, availability: ProviderFetchServiceAvailabilityResProps | null}> {
        if (!providerId) throw new Error("Invalid request.");
        const availability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId));
        if(availability === null) return { success: true, message: "Provider service availability not yet added.", availability: null };
        if (!availability) throw new Error("Provider service availability fetching error.");
        const { providerId: pId, createdAt, updatedAt, ...rest } = availability;
        return { success: true, message: "Provider service availability fetched.", availability: rest };
    }
}