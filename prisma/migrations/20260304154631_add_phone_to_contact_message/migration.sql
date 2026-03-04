/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `admin_menu` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "contact_message" (
    "message_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "interest" TEXT NOT NULL,
    "dynamic_field" TEXT,
    "project_details" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_message_pkey" PRIMARY KEY ("message_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_menu_title_key" ON "admin_menu"("title");
