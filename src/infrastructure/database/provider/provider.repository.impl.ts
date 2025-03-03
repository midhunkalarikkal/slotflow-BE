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
            provider.isEmailVerified,
            provider.isAdminVerified,
            provider._id,
            provider.verificationToken
        )
    }

    async createProvider(provider: Provider): Promise<Provider> {
        try{
            const createdProvider = await ProviderModel.create(provider);
            return this.mapToEntity(createdProvider);
        }catch(error){
            throw new Error("Unable to register, Please try again after a few minutes.");
        }
    }

    async findProviderByEmail(email: string): Promise<Provider | null> {
        try{
            const provider = await ProviderModel.findOne({ email });
            return provider ? this.mapToEntity(provider) : null;
        }catch(error){
            throw new Error("Unexpected error, please try again.");
        }
    }

    async findAllProviders(): Promise<Provider[]> {
        try{
            return await ProviderModel.find({},{_id:1, username:1, email: 1, isBlocked: 1, isVerified: 1});
        }catch(error){
            throw new Error("Failed to fetch providers from database.");
        }
    }


    async updateProviderVerificationStatus(providerId: string, isVerified: boolean): Promise<Provider | null> {
        try {
            const updatedProvider = await ProviderModel.findByIdAndUpdate(
                providerId,
                { isVerified: isVerified },
                { new: true, select: '_id isVerified' }
            );
            return updatedProvider ? this.mapToEntity(updatedProvider) : null;
        } catch (error) {
            throw new Error("Unexpected error, please try again.");
        }
    }

    async getVerificationData(verificationToken: string): Promise<Provider | null> {
            try {
                const User = await ProviderModel.findOne({ verificationToken });
                console.log("User : ",User);
                return User;
            } catch (error) {
                console.log("Error : ",error);
                throw new Error("Unable to retrieve verification data.");
            }
        }
        
        async updateProvider(user: Provider): Promise<Provider | null> {
            try {
                const updatedUser = await ProviderModel.findByIdAndUpdate(user._id, user, { new: true });
                return updatedUser ? this.mapToEntity(updatedUser) : null;
            } catch (error) {
                throw new Error("Unable to update user.");
            }
        }
}