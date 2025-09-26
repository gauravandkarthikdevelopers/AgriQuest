import mongoose, { Document, Schema } from 'mongoose';
import { ICropScan } from '../types';

export interface CropScanDocument extends ICropScan, Document {}

const CropScanSchema = new Schema<CropScanDocument>(
  {
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    ecoScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    issues: [{
      type: String,
      trim: true,
    }],
    recommendations: [{
      type: String,
      trim: true,
    }],
    rawAnalysis: {
      type: Schema.Types.Mixed,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
    source: {
      type: String,
      enum: ['gemini', 'fallback'],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
CropScanSchema.index({ farmerId: 1, createdAt: -1 });
CropScanSchema.index({ ecoScore: -1 });
CropScanSchema.index({ source: 1 });

export const CropScan = mongoose.model<CropScanDocument>('CropScan', CropScanSchema);
