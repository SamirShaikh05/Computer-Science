/*
  Warnings:

  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - A unique constraint covering the columns `[name,age]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE INDEX "User_name_age_isActive_idx" ON "User"("name", "age", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_age_key" ON "User"("name", "age");
