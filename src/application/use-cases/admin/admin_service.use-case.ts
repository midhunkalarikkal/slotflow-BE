import { Service } from "../../../domain/entities/service.entity";
import { ServiceRepositoryImpl } from "../../../infrastructure/database/appservice/service.repository.impl";

export class AdminServiceUseCase{
    constructor(private seriveRepository: ServiceRepositoryImpl){}

    async serviceList(): Promise<{success : boolean, message: string, services?: Service[] }>{
            try{
                const services = await this.seriveRepository.findAllServices();
                if(!services) throw new Error("Fetching error, please try again.");
                return { success: true, message: "Fetched providers.", services };
            }catch(error){
                throw new Error("Unexpected error occurred, please try again.");
            }
        }
}