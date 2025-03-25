import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAddress extends Document {
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    addressLine: string,
    phone: string,
    place: string,
    city: string,
    district: string,
    pincode: string,
    state: string,
    country: string,
    googleMapLink: string,
    createdAt: Date,
    updatedAt: Date,
}

const addressSchema = new Schema<IAddress>({
    userId: { type: Schema.Types.ObjectId, required: true, unique: true },
    addressLine: { type: String, required: true, minlength: 10, maxLength: 25 },
    phone: { type: String, required: true },
    place: { type: String, required: true, minlength: 3, maxlength: 25 },
    city: { type: String, required: true, minlength: 3, maxlength: 25 },
    district: { type: String, required: true, minlength: 3, maxlength: 25 },
    pincode: { type: String, required: true, minlength:6, maxLength: 6 },
    state: { type: String, required: true, minLength: 3, maxLength: 25 },
    country: { type: String, required: true, minLength: 3, maxLength: 25 },
    googleMapLink: { type: String, required: true }
},{
    timestamps: true
});

export const AddressModel = mongoose.model<IAddress>('Address',addressSchema);