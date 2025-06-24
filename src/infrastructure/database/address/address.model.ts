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
    userId: {
        type: Schema.Types.ObjectId,
        required: [true,"UserId is required"],
        unique: true,
    },
    addressLine: {
        type: String,
        required: [true, "Address line is required"],
        minlength: [10, "Address line must be at least 10 characters"],
        maxlength: [150, "Address line must be at most 150 characters"],
        match: [/^[a-zA-Z0-9 .,#-]{10,150}$/,"Address line can only include letters, numbers, spaces, and the symbols . , # -",],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        minlength: [10, "Phone number must be at least 10 characters"],
        maxlength: [15, "Phone number must be at most 15 characters"],
        match: [/^\+\d{10,15}$/, "Invalid phone number. It should start with '+' followed by 10 to 15 digits"],
    },
    place: {
        type: String,
        required: [true, "Place is required"],
        minlength: [3, "Place must be at least 3 characters"],
        maxlength: [50, "Place must be at most 50 characters"],
        match: [/^[a-zA-Z .-]{3,50}$/,"Place must only contain letters, spaces, dots, and hyphens"],
    },
    city: {
        type: String,
        required: [true, "City is required"],
        minlength: [3, "City must be at least 3 characters"],
        maxlength: [50, "City must be at most 50 characters"],
        match: [/^[a-zA-Z ]{3,50}$/,"City must only contain letters and spaces"],
    },
    district: {
        type: String,
        required: [true, "District is required"],
        minlength: [3, "District must be at least 3 characters"],
        maxlength: [50, "District must be at most 50 characters"],
        match: [/^[a-zA-Z ]{3,50}$/,"District must only contain letters and spaces"],
    },
    pincode: {
        type: String,
        required: [true, "Postal code is required"],
        minlength: [3, "Postal code must be at least 3 characters"],
        maxlength: [12, "Postal code must be at most 12 characters"],
        match: [/^[A-Za-z0-9\s-]{3,12}$/,"Postal code can only include letters, numbers, spaces, and hyphens"],
    },
    state: {
        type: String,
        required: [true, "State is required"],
        minlength: [2, "State must be at least 2 characters"],
        maxlength: [50, "State must be at most 50 characters"],
        match: [/^[a-zA-Z ]{2,50}$/,"State must only contain letters and spaces"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
        minlength: [2, "Country must be at least 2 characters"],
        maxlength: [50, "Country must be at most 50 characters"],
        match: [/^[a-zA-Z ]{2,50}$/,"Country must only contain letters and spaces"],
    },
    googleMapLink: {
        type: String,
        required: [true, "Google Map link is required"],
        validate: {
            validator: function (value) {
                return value.startsWith("https://maps.app.goo.gl/");
            },
            message: "Google Map link must start with https://maps.app.goo.gl/",
        },
    },
}, {
    timestamps: true
});

export const AddressModel = mongoose.model<IAddress>('Address', addressSchema);