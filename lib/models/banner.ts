import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
    title: string;
    imageUrl: string;
    description?: string;
    link?: string;
    section: 'top' | 'section-1' | 'section-2' | 'section-3';
    order: number;
    updatedAt: Date;
    createdAt: Date;
}

const bannerSchema = new Schema<IBanner>(
    {
        title: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        description: String,
        link: String,
        section: {
            type: String,
            enum: ['top', 'section-1', 'section-2', 'section-3'],
            default: 'top',
            required: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

export const Banner =
    mongoose.models.Banner || mongoose.model<IBanner>('Banner', bannerSchema);
