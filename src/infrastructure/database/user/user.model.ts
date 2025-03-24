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
  username: { type: String, required: true, minlength: 4, maxlength: 25, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  isBlocked: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  phone: { type: String, default: null, minlength: 13, maxlength: 13 },
  profileImage: { type: String, default: null },
  addressId: { type: Schema.Types.ObjectId, ref: "Address", default: null },
  bookingsId: { type: Schema.Types.ObjectId, ref: "Booking", default: null },
  verificationToken: { type: String, required: true, default: null },
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
