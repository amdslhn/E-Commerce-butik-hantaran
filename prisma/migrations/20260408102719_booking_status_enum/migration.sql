/*
  Warnings:

  - The `status_booking` column on the `bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "status_booking",
ADD COLUMN     "status_booking" "BookingStatus" NOT NULL DEFAULT 'PENDING';
