import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { UserAppointmentBookingViaStripeUseCase } from "../../application/use-cases/user/userStripeBooking.use-case";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../infrastructure/database/providerService/providerService.repository.impl";

const proviserRepositoryImpl = new ProviderRepositoryImpl();
const providerServiceRepositoryImpl = new ProviderServiceRepositoryImpl();
const serviceAvailabilityRepositoryImpl = new ServiceAvailabilityRepositoryImpl();
const userAppointmentBookingViaStrpieUseCase = new UserAppointmentBookingViaStripeUseCase(proviserRepositoryImpl, providerServiceRepositoryImpl, serviceAvailabilityRepositoryImpl);

export class UserBookingController {
    constructor(
        private userAppointmentBookingViaStripeUseCase : UserAppointmentBookingViaStripeUseCase,
    ) { 
        this.bookingViaStripe = this.bookingViaStripe.bind(this);
    }
    
    async bookingViaStripe(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const { providerId, selectedDay, slotId, selectedServiceMode } = req.body;
            if(!userId || !providerId || !selectedDay || !slotId || !selectedServiceMode) throw new Error("Invalid request");
            console.log("userId : ",userId);
            console.log("req.body : ",req.body);
            const result = await this.userAppointmentBookingViaStripeUseCase.execute(userId, providerId, selectedDay, slotId, selectedServiceMode);
            res.status(200).json(result);
        }catch (error) {
            HandleError.handle(error, res);
        }
    }
}

const userBookingController = new UserBookingController( userAppointmentBookingViaStrpieUseCase );
export { userBookingController };