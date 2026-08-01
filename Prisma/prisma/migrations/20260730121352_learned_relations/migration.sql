/*
  Warnings:

  - You are about to drop the column `notificationMethods` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "notificationMethods";

-- CreateTable
CREATE TABLE "NotificationMethods" (
    "id" SERIAL NOT NULL,
    "phone" INTEGER NOT NULL,
    "email" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "NotificationMethods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BlogToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationMethods_userId_key" ON "NotificationMethods"("userId");

-- CreateIndex
CREATE INDEX "_BlogToCategory_B_index" ON "_BlogToCategory"("B");

-- AddForeignKey
ALTER TABLE "NotificationMethods" ADD CONSTRAINT "NotificationMethods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToCategory" ADD CONSTRAINT "_BlogToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToCategory" ADD CONSTRAINT "_BlogToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
