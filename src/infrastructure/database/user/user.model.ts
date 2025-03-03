import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  profileImage: string;
  addressId: Types.ObjectId;
  isBlocked: boolean;
  isEmailVerified: boolean;
  verificationToken?: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, minlength: 4, maxlength: 25, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  phone: { type: String, default: null, minlength: 13, maxlength: 13 },
  profileImage: { type: String, default: null },
  addressId: { type: Schema.Types.ObjectId, ref: "Address", default: null },
  isBlocked: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
