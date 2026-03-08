-- AlterTable
ALTER TABLE "project" ADD COLUMN     "status_id" TEXT;

-- CreateTable
CREATE TABLE "project_responsible" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT DEFAULT 'Lead',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_responsible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_status" (
    "status_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT DEFAULT '#3b82f6',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_status_pkey" PRIMARY KEY ("status_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_responsible_project_id_user_id_key" ON "project_responsible"("project_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_status_name_key" ON "project_status"("name");

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "project_status"("status_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_responsible" ADD CONSTRAINT "project_responsible_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_responsible" ADD CONSTRAINT "project_responsible_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
