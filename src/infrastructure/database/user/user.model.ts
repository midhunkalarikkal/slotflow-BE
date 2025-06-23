import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  isBlocked: boolean;
  isEmailVerified: boolean;
  phone: string;
  profileImage: string;
  addressId: Types.ObjectId;
  bookingsId: Types.ObjectId;
  verificationToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
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
    maxlength: [50, "Password must be at most 50 characters"],
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,50}$/, "Invalid password"]
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
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
  bookingsId: {
    type: Schema.Types.ObjectId,
    ref: "Booking", default: null
  },
  verificationToken: {
    type: String,
    required: [true, "Verification token is required"],
    default: null
  },
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
