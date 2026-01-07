/*
  Warnings:

  - You are about to drop the column `additionalQuestion` on the `EssaySpecificQuestions` table. All the data in the column will be lost.
  - You are about to drop the column `changeInSchoolOrCommunity` on the `EssaySpecificQuestions` table. All the data in the column will be lost.
  - You are about to drop the column `failureExperience` on the `EssaySpecificQuestions` table. All the data in the column will be lost.
  - You are about to drop the `EssayNarrative` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EssayNarrative" DROP CONSTRAINT "EssayNarrative_userProfileId_fkey";

-- AlterTable
ALTER TABLE "EssaySpecificQuestions" DROP COLUMN "additionalQuestion",
DROP COLUMN "changeInSchoolOrCommunity",
DROP COLUMN "failureExperience",
ADD COLUMN     "communityChangeIdea" TEXT,
ADD COLUMN     "failureStory" TEXT,
ADD COLUMN     "influentialPerson" TEXT,
ADD COLUMN     "mistakeAndLesson" TEXT;

-- DropTable
DROP TABLE "EssayNarrative";
