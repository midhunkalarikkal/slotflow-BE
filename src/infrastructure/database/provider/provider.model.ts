import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProvider extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  profileImage: string;
  addressId: Types.ObjectId;
  serviceId: Types.ObjectId;
  subscription: [Types.ObjectId];
  isBlocked: boolean;
  isVerified: boolean
}

const ProviderSchema = new Schema<IProvider>({
  username: { type: String, required: true, minlength: 4, maxlength: 25, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  phone: { type: String, default: null, minlength: 13, maxlength: 13 },
  profileImage: { type: String, default: null },
  addressId: { type: Schema.Types.ObjectId, ref: "Address", default: null },
  serviceId: { type: Schema.Types.ObjectId, ref: "Service", default: null},
  subscription: { type: [Schema.Types.ObjectId], ref: "Subscription", default: null},
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const ProviderModel = mongoose.model<IProvider>('Provider', ProviderSchema);
