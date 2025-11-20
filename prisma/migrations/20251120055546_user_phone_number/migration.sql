/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deleted` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Users" ADD COLUMN     "deleted" BOOLEAN NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_phoneNumber_key" ON "public"."Users"("phoneNumber");
