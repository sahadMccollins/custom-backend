import { connectDB } from '@/lib/db';
import { SplashScreen } from '@/lib/models/splash-screen';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();
        const splashScreen = await SplashScreen.findOne();
        return NextResponse.json(splashScreen || null);
    } catch (error) {
        console.error('Error fetching splash screen:', error);
        return NextResponse.json(
            { error: 'Failed to fetch splash screen' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        let splashScreen = await SplashScreen.findOne();

        if (splashScreen) {
            splashScreen.title = body.title;
            splashScreen.description = body.description;
            splashScreen.imageUrl = body.imageUrl;
            splashScreen.backgroundColor = body.backgroundColor;
            await splashScreen.save();
        } else {
            splashScreen = await SplashScreen.create(body);
        }

        return NextResponse.json(splashScreen);
    } catch (error) {
        console.error('Error updating splash screen:', error);
        return NextResponse.json(
            { error: 'Failed to update splash screen' },
            { status: 500 }
        );
    }
}
