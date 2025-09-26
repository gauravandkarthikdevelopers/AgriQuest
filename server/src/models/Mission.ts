import mongoose, { Document, Schema } from 'mongoose';
import { IMission, IMissionNode, IMissionChoice } from '../types';

export interface MissionDocument extends IMission, Document {}

const MissionChoiceSchema = new Schema<IMissionChoice>({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  scoreImpact: {
    type: Number,
    required: true,
    min: -20,
    max: 20,
  },
  desc: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300,
  },
}, { _id: false });

const MissionNodeSchema = new Schema<IMissionNode>({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  choices: [MissionChoiceSchema],
}, { _id: false });

const MissionSchema = new Schema<MissionDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    nodes: [MissionNodeSchema],
    xpReward: {
      type: Number,
      required: true,
      min: 10,
      max: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
MissionSchema.index({ xpReward: -1 });
MissionSchema.index({ createdAt: -1 });

export const Mission = mongoose.model<MissionDocument>('Mission', MissionSchema);
