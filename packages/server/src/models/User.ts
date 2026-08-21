import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  refreshToken?: string;
  voiceSamples: string[];
  voiceProfile?: {
    tone: string;
    avgSentenceLength: number;
    ctaStyle: string;
    emojiFrequency: number;
  };
  preferences: {
    sources: string[];
    digestTime: string;
    emailDigest: boolean;
    openaiKey?: string;
    anthropicKey?: string;
  };
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  refreshToken: { type: String },
  voiceSamples: [{ type: String }],
  voiceProfile: {
    tone: { type: String },
    avgSentenceLength: { type: Number },
    ctaStyle: { type: String },
    emojiFrequency: { type: Number },
  },
  preferences: {
    sources: { type: [String], default: ['github', 'hackernews'] },
    digestTime: { type: String, default: '09:00' },
    emailDigest: { type: Boolean, default: false },
    openaiKey: { type: String },
    anthropicKey: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', userSchema);
