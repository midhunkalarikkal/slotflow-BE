import { Types } from "mongoose";
import { IProvider, ProviderModel } from "./provider.model";
import { Provider } from "../../../domain/entities/provider.entity";
import {  CreateProviderReqProps, FindAllProvidersResProps, IProviderRepository } from '../../../domain/repositories/IProvider.repository';


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
            provider.trustedBySlotflow,
            provider.createdAt,
            provider.updatedAt,
        )
    }

    async createProvider(provider: CreateProviderReqProps): Promise<Provider | null> {
        try {
            if(!provider) throw new Error("Invalid request.");
            const createdProvider = await ProviderModel.create(provider);
            return createdProvider ? this.mapToEntity(createdProvider) : null;
        } catch (error) {
            throw new Error("Unable to register, Please try again after a few minutes.");
        }
    }

    async verifyProvider(verificationToken: string): Promise<Provider | null> {
        try {
            if(!verificationToken) throw new Error("Invalid request.");
            const User = await ProviderModel.findOne({ verificationToken });
            return User || null;
        } catch (error) {
            throw new Error("Unable to retrieve verification data.");
        }
    }

    async updateProvider(provider: Provider): Promise<Provider | null> {
        try {
            if(!provider) throw new Error("Invalid request.");
            const updatedProvider = await ProviderModel.findByIdAndUpdate(provider._id, provider, { new: true });
            return updatedProvider ? this.mapToEntity(updatedProvider) : null;
        } catch (error) {
            throw new Error("Unable to update user.");
        }
    }

    async findProviderByEmail(email: string): Promise<Provider | null> {
        try {
            if(!email) throw new Error("Invalid request.");
            const provider = await ProviderModel.findOne({ email });
            return provider ? this.mapToEntity(provider) : null;
        } catch (error) {
            throw new Error("Unexpected error, please try again.");
        }
    }

    async findAllProviders(): Promise<Array<FindAllProvidersResProps> | null> {
        try {
            const providers = await ProviderModel.find({}, { _id: 1, username: 1, email: 1, isBlocked: 1, isAdminVerified: 1, trustedBySlotflow: 1 });
            return providers ? providers.map((provider) => this.mapToEntity(provider)) : null;
        } catch (error) {
            throw new Error("Failed to fetch providers from database.");
        }
    }

    async findProviderById(providerId: Types.ObjectId): Promise<Provider | null> {
        try{
            const provider = await ProviderModel.findById(providerId)
            return provider ? this.mapToEntity(provider) : null;
        }catch(error){
            throw new Error('Provider finding error.');
        }
    }
    
}