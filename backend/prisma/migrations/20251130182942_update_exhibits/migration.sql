-- DropForeignKey
ALTER TABLE "Exhibit" DROP CONSTRAINT "Exhibit_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Exhibit" DROP CONSTRAINT "Exhibit_updatedById_fkey";

-- AlterTable
ALTER TABLE "Exhibit" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdById" DROP NOT NULL,
ALTER COLUMN "updatedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Exhibit" ADD CONSTRAINT "Exhibit_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exhibit" ADD CONSTRAINT "Exhibit_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
