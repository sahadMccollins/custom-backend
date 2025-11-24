import mongoose, { Schema, Document } from 'mongoose';

export interface ISplashScreen extends Document {
  title: string;
  mediaUrl: string;
  mediaType: 'image' | 'gif' | 'video';
  duration: number;
  backgroundColor: string;
  updatedAt: Date;
  createdAt: Date;
}

const splashScreenSchema = new Schema<ISplashScreen>(
  {
    title: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'gif', 'video'],
      default: 'image',
    },
    duration: {
      type: Number,
      default: 5,
      min: 1,
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
  },
  { timestamps: true }
);

export const SplashScreen =
  mongoose.models.SplashScreen ||
  mongoose.model<ISplashScreen>('SplashScreen', splashScreenSchema);
