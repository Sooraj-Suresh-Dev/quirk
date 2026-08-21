import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  trendId?: mongoose.Types.ObjectId;
  content: string | Record<string, unknown>[];
  type: 'text' | 'carousel' | 'image-prompt';
  status: 'generated' | 'copied' | 'posted';
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  trendId: { type: Schema.Types.ObjectId, ref: 'Trend' },
  content: { type: Schema.Types.Mixed, required: true },
  type: { type: String, enum: ['text', 'carousel', 'image-prompt'], required: true },
  status: { type: String, enum: ['generated', 'copied', 'posted'], default: 'generated' },
  createdAt: { type: Date, default: Date.now },
});

postSchema.index({ userId: 1, createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
