import mongoose, { Schema, Document } from 'mongoose';

export interface ITrend extends Document {
  source: 'github' | 'hackernews';
  title: string;
  url: string;
  summary: string;
  tags: string[];
  thumbnailUrl?: string;
  stars?: number;
  forks?: number;
  points?: number;
  comments?: number;
  author?: string;
  createdAt?: string;
  fetchedAt: Date;
  expiresAt: Date;
}

const trendSchema = new Schema<ITrend>({
  source: { type: String, enum: ['github', 'hackernews'], required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  summary: { type: String, default: '' },
  tags: [{ type: String }],
  thumbnailUrl: { type: String },
  stars: { type: Number },
  forks: { type: Number },
  points: { type: Number },
  comments: { type: Number },
  author: { type: String },
  createdAt: { type: String },
  fetchedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, index: { expireAfterSeconds: 604800 } },
});

trendSchema.index({ source: 1, fetchedAt: -1 });

export const Trend = mongoose.model<ITrend>('Trend', trendSchema);
