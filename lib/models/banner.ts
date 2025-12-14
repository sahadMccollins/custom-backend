import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
    title: string;
    imageUrl: string;
    link?: string;
    section: 'top' | 'section-1' | 'section-2' | 'section-3';
    order: number;
    template: string;
    collectionTitle: string;
    collectionImage: string;
    collectionBg: string;
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
        link: {
            type: String,
            default: '',
        },
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
        template: {
            type: String,
            default: 'template1',
            select: true,
        },
        collectionTitle: {
            type: String,
            default: '',
            select: true,
        },
        collectionImage: {
            type: String,
            default: '',
            select: true,
        },
        collectionBg: {
            type: String,
            default: '#f7ed57',
            select: true,
        },
    },
    { timestamps: true, minimize: false, strict: true }
);

export const Banner =
    mongoose.models.Banner || mongoose.model<IBanner>('Banner', bannerSchema);