import mongoose, { Document, Schema } from 'mongoose';
import { IChallenge } from '../types';

export interface ChallengeDocument extends IChallenge, Document {}

const ChallengeSchema = new Schema<ChallengeDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    xpReward: {
      type: Number,
      required: true,
      min: 1,
      max: 1000,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    criteria: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
ChallengeSchema.index({ difficulty: 1 });
ChallengeSchema.index({ xpReward: -1 });
ChallengeSchema.index({ createdAt: -1 });

export const Challenge = mongoose.model<ChallengeDocument>('Challenge', ChallengeSchema);
