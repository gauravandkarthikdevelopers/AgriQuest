import mongoose, { Document, Schema } from 'mongoose';
import { IChallengeCompletion } from '../types';

export interface ChallengeCompletionDocument extends IChallengeCompletion, Document {}

const ChallengeCompletionSchema = new Schema<ChallengeCompletionDocument>(
  {
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved', // Auto-approve for demo
    },
    xpAwarded: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
ChallengeCompletionSchema.index({ farmerId: 1, challengeId: 1 });
ChallengeCompletionSchema.index({ status: 1 });
ChallengeCompletionSchema.index({ createdAt: -1 });

// Compound index to prevent duplicate completions
ChallengeCompletionSchema.index({ farmerId: 1, challengeId: 1 }, { unique: true });

export const ChallengeCompletion = mongoose.model<ChallengeCompletionDocument>('ChallengeCompletion', ChallengeCompletionSchema);
