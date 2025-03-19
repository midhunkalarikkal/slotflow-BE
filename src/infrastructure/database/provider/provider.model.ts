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
  subscription: [Types.ObjectId];
  verificationToken: string;
}

const ProviderSchema = new Schema<IProvider>({
  username: { type: String, required: true, minlength: 4, maxlength: 25, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  isBlocked: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  isAdminVerified: { type: Boolean, default: false },
  phone: { type: String, default: null, minlength: 13, maxlength: 13 },
  profileImage: { type: String, default: null },
  addressId: { type: Schema.Types.ObjectId, ref: "Address", default: null },
  serviceId: { type: Schema.Types.ObjectId, ref: "Service", default: null},
  serviceAvailabilityId: { type: Schema.Types.ObjectId, ref: "ServiceAvailability" },
  subscription: { type: [Schema.Types.ObjectId], ref: "Subscription", default: null},
  verificationToken: { type: String, default: null },
}, {
  timestamps: true
});

export const ProviderModel = mongoose.model<IProvider>('Provider', ProviderSchema);
