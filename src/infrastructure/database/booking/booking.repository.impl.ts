import { Types } from "mongoose";
import { BookingModel, IBooking } from "./booking.model";
import { Booking } from "../../../domain/entities/booking.entity";
import { FetchBookingsRequest, ApiResponse, FetchBookingsResponse, userIdAndServiceProviderId } from "../../dtos/common.dto";
import { CreateBookingPayloadProps, IBookingRepository } from "../../../domain/repositories/IBooking.repository";
import { Provider } from "../../../domain/entities/provider.entity";
import { ProviderFetchUsersForChatSideBar } from "../../dtos/provider.dto";
import dayjs from "dayjs";

export class BookingRepositoryImpl implements IBookingRepository {
    private mapToEntity(booking: IBooking): Booking {
        return new Booking(
            booking._id,
            booking.serviceProviderId,
            booking.userId,
            booking.appointmentDate,
            booking.appointmentTime,
            booking.appointmentMode,
            booking.appointmentStatus,
            booking.slotId,
            booking.paymentId,
            booking.createdAt,
            booking.updatedAt,
        )
    }

    async createBooking(booking: CreateBookingPayloadProps, options: { session?: any }): Promise<Booking> {
        try {
            const newBooking = await BookingModel.create([booking], options);
            return this.mapToEntity(newBooking[0]);
        } catch (error) {
            throw new Error("Appointment booking creating failed");
        }
    }

    async findBookingByUserId(userId: Types.ObjectId, day: string, date: Date, time: string): Promise<Array<Booking> | null> {
        try {
            const bookings = await BookingModel.find({
                userId: userId,
                appointmentDay: day,
                createdAt: date,
                appointmentTime: time,
                appointmentStatus: "Booked",
            });
            return bookings;
        } catch (error) {
            throw new Error("Booking fetching failed");
        }
    }

    async findBookingById(bookingId: Types.ObjectId): Promise<Booking | null> {
        try {
            const booking = await BookingModel.findById(bookingId);
            return booking ? this.mapToEntity(booking) : null;
        } catch (error) {
            throw new Error("Finding booking failed");
        }
    }

    async updateBooking(booking: Booking): Promise<Booking | null> {
        try {
            const updatedBooking = await BookingModel.findByIdAndUpdate(
                booking._id,
                { ...booking },
                { new: true }
            );
            return updatedBooking ? this.mapToEntity(updatedBooking) : null;
        } catch (error) {
            throw new Error("Booking updating failed");
        }
    }

    async findTodaysBookingForCronjob(): Promise<boolean> {
        try {

            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

            const bookings = await BookingModel.updateMany(
                {
                    appointmentStatus: "Booked",
                    appointmentDate: {
                        $gte: todayStart,
                        $lt: todayEnd
                    }
                },
                {
                    $set: { appointmentStatus: "Not Attended" }
                }
            );
            return bookings.modifiedCount > 0 ? true : false;
        } catch {
            return false;
        }
    }

    async findAllBookings({ page, limit, userId, serviceProviderId }: FetchBookingsRequest): Promise<ApiResponse<FetchBookingsResponse>> {
        try {
            const skip = (page - 1) * limit;
            const filter: userIdAndServiceProviderId = {};
            if (userId) { filter.userId = userId; }
            if (serviceProviderId) { filter.serviceProviderId = serviceProviderId; }
            const [payments, totalCount] = await Promise.all([
                BookingModel.find(filter, {
                    _id: 1,
                    appointmentDate: 1,
                    appointmentMode: 1,
                    appointmentStatus: 1,
                    appointmentTime: 1,
                    createdAt: 1,
                }).skip(skip).limit(limit).sort({ createdAt: 1 }).lean(),
                BookingModel.countDocuments(),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                data: payments.map(this.mapToEntity),
                totalPages,
                currentPage: page,
                totalCount
            }
        } catch {
            throw new Error("Bookings fetching failed")
        }
    }

    async findUsersforChatSideBar(providerId: Provider["_id"]): Promise<ProviderFetchUsersForChatSideBar> {
        try {

            console.log("providerId : ",providerId);
            console.log("gte : ",dayjs().subtract(1, 'day').startOf('day').toDate());
            console.log("lte : ",dayjs().add(1, 'day').startOf('day').toDate());

            const users = await BookingModel.aggregate([
                {
                    $match: {
                        serviceProviderId: providerId,
                        appointmentDate: {
                            $gte: dayjs().subtract(1, 'day').startOf('day').toDate(),         // eg: 2025-07-13T18:30:00.000Z
                            $lte: dayjs().add(1, 'day').startOf('day').toDate(),              // eg: 2025-07-15T00:00:00.000Z
                        },
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                {
                    $group: {
                        _id: "$user._id",
                        username: { $first: "$user.username" },
                        profileImage: { $first: "$user.profileImage" }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        profileImage: 1
                    }
                }
            ]);
            return users;
        } catch {
            throw new Error("Users fetching failed");
        }
    }
}