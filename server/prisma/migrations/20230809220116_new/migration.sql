/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[uid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "JobUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "resume_file" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "years_exp" DOUBLE PRECISION,
    "visa_sponsorship_required" BOOLEAN,
    "work_visa_held" TEXT,
    "open_to_relocation" BOOLEAN,
    "linkedin_url" TEXT,
    "github_url" TEXT,
    "personal_website" TEXT,
    "security_clearance" TEXT,

    CONSTRAINT "JobUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkill" (
    "id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobUserToUserSkill" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "JobUser_email_key" ON "JobUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_JobUserToUserSkill_AB_unique" ON "_JobUserToUserSkill"("A", "B");

-- CreateIndex
CREATE INDEX "_JobUserToUserSkill_B_index" ON "_JobUserToUserSkill"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- AddForeignKey
ALTER TABLE "_JobUserToUserSkill" ADD CONSTRAINT "_JobUserToUserSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "JobUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobUserToUserSkill" ADD CONSTRAINT "_JobUserToUserSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "UserSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
