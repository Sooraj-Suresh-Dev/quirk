import mongoose, { Schema, Document } from 'mongoose';

export interface IMagicLink extends Document {
  token: string;
  email: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const magicLinkSchema = new Schema<IMagicLink>({
  token: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

magicLinkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const MagicLink = mongoose.model<IMagicLink>('MagicLink', magicLinkSchema);
