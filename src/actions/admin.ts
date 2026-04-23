"use server";

import { BookingStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

type MarkGoodsReceivedInput = {
  bookingId: number;
  daftar_barang: string[];
  wo_global_note?: string;
  related_booking_ids?: number[];
};

function toMetadataObject(
  value: Prisma.JsonValue | null,
): Record<string, Prisma.InputJsonValue> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as unknown as Record<string, Prisma.InputJsonValue>;
  }

  return {};
}

export async function markGoodsReceived(input: MarkGoodsReceivedInput) {
  const session = await getSession();

  if (!session || session.user_role !== 3) {
    return {
      success: false,
      error: "Akses ditolak. Hanya admin yang diizinkan.",
    };
  }

  const cleanedItems = input.daftar_barang
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  const globalNote = input.wo_global_note?.trim() ?? "";
  const relatedIds = (input.related_booking_ids ?? []).filter(
    (id) => Number.isInteger(id) && id > 0 && id !== input.bookingId,
  );

  if (cleanedItems.length === 0) {
    return {
      success: false,
      error: "Daftar barang tidak boleh kosong.",
    };
  }

  if (relatedIds.length > 0 && globalNote.length === 0) {
    return {
      success: false,
      error:
        "Isi Catatan Global WO terlebih dahulu jika ingin menerapkan ke booking lain.",
    };
  }

  const targetIds = Array.from(new Set([input.bookingId, ...relatedIds]));

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        id: { in: targetIds },
      },
      select: {
        id: true,
        user_id: true,
        custom_metadata: true,
      },
    });

    const primaryBooking = bookings.find(
      (booking) => booking.id === input.bookingId,
    );

    if (!primaryBooking) {
      return { success: false, error: "Booking utama tidak ditemukan." };
    }

    const sameVendorBookings = bookings.filter(
      (booking) => booking.user_id === primaryBooking.user_id,
    );
    const bookingsToUpdate =
      globalNote.length > 0 ? sameVendorBookings : [primaryBooking];

    await prisma.$transaction(
      bookingsToUpdate.map((booking) => {
        const existingMetadata = toMetadataObject(booking.custom_metadata);
        const updatedMetadata: Record<string, Prisma.InputJsonValue> = {
          ...existingMetadata,
          intake_recorded_at: new Date().toISOString(),
        };

        if (booking.id === input.bookingId) {
          updatedMetadata.items_received = cleanedItems;
        }

        if (globalNote.length > 0) {
          updatedMetadata.wo_global_note = globalNote;
        }

        return prisma.booking.update({
          where: { id: booking.id },
          data: {
            status_booking: BookingStatus.CONFIRMED,
            custom_metadata: updatedMetadata as Prisma.InputJsonObject,
          },
        });
      }),
    );

    revalidatePath("/admin/dashboard");
    revalidatePath("/booking");

    for (const booking of bookingsToUpdate) {
      revalidatePath(`/booking/${booking.id}`);
    }

    return {
      success: true,
      updatedCount: bookingsToUpdate.length,
      skippedRelatedBookingIds: relatedIds.filter(
        (relatedId) =>
          !bookingsToUpdate.some(
            (updatedBooking) => updatedBooking.id === relatedId,
          ),
      ),
    };
  } catch (error) {
    console.error("Error marking goods received:", error);
    return { success: false, error: "Gagal memperbarui status pesanan." };
  }
}
