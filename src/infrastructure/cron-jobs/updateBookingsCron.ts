import dayjs from "dayjs";
import cron from "node-cron";
import { BookingRepositoryImpl } from "../database/booking/booking.repository.impl";
import { UpdateBookingStatusCronUseCase } from "../../application/cron-job.use-case/updateBookingStatusCron.use-case";

const bookingRepositoryImpl = new BookingRepositoryImpl();
const updateBookingStatusCronUseCase = new UpdateBookingStatusCronUseCase(bookingRepositoryImpl);

let lastSuccessfulRunDateForBookings: string | null = null;

cron.schedule("* * * * *", async () => {
    const today = dayjs().format("YYYY-MM-DD");

    if (lastSuccessfulRunDateForBookings === today) {
        return;
    }

    console.log('[CRON] Running updateAppointmentStatuses...');
    const result = await updateBookingStatusCronUseCase.execute();

    console.log("result : ",result);

    if (result === true) {
        lastSuccessfulRunDateForBookings = today;
        console.log('[CRON] Status updated successfully.');
    } else {
        console.log('[CRON] No update made or failed. Will retry...');
    }
});