import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const presaves = await prisma.presave.findMany({
      include: {
        userTokens: {
          select: {
            spotifyToken: true,
            appleMusicToken: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ presaves });
  } catch (error) {
    console.error('Error fetching presaves:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch presaves' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Received presave request');
    
    // Log request headers
    const headers = Object.fromEntries(request.headers.entries());
    console.log('Request headers:', headers);
    
    // Read and log the raw request body
    const rawBody = await request.text();
    console.log('Raw request body:', rawBody);
    
    // Parse the JSON
    let data;
    try {
      data = JSON.parse(rawBody);
      console.log('Parsed request data:', data);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    const requiredFields = ['songTitle', 'artistName', 'userId', 'streamingService'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create or update user tokens
    try {
      // First, create or update user tokens
      const userTokens = await prisma.userStreamingTokens.upsert({
        where: { userId: data.userId },
        update: {
          spotifyToken: data.spotifyToken || null,
          appleMusicToken: data.appleMusicToken || null,
          updatedAt: new Date()
        },
        create: {
          userId: data.userId,
          spotifyToken: data.spotifyToken || null,
          appleMusicToken: data.appleMusicToken || null
        }
      });
      console.log('Created/updated user tokens:', userTokens);

      // Then, create the presave with explicit data structure
      const presaveData = {
        songTitle: data.songTitle,
        artistName: data.artistName,
        releaseDate: data.releaseDate || new Date().toISOString().split('T')[0],
        userId: data.userId,
        streamingService: data.streamingService,
        quizResult: data.quizResult || data.songTitle,
        status: 'PENDING'
      };
      console.log('Creating presave with data:', presaveData);

      const presave = await prisma.presave.create({
        data: presaveData
      });
      console.log('Created presave:', presave);

      return NextResponse.json({ success: true, presave });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Log more details about the error
      if (dbError instanceof Error) {
        console.error('Error name:', dbError.name);
        console.error('Error message:', dbError.message);
        console.error('Error stack:', dbError.stack);
      }
      return NextResponse.json(
        { 
          success: false, 
          error: dbError instanceof Error ? dbError.message : 'Database operation failed',
          details: dbError instanceof Error ? dbError.stack : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in presave route:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process request',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 