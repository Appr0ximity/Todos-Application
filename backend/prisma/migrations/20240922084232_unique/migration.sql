/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Type` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Type_type_key" ON "Type"("type");
