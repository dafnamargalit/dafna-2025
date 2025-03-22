/*
  Warnings:

  - Added the required column `quizResult` to the `Presave` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streamingService` to the `Presave` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Presave" ADD COLUMN     "quizResult" TEXT NOT NULL,
ADD COLUMN     "streamingService" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Presave_userId_idx" ON "Presave"("userId");

-- CreateIndex
CREATE INDEX "UserStreamingTokens_userId_idx" ON "UserStreamingTokens"("userId");
