/*
  Warnings:

  - You are about to drop the `ProfileProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentActivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentAward` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentChallenge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentIdentity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentScholarshipInterest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentVolunteer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentWork` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WritingPreference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileProgress" DROP CONSTRAINT "ProfileProgress_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "StudentActivity" DROP CONSTRAINT "StudentActivity_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "StudentAward" DROP CONSTRAINT "StudentAward_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "StudentChallenge" DROP CONSTRAINT "StudentChallenge_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "StudentIdentity" DROP CONSTRAINT "StudentIdentity_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "StudentScholarshipInterest" DROP CONSTRAINT "StudentScholarshipInterest_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "StudentVolunteer" DROP CONSTRAINT "StudentVolunteer_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "StudentWork" DROP CONSTRAINT "StudentWork_userProfileId_fkey";

-- DropForeignKey
ALTER TABLE "WritingPreference" DROP CONSTRAINT "WritingPreference_userProfileId_fkey";

-- DropTable
DROP TABLE "ProfileProgress";

-- DropTable
DROP TABLE "StudentActivity";

-- DropTable
DROP TABLE "StudentAward";

-- DropTable
DROP TABLE "StudentChallenge";

-- DropTable
DROP TABLE "StudentIdentity";

-- DropTable
DROP TABLE "StudentScholarshipInterest";

-- DropTable
DROP TABLE "StudentVolunteer";

-- DropTable
DROP TABLE "StudentWork";

-- DropTable
DROP TABLE "WritingPreference";
