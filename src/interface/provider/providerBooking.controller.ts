import { Types } from "mongoose";
import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";
import { BookingRepositoryImpl } from "../../infrastructure/database/booking/booking.repository.impl";
import { ProviderRepositoryImpl } from "../../infrastructure/database/provider/provider.repository.impl";
import { ProviderFetchBookingAppointmentsUseCase } from "../../application/provider-use.case/providerBooking.use-case";
import { RequestQueryCommonZodSchema } from "../../infrastructure/zod/common.zod";

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
            const validateQueryData = RequestQueryCommonZodSchema.parse(req.query);
            const { page, limit } = validateQueryData;
            if(!providerId) throw new Error("Invalid request");
            const result = await this.providerFetchBookingAppointmentsUseCase.execute({serviceProviderId: new Types.ObjectId(providerId), page, limit});
            res.status(200).json(result);
        }catch (error){
            HandleError.handle(error,res);
        }
    }
}

const providerBookingController = new ProviderBookingController(providerFetchBookingAppointmentsUseCase);
export { providerBookingController };