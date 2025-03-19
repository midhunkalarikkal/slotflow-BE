import { IProvider, ProviderModel } from "./provider.model";
import { Provider } from "../../../domain/entities/provider.entity";
import { IProviderRepository } from '../../../domain/repositories/IProvider.repository';
import { Types } from "mongoose";


export class ProviderRepositoryImpl implements IProviderRepository {
    private mapToEntity(provider: IProvider): Provider {
        return new Provider(
            provider._id,
            provider.username,
            provider.email,
            provider.password,
            provider.isBlocked,
            provider.isEmailVerified,
            provider.isAdminVerified,
            provider.phone,
            provider.profileImage,
            provider.addressId,
            provider.serviceId,
            provider.serviceAvailabilityId,
            provider.subscription,
            provider.verificationToken,

        )
    }

    async createProvider(provider: Partial<Provider>): Promise<Partial<Provider> | null> {
        try {
            const createdProvider = await ProviderModel.create(provider);
            return createdProvider ? this.mapToEntity(createdProvider) : null;
        } catch (error) {
            throw new Error("Unable to register, Please try again after a few minutes.");
        }
    }

    async findProviderByEmail(email: string): Promise<Provider | null> {
        try {
            const provider = await ProviderModel.findOne({ email });
            return provider ? this.mapToEntity(provider) : null;
        } catch (error) {
            throw new Error("Unexpected error, please try again.");
        }
    }

    async findAllProviders(): Promise<Partial<Provider>[] | null> {
        try {
            const providers = await ProviderModel.find({}, { _id: 1, username: 1, email: 1, isBlocked: 1, isAdminVerified: 1 });
            return providers ? providers.map((provider) => this.mapToEntity(provider)) : null;
        } catch (error) {
            throw new Error("Failed to fetch providers from database.");
        }
    }


    async updateProviderVerificationStatus(providerId: Types.ObjectId, isAdminVerified: boolean): Promise<Partial<Provider> | null> {
        try {
            const updatedProvider = await ProviderModel.findByIdAndUpdate(
                providerId,
                { isAdminVerified: isAdminVerified },
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
            return User || null;
        } catch (error) {
            throw new Error("Unable to retrieve verification data.");
        }
    }

    async updateProvider(provider: Partial<Provider>): Promise<Partial<Provider> | null> {
        try {
            const updatedProvider = await ProviderModel.findByIdAndUpdate(provider._id, provider, { new: true });
            return updatedProvider ? this.mapToEntity(updatedProvider) : null;
        } catch (error) {
            throw new Error("Unable to update user.");
        }
    }

    async updateProviderStatus(providerId: Types.ObjectId, status: boolean): Promise<Partial<Provider> | null> {
        try {
            const updatedProvider = await ProviderModel.findByIdAndUpdate(
                providerId,
                { isBlocked: status },
                { new: true, select: '_id isBlocked' }
            );
            return updatedProvider || null;
        } catch (error) {
            throw new Error("Unexpected error, please try again.");
        }
    }

    async checkProviderStatus(providerId: Types.ObjectId): Promise<Partial<Provider> | null> {
        try{
            const provider = await ProviderModel.findById(providerId);
            return provider ? provider : null;
        }catch(error){
            throw new Error("Status checking error.");
        }
    }

    async findProviderById(providerId: Types.ObjectId): Promise<Provider | null> {
        try{
            const provider = await ProviderModel.findById(providerId);
            return provider ? this.mapToEntity(provider) : null;
        }catch(error){
            throw new Error('Provider finding error.');
        }
    }

    
}