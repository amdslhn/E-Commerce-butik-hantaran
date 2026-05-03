"use server";

import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

// ============================================================================
// State Machine: defines which transitions are legal for each status.
// Key = target status, Value = set of statuses that can transition INTO it.
// ============================================================================
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: [],                          // No status can transition TO pending
  CONFIRMED: [],                        // Handled by markGoodsReceived in admin.ts
  READY: [BookingStatus.CONFIRMED],     // Only CONFIRMED → READY
  PICKED_UP: [BookingStatus.READY],     // Only READY → PICKED_UP
  RETURNED: [BookingStatus.PICKED_UP],  // Only PICKED_UP → RETURNED
  CANCELLED: [BookingStatus.PENDING, BookingStatus.CONFIRMED], // PENDING or CONFIRMED → CANCELLED
};

// Human-readable labels for error messages (Bahasa Indonesia)
const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Terkonfirmasi",
  READY: "Siap Ambil",
  PICKED_UP: "Sudah Diambil",
  RETURNED: "Dikembalikan",
  CANCELLED: "Dibatalkan",
};

type ActionResult = {
  success: boolean;
  message: string;
};

/**
 * overrideBookingStatus — Admin-only Server Action for status transitions.
 *
 * 1. Validates admin session (role_id === 3).
 * 2. Validates that `newStatus` is a valid BookingStatus enum member.
 * 3. Fetches the current booking status from the database.
 * 4. Checks the state machine — only legal transitions are permitted.
 * 5. Updates the database and revalidates the admin dashboard path.
 */
export async function overrideBookingStatus(
  bookingId: number,
  newStatus: BookingStatus,
): Promise<ActionResult> {
  // --- 1. Auth Guard ---
  const session = await getSession();
  if (!session || session.user_role !== 3) {
    return {
      success: false,
      message: "Akses ditolak. Hanya admin yang bisa mengubah status pesanan.",
    };
  }

  // --- 2. Enum Validation ---
  const validStatuses = Object.values(BookingStatus);
  if (!validStatuses.includes(newStatus)) {
    return {
      success: false,
      message: `Status "${String(newStatus)}" tidak valid. Status yang diizinkan: ${validStatuses.join(", ")}.`,
    };
  }

  try {
    // --- 3. Fetch Current Status ---
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, status_booking: true },
    });

    if (!booking) {
      return {
        success: false,
        message: `Booking dengan ID #${bookingId} tidak ditemukan.`,
      };
    }

    const currentStatus = booking.status_booking;

    // --- 4. State Machine Validation ---
    const allowedFrom = ALLOWED_TRANSITIONS[newStatus];

    if (!allowedFrom || !allowedFrom.includes(currentStatus)) {
      return {
        success: false,
        message: `Transisi tidak diizinkan: "${STATUS_LABELS[currentStatus]}" → "${STATUS_LABELS[newStatus]}". Status saat ini harus salah satu dari [${allowedFrom.map((s) => STATUS_LABELS[s]).join(", ") || "-"}] untuk bisa berubah ke "${STATUS_LABELS[newStatus]}".`,
      };
    }

    // --- 5. Update Database ---
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status_booking: newStatus },
    });

    // --- 6. Revalidate Cached Pages ---
    revalidatePath("/admin/dashboard");
    revalidatePath("/booking");

    return {
      success: true,
      message: `Status booking #${bookingId} berhasil diubah: "${STATUS_LABELS[currentStatus]}" → "${STATUS_LABELS[newStatus]}".`,
    };
  } catch (error) {
    console.error("[overrideBookingStatus] Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan internal saat memperbarui status.",
    };
  }
}
