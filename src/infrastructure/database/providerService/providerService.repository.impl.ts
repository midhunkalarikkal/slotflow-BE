import { Types } from "mongoose";
import { IProviderService, ProviderServiceModel } from "./providerService.model";
import { ProviderService } from "../../../domain/entities/providerService.entity";
import { CreateProviderServiceReqProps, FindProviderServiceResProps, FindProvidersUsingServiceCategoryIdsResProps, IProviderServiceRepository } from "../../../domain/repositories/IProviderService.repository";

export class ProviderServiceRepositoryImpl implements IProviderServiceRepository {
    private mapToEntity(providerService: IProviderService): ProviderService {
        return new ProviderService(
            providerService._id,
            providerService.providerId,
            providerService.serviceCategory,
            providerService.serviceName,
            providerService.serviceDescription,
            providerService.servicePrice,
            providerService.providerAdhaar,
            providerService.providerExperience,
            providerService.providerCertificateUrl,
            providerService.createdAt,
            providerService.updatedAt,
        );
    }

    async createProviderService(providerService: CreateProviderServiceReqProps): Promise<ProviderService | null> {
        try {
            const newProviderService = await ProviderServiceModel.create(providerService);
            return newProviderService ? this.mapToEntity(newProviderService) : null;
        } catch (error) {
            console.log("providerService.repository.impl.ts createProviderService method error", error);
            throw new Error("Service details adding error.");
        }
    }

    async findProviderServiceByProviderId(providerId: Types.ObjectId): Promise<FindProviderServiceResProps | {}> {
        try {
            const service = await ProviderServiceModel.findOne({ providerId })
                .populate({
                    path: "serviceCategory",
                    select: "-_id serviceName"
                }).lean();
            return service || {};
        } catch (error) {
            throw new Error("Service fetching error.");
        }
    }

    async findProvidersUsingServiceCategoryIds(serviceCategoryIds: Types.ObjectId[]): Promise<Array<FindProvidersUsingServiceCategoryIdsResProps> | []> {
        try {
            const pipeline: any[] = [];

            if (serviceCategoryIds.length > 0) {
                pipeline.push({
                    $match: {
                        serviceCategory: { $in: serviceCategoryIds }
                    }
                });
            }

            pipeline.push(
                {
                    $lookup: {
                        from: "providers",

                        let: { providerId: "$providerId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$_id", "$$providerId"] },
                                            { $eq: ["$adminVerified", true] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "provider"
                    }
                },
                { $unwind: "$provider" },
                {
                    $lookup: {
                        from: "services",
                        localField: "serviceCategory",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                { $unwind: "$category" },
                {
                    $project: {
                        service: {
                            serviceCategory: "$serviceCategory",
                            serviceName: "$serviceName",
                            servicePrice: "$servicePrice",
                            categoryName: "$category.serviceName"
                        },
                        provider: {
                            _id: '$provider._id',
                            username: '$provider.username',
                            profileImage: '$provider.profileImage',
                            trustedBySlotflow: '$provider.trustedBySlotflow'
                        }
                    }
                }
            );

            const providers = await ProviderServiceModel.aggregate(pipeline);
            return providers;
        } catch (error) {
            throw new Error("Provider Ids fetching error");
        }
    }

}