-- CreateTable
CREATE TABLE "Presave" (
    "id" TEXT NOT NULL,
    "songTitle" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserStreamingTokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spotifyToken" TEXT,
    "appleMusicToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStreamingTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStreamingTokens_userId_key" ON "UserStreamingTokens"("userId");

-- AddForeignKey
ALTER TABLE "Presave" ADD CONSTRAINT "Presave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserStreamingTokens"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
