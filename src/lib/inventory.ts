// src/lib/inventory.ts
import { prisma } from "@/lib/prisma";
import { Prisma, BookingStatus } from "@prisma/client";
import { calculateBookingDates } from "./dates";

export const MAX_BOX_CAPACITY = 70;
const NON_BLOCKING_STATUSES: BookingStatus[] = [
  BookingStatus.CANCELLED,
  BookingStatus.RETURNED,
];

export async function checkAvailability(
  eventDateIso: string,
  requestedBoxes: number,
  db: Prisma.TransactionClient = prisma,
) {
  // Gunakan helper sentral
  const { dropOffDate, returnDate } = calculateBookingDates(eventDateIso);

  const overlappingBookings = await db.booking.aggregate({
    _sum: {
      jumlah_box: true,
    },
    where: {
      status_booking: {
        notIn: NON_BLOCKING_STATUSES,
      },
      drop_off_date: { lte: returnDate },
      return_date: { gte: dropOffDate },
    },
  });

  const totalBooked = overlappingBookings._sum.jumlah_box || 0;
  const sisaBox = MAX_BOX_CAPACITY - totalBooked;

  return {
    isAvailable: sisaBox >= requestedBoxes,
    sisaBox: sisaBox,
    totalBooked: totalBooked,
  };
}

export async function getCurrentInventory(
  db: Prisma.TransactionClient = prisma,
) {
  const openBookings = await db.booking.aggregate({
    _sum: {
      jumlah_box: true,
    },
    where: {
      status_booking: {
        notIn: NON_BLOCKING_STATUSES,
      },
    },
  });

  const totalBooked = openBookings._sum.jumlah_box || 0;
  const sisaBox = Math.max(0, MAX_BOX_CAPACITY - totalBooked);

  return {
    sisaBox,
    totalBooked,
    maxCapacity: MAX_BOX_CAPACITY,
  };
}
