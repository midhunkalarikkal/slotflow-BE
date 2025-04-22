import { Request, Response } from "express";
import { HandleError } from "../../infrastructure/error/error";

export class UserBookingController {
    constructor(

    ) { }
    
    async bookingViaStripe(req: Request, res: Response) {
        try {
            const userId = req.user.userOrProviderId;
            const { providerId, selectedDay, slotId } = req.body;
            if(!userId || !providerId || !selectedDay || !slotId) throw new Error("Invalid request");
            
        }catch (error) {
            HandleError.handle(error, res);
        }
    }
}

const userBookingController = new UserBookingController();
export { userBookingController };