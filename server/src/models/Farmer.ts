import mongoose, { Document, Schema } from 'mongoose';
import { IFarmer } from '../types';

export interface FarmerDocument extends IFarmer, Document {}

const FarmerSchema = new Schema<FarmerDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    village: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    region: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    ecoScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    badges: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
FarmerSchema.index({ region: 1, village: 1 });
FarmerSchema.index({ xp: -1 });
FarmerSchema.index({ ecoScore: -1 });

// Virtual for farmer level based on XP
FarmerSchema.virtual('level').get(function (this: FarmerDocument) {
  return Math.floor(this.xp / 100) + 1;
});

export const Farmer = mongoose.model<FarmerDocument>('Farmer', FarmerSchema);
