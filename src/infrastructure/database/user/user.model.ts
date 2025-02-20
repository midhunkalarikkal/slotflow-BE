import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  profileImage: string;
  addressId: Types.ObjectId;
  isBlocked: boolean;
  isVerified: boolean
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, minlength: 4, maxlength: 25, trim: true, match: /^[A-Za-z]{4,25}$/ },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, match: /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){2,}@gmail\.com$/ },
  password: { type: String, required: true, minlength: 8, maxlength: 30 },
  phone: { type: String, default: null, minlength: 13, maxlength: 13 },
  profileImage: { type: String, default: null },
  addressId: { type: Schema.Types.ObjectId, ref: "Address", default: null },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const UserModel = mongoose.model<IUser>('User', UserSchema);
