import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  refreshToken?: string;
  preferences: {
    sources: string[];
    digestTime: string;
    emailDigest: boolean;
    openaiKey?: string;
    anthropicKey?: string;
    preferredProvider?: string;
    preferredModel?: string;
    preferredTemperature?: number;
  };
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  refreshToken: { type: String },
  preferences: {
    sources: { type: [String], default: ['github', 'producthunt'] },
    digestTime: { type: String, default: '10:00' },
    emailDigest: { type: Boolean, default: true },
    openaiKey: { type: String },
    anthropicKey: { type: String },
    preferredProvider: { type: String },
    preferredModel: { type: String },
    preferredTemperature: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', userSchema);
