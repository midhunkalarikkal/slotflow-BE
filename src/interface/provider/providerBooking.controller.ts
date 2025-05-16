import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { BookingRepositoryImpl } from "../../infrastructure/database/booking/booking.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderFetchBookingAppointmentsUseCase } from "../../application/provider-use.case/providerBooking.use-case";

const bookingRepositoryImpl = new BookingRepositoryImpl();
const providerRepositoryImpl = new ProviderRepositoryImpl();

const providerFetchBookingAppointmentsUseCase = new ProviderFetchBookingAppointmentsUseCase(providerRepositoryImpl, bookingRepositoryImpl);

export class ProviderBookingController {
    constructor(
        private providerFetchBookingAppointmentsUseCase: ProviderFetchBookingAppointmentsUseCase,
    ) { 
        this.fetchBookingAppointments = this.fetchBookingAppointments.bind(this);
    }

    async fetchBookingAppointments(req: Request, res: Response) {
        try {
            const providerId = req.user.userOrProviderId;
            if(!providerId) throw new Error("Invalid request");
            const result = await this.providerFetchBookingAppointmentsUseCase.execute({providerId: new Types.ObjectId(providerId)});
            res.status(200).json(result);
        }catch (error){
            HandleError.handle(error,res);
        }
    }
}

const providerBookingController = new ProviderBookingController(providerFetchBookingAppointmentsUseCase);
export { providerBookingController };