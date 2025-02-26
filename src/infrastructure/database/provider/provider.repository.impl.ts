import { IProvider, ProviderModel } from "./provider.model";
import { Provider } from "../../../domain/entities/provider.entity";
import { IProviderRepository } from '../../../domain/repositories/IProvider.repository';


export class ProviderRepositoryImpl implements IProviderRepository {
    private mapToEntity(provider : IProvider) : Provider {
        return new Provider(
            provider.username,
            provider.email,
            provider.password,
            provider.phone,
            provider.profileImage,
            provider.addressId,
            provider.serviceId,
            provider.subscription,
            provider.isBlocked,
            provider.isVerified,
            provider._id,
        )
    }

    async createProvider(provider: Provider): Promise<Provider> {
        try{
            const createdProvider = await ProviderModel.create(provider);
            return this.mapToEntity(createdProvider);
        }catch(error){
            throw new Error("Unable to register, Please try again after a few minutes.")
        }
    }

    async findProviderByEmail(email: string): Promise<Provider | null> {
        try{
            const provider = await ProviderModel.findOne({ email });
            return provider ? this.mapToEntity(provider) : null;
        }catch(error){
            throw new Error("Unable to find the provider.")
        }
    }

    async findAllProviders(): Promise<Provider[]> {
        try{
            return await ProviderModel.find({},{_id:1, username:1, profileImage:1, createdAt: 1});
        }catch(error){
            throw new Error("Failed to fetch providers from database.");
        }
    }
}