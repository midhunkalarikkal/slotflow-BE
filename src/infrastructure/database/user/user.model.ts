import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  isBlocked: boolean;
  profileImage: string;
  addressId: string;
  verified: boolean
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: null },
  isBlocked: { type: Boolean, default: false },
  profileImage: { type: String, default: null },
  addressId: { type: String, default: null },
  verified: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
