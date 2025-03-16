import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

export class ProviderUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl){}

    async execute(providerId: string): Promise<{success: boolean, address: boolean, service: boolean, verified: boolean, message: string}> {
        if(!providerId) throw new Error("Invalid request.");
        const provider = await this.providerRepository.findProviderById(providerId);
        const address = provider?.addressId ? true : false;
        const service = provider?.serviceId ? true : false;
        const isVerified = provider?.isAdminVerified ? true : false;
        return {success: true, address: address, service: service, verified: isVerified, message: "Provder approval details"}
    }
}