import { Types } from "mongoose";
import { Validator } from "../../../infrastructure/validator/validator";
import { availability } from "../../../domain/entities/serviceAvailability.entity";
import { ServiceAvailabilityRepositoryImpl } from "../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

export class ProviderAddServiceAvailabilityUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl,
    ){}

    async execute(providerId: string, availability: availability[]): Promise<{success: boolean, message: string }> {
        if(!providerId || !availability || availability.length  === 0) throw new Error("Invalid request.");

        const convertedProviderId = new Types.ObjectId(providerId);
        const provider = await this.providerRepository.findProviderById(providerId);
        if(!provider) throw new Error("Please logout and try again.");

        console.log("Before validation")
        availability.map((data) => {
            Validator.validateDay(data.day);
            Validator.validateDuration(data.duration);
            Validator.validateStartTime(data.startTime);
            Validator.validateEndTime(data.endTime, data.startTime);
            Validator.validateModes(data.modes);
        })
        console.log("after validation")

        const serviceAvailability = await this.serviceAvailabilityRepository.createServiceAvailability({providerId: convertedProviderId, availability})
        if(!serviceAvailability) throw new Error("Service availability adding failed.");

        if (provider && serviceAvailability && serviceAvailability._id) {
            provider.serviceAvailability = serviceAvailability._id;
            const updatedProvider = await this.providerRepository.updateProvider(provider);
            if (!updatedProvider) throw new Error("Failed to update provider with service availability ID.");
        }

        return { success: true, message: "Service availability added successfuly." };
    }
}