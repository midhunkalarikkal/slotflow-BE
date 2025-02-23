import { Provider } from "../entities/provider.entity";

export interface IProviderRepository {
    createProvider(provider : Provider) : Promise<Provider>;
    findProviderByEmail(email : string) : Promise<Provider | null>;
}