import mongoose, { Schema, Document } from 'mongoose';

export interface IVoice extends Document {
  userId: mongoose.Types.ObjectId;
  samples: string[];
  profile: {
    tone: {
      primary: string;
      secondary: string[];
      confidence: number;
    };
    writingStyle: {
      description: string;
      avgSentenceLength: number;
      avgParagraphLength: number;
    };
    personality: {
      traits: string[];
      description: string;
    };
    structure: {
      description: string;
      pattern: string[];
    };
    engagement: {
      cta: 'None' | 'Soft' | 'Direct';
      questions: 'None' | 'Rare' | 'Occasional' | 'Frequent';
      emoji: 'None' | 'Low' | 'Medium' | 'High';
      emojiFrequency: number;
    };
    signaturePatterns: string[];
    contentPatterns?: {
      topics: string[];
      audienceType: string;
    };
    generation?: {
      formality: 'Formal' | 'Professional' | 'Casual';
      energy: 'Low' | 'Medium' | 'High';
      firstPersonUsage: 'Minimal' | 'Moderate' | 'Frequent';
      sentenceComplexity: 'Simple' | 'Medium' | 'Complex';
      vocabulary: 'Simple' | 'Simple-Technical Mix' | 'Technical' | 'Advanced';
      evidenceUsage: 'None' | 'Low' | 'Medium' | 'High';
      opinionStrength: 'Neutral' | 'Moderate' | 'Strong';
    };
    brandSummary: string;
    trainingQuality: {
      score: number;
      consistency: string;
      limitations: string[];
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const voiceSchema = new Schema<IVoice>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  samples: [{ type: String }],
  profile: {
    tone: {
      primary: { type: String },
      secondary: [{ type: String }],
      confidence: { type: Number },
    },
    writingStyle: {
      description: { type: String },
      avgSentenceLength: { type: Number },
      avgParagraphLength: { type: Number },
    },
    personality: {
      traits: [{ type: String }],
      description: { type: String },
    },
    structure: {
      description: { type: String },
      pattern: [{ type: String }],
    },
    engagement: {
      cta: { type: String, enum: ['None', 'Soft', 'Direct'] },
      questions: { type: String, enum: ['None', 'Rare', 'Occasional', 'Frequent'] },
      emoji: { type: String, enum: ['None', 'Low', 'Medium', 'High'] },
      emojiFrequency: { type: Number },
    },
    signaturePatterns: [{ type: String }],
    contentPatterns: {
      topics: [{ type: String }],
      audienceType: { type: String },
    },
    generation: {
      formality: { type: String, enum: ['Formal', 'Professional', 'Casual'] },
      energy: { type: String, enum: ['Low', 'Medium', 'High'] },
      firstPersonUsage: { type: String, enum: ['Minimal', 'Moderate', 'Frequent'] },
      sentenceComplexity: { type: String, enum: ['Simple', 'Medium', 'Complex'] },
      vocabulary: { type: String, enum: ['Simple', 'Simple-Technical Mix', 'Technical', 'Advanced'] },
      evidenceUsage: { type: String, enum: ['None', 'Low', 'Medium', 'High'] },
      opinionStrength: { type: String, enum: ['Neutral', 'Moderate', 'Strong'] },
    },
    brandSummary: { type: String },
    trainingQuality: {
      score: { type: Number },
      consistency: { type: String },
      limitations: [{ type: String }],
    },
  },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

voiceSchema.pre('validate', function (next) {
  // Normalize enum values to proper case
  if (this.profile?.engagement) {
    const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
    if (this.profile.engagement.cta) {
      (this.profile as any).engagement.cta = capitalize((this.profile.engagement as any).cta);
    }
    if (this.profile.engagement.emoji) {
      (this.profile as any).engagement.emoji = capitalize((this.profile.engagement as any).emoji);
    }
    if (this.profile.engagement.questions) {
      (this.profile as any).engagement.questions = capitalize((this.profile.engagement as any).questions);
    }
  }
  this.updatedAt = new Date();
  next();
});

export const Voice = mongoose.model<IVoice>('Voice', voiceSchema);
