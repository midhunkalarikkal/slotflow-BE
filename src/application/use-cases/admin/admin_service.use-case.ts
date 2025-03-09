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
        
        async addService(serviceName: string): Promise<{success : boolean, message: string, service: Service }>{
            try{
                const service = await this.seriveRepository.createService(serviceName);
                if(!service) throw new Error("Service adding error, please try again.");
                return { success: true, message: "Service added successfully.", service };
            }catch(error){
                console.log("usecase error : ",error);
                throw new Error("Unexpected error occurred, please try again.");
            }
        }

        async changeStatus(serviceId: string, status: boolean): Promise<{success: boolean, message: string, updatedService: Partial<Service>}> {
            try{
                const updatedService = await this.seriveRepository.updateServiceStatus(serviceId, status);
                if(!updatedService) throw new Error("Service status changing error.");
                return { success: true, message: `Service ${status ? "Blocked" : "Unblocked"} successfully.`, updatedService}
            }catch(error){
                console.log("usecase error : ",error);
                throw new Error("Unexpected error occurred, please try again.");
            }
        }
}