import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Find all UserStreamingTokens that don't have any associated presaves
    const orphanedTokens = await prisma.userStreamingTokens.findMany({
      where: {
        presaves: {
          none: {} // This means no presaves exist
        }
      }
    });

    console.log(`Found ${orphanedTokens.length} orphaned user tokens`);

    // Delete the orphaned tokens
    const deleteResult = await prisma.userStreamingTokens.deleteMany({
      where: {
        presaves: {
          none: {}
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleteResult.count} orphaned user tokens`,
      deletedTokens: orphanedTokens
    });
  } catch (error) {
    console.error('Error cleaning up orphaned tokens:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clean up orphaned tokens',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 