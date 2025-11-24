// import { connectDB } from '@/lib/db';
// import { Banner } from '@/lib/models/banner';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();
//     const section = request.nextUrl.searchParams.get('section');

//     const query = section ? { section } : {};
//     const banners = await Banner.find(query).sort({ order: 1 });
//     return NextResponse.json(banners);
//   } catch (error) {
//     console.error('Error fetching banners:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch banners' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
//     const body = await request.json();

//     const banner = await Banner.create(body);
//     return NextResponse.json(banner);
//   } catch (error) {
//     console.error('Error creating banner:', error);
//     return NextResponse.json(
//       { error: 'Failed to create banner' },
//       { status: 500 }
//     );
//   }
// }
