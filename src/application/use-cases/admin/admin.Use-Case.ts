import { User } from "../../../domain/entities/user.entity";
import { Provider } from "../../../domain/entities/provider.entity";
import { UserRepositoryImpl } from "../../../infrastructure/database/user/user.repository.impl";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";

export class AdminUseCase {
    constructor(private providerRepository: ProviderRepositoryImpl, private userRepository: UserRepositoryImpl) {}

    async providersList(): Promise<{success : boolean, message: string, providers?: Provider[]}>{
        const providers = await this.providerRepository.findAllProviders();
        if(!providers) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched providers.", providers };
    }
    
    async usersList(): Promise<{success: boolean, message: string, users?: User[]}>{
        const users = await this.userRepository.findAllUsers();
        if(!users) throw new Error("Fetching error, please try again.");
        return { success: true, message: "Fetched users.", users };
    }
}