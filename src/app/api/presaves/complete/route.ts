import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { spotifyApi, appleMusicApi } from '@/lib/streamingServices';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { songId, dspId } = await request.json();

    // Find all pending presaves for this song
    const presaves = await prisma.presave.findMany({
      where: {
        songTitle: songId,
        status: 'PENDING'
      },
      include: {
        userTokens: true
      }
    });

    // Process each presave
    for (const presave of presaves) {
      try {
        let success = false;

        // Add to user's library based on their streaming service
        if (presave.streamingService === 'spotify' && presave.userTokens?.spotifyToken) {
          success = await spotifyApi.preSaveTrack(dspId, presave.userTokens.spotifyToken);
        } else if (presave.streamingService === 'apple' && presave.userTokens?.appleMusicToken) {
          success = await appleMusicApi.preSaveTrack(dspId, presave.userTokens.appleMusicToken);
        }

        // Update presave status
        await prisma.presave.update({
          where: { id: presave.id },
          data: {
            status: success ? 'COMPLETED' : 'FAILED'
          }
        });
      } catch (error) {
        console.error(`Error processing presave ${presave.id}:`, error);
        await prisma.presave.update({
          where: { id: presave.id },
          data: { status: 'FAILED' }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing presaves:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to complete presaves' },
      { status: 500 }
    );
  }
} 