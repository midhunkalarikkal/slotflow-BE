import validator from 'validator';
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
    addressLine: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 150,
        match: [/^[a-zA-Z0-9\s.,#-]+$/, "Address line should only contain valid characters"],
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (val: string) {
                return validator.isMobilePhone(val, ["en-IN"]);
            },
            message: "Invalid mobile number",
        },
    },
    place: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        match: [/^[a-zA-Z\s]+$/, "Place should only contain alphabets and spaces"],
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        match: [/^[a-zA-Z\s]+$/, "City should only contain alphabets and spaces"],
    },
    district: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        match: [/^[a-zA-Z\s]+$/, "District should only contain alphabets and spaces"],
    },
    pincode: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6,
        validate: {
            validator: function (val: string) {
                return validator.isPostalCode(val, "IN");
            },
            message: "Invalid pincode",
        },
    },
    state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        match: [/^[a-zA-Z\s]+$/, "State should only contain alphabets and spaces"],
    },
    country: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        match: [/^[a-zA-Z\s]+$/, "Country should only contain alphabets and spaces"],
    },
    googleMapLink: {
        type: String,
        required: true,
        validate: {
            validator: function (val: string) {
                return validator.isURL(val) && val.startsWith("https://maps.app.goo.gl/");
            },
            message: "Invalid Google Map URL",
        },
    }
}, {
    timestamps: true
});

export const AddressModel = mongoose.model<IAddress>('Address', addressSchema);