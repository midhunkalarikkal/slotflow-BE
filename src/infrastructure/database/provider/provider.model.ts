import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProvider extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  isBlocked: boolean;
  isEmailVerified: boolean;
  isAdminVerified: boolean;
  phone: string;
  profileImage: string;
  addressId: Types.ObjectId;
  serviceId: Types.ObjectId;
  serviceAvailabilityId: Types.ObjectId;
  subscription: Types.ObjectId[];
  verificationToken: string;
  trustedBySlotflow: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProviderSchema = new Schema<IProvider>({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [4, "Username must be at least 4 characters"],
    maxlength: [30, "Username must be at most 30 characters"],
    trim: true,
    match: [/^[a-zA-Z\s]{4,30}$/, "Invalid username"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    maxlength: [100, "Password must be at most 100 characters"],
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,100}$/, "Invalid password"]
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isAdminVerified: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    default: null,
    minlength: [13, "Phone must be exactly 13 characters"],
    maxlength: [13, "Phone must be exactly 13 characters"],
    match: [/^\+\d{10,15}$/, "Invalid phone number"],
  },
  profileImage: {
    type: String,
    default: null
  },
  addressId: {
    type: Schema.Types.ObjectId,
    ref: "Address",
    default: null
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    default: null
  },
  serviceAvailabilityId: {
    type: Schema.Types.ObjectId,
    ref: "ServiceAvailability"
  },
  subscription: {
    type: [Schema.Types.ObjectId],
    ref: "Subscription",
    default: []
  },
  verificationToken: {
    type: String,
    default: null
  },
  trustedBySlotflow: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

export const ProviderModel = mongoose.model<IProvider>('Provider', ProviderSchema);
