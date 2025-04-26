import Stripe from "stripe";
import { Types } from "mongoose";
import { FindProviderServiceResProps } from "../../../domain/repositories/IProviderService.repository";
import { ProviderRepositoryImpl } from "../../../infrastructure/database/provider/provider.repository.impl";
import { ProviderServiceRepositoryImpl } from "../../../infrastructure/database/providerService/providerService.repository.impl";
import { ServiceAvailabilityRepositoryImpl } from "../../../infrastructure/database/serviceAvailability/serviceAvailability.repository.impl";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class UserAppointmentBookingViaStripeUseCase {
    constructor(
        private providerRepository: ProviderRepositoryImpl,
        private providerServiceRepository: ProviderServiceRepositoryImpl,
        private serviceAvailabilityRepository: ServiceAvailabilityRepositoryImpl,
    ) { }

    async execute(userId: string, providerId: string, selectedDay: string, slotId: string, selectedServiceMode: string): Promise<{ success: boolean, message: string, sessionId: string }> {
        if (!userId || !providerId || !selectedDay || !slotId || !selectedServiceMode) throw new Error("Invalid request");

        const provider = await this.providerRepository.findProviderById(new Types.ObjectId(providerId));
        if (!provider) throw new Error("No provider found");

        const providerService = await this.providerServiceRepository.findProviderServiceByProviderId(new Types.ObjectId(providerId));
        if(!providerService) throw new Error("No service found");

        function isServiceData(obj: any): obj is FindProviderServiceResProps {
            return obj && typeof obj === 'object' && '_id' in obj;
          }
      
          if (!isServiceData(providerService)) throw new Error("No service data found");

        const providerServiceAvailability = await this.serviceAvailabilityRepository.findServiceAvailabilityByProviderId(new Types.ObjectId(providerId));
        if (!providerServiceAvailability) throw new Error("No availability found");

        const dayAvailability = providerServiceAvailability.availability.filter((avail) => avail.day === selectedDay);
        if(!dayAvailability || dayAvailability.length === 0) throw new Error("No available slots found for this day");

        const selectedSlot = dayAvailability[0].slots.filter((slot) => slot._id.toString() === slotId );
        if(!selectedSlot || selectedSlot .length === 0) throw new Error("Not slot found");

        if(!selectedSlot[0].available) throw new Error("This slot is not available for today");

        console.log("provider : ",provider);
        console.log("providerService : ",providerService);
        console.log("providerServiceAvailability : ",providerServiceAvailability);
        console.log("dayAvailability : ",dayAvailability);
        console.log("selectedSlot : ",selectedSlot);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: providerService.serviceName,
                        description: providerService.serviceDescription,
                    },
                    unit_amount: providerService.servicePrice * 100,
                },
                quantity: 1
            }],
            success_url: `http://localhost:5173/provider/payment-success/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/provider/payment-failed/`,
            metadata: {
                providerId: providerId,
                selectedDay: selectedDay,
                slotId: slotId,
                selectedServiceMode: selectedServiceMode,
                initialAmount: providerService.servicePrice * 100,
                totalAmount: providerService.servicePrice * 100,
            }
        });
        return { success: true, message: "Session id generated.", sessionId: session.id };
        
    }
}