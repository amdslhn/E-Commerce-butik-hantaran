"use server";

import { prisma } from "@/lib/prisma";
import { checkAvailability } from "@/lib/inventory";
import { calculateBookingDates } from "@/lib/dates";
import { BookingSchema } from "@/lib/validations/booking.schema";
import { Prisma, BookingStatus } from "@prisma/client";
import { getSession } from "@/lib/session";

const rateLimitCache = new Map<number, number>();
const RATE_LIMIT_WINDOW_MS = 3000;

export async function checkoutBooking(prevState: unknown, formData: FormData) {

  const session = await getSession();

  if (!session || !session.user_id) {
    return {
      success: false,
      error: "Sesi telah habis. Silakan login kembali.",
    };
  }

  const serverUserId = session.user_id;
  // 1. Tambahkan fields baru ke Zod parser
  const validatedFields = BookingSchema.safeParse({
    user_id: serverUserId,
    service_id: formData.get("service_id"),
    event_date: formData.get("event_date"),
    jumlah_box: formData.get("jumlah_box"),
    nama_pengantin_pria: formData.get("nama_pengantin_pria"),
    nama_pengantin_wanita: formData.get("nama_pengantin_wanita"),
    catatan_tambahan: formData.get("catatan_tambahan"),
  });

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.issues[0].message };
  }

  // 2. Destructure data yang sudah tervalidasi
  const {
    user_id,
    service_id,
    event_date,
    jumlah_box,
    nama_pengantin_pria,
    nama_pengantin_wanita,
    catatan_tambahan,
  } = validatedFields.data;

  // 3. Rate Limiting (MVP)
  const now = Date.now();
  const lastRequestTime = rateLimitCache.get(user_id);
  if (lastRequestTime && now - lastRequestTime < RATE_LIMIT_WINDOW_MS) {
    return {
      success: false,
      error: "Harap tunggu 3 detik sebelum mencoba lagi.",
    };
  }
  rateLimitCache.set(user_id, now);

  try {
    const newBooking = await prisma.$transaction(
      async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: user_id },
          select: { id: true },
        });

        if (!user) {
          throw new Error(
            "User tidak ditemukan. Silakan login ulang atau gunakan akun yang valid.",
          );
        }

        const inventory = await checkAvailability(event_date, jumlah_box, tx);
        if (!inventory.isAvailable) {
          throw new Error(
            `Checkout gagal. Sisa box untuk tanggal tersebut hanya ${inventory.sisaBox} box.`,
          );
        }

        const service = await tx.service.findUnique({
          where: { id: service_id },
          select: { harga_reguler: true },
        });

        if (!service) throw new Error("Layanan desain tidak ditemukan.");

        const calculatedTotalPrice = service.harga_reguler * jumlah_box;
        const { eventDate, dropOffDate, pickUpDate, returnDate } =
          calculateBookingDates(event_date);

        // 4. Masukkan ke database
        const booking = await tx.booking.create({
          data: {
            user_id,
            service_id,
            event_date: eventDate,
            drop_off_date: dropOffDate,
            pick_up_date: pickUpDate,
            return_date: returnDate,
            jumlah_box,
            total_price: calculatedTotalPrice,
            status_booking: BookingStatus.PENDING,
            // --- SIMPAN KE JSONB ---
            custom_metadata: {
              pengantin_pria: nama_pengantin_pria,
              pengantin_wanita: nama_pengantin_wanita,
              catatan: catatan_tambahan || "", // Fallback empty string jika opsional kosong
            },
          },
        });

        return booking;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      },
    );

    return { success: true, data: newBooking };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          success: false,
          error:
            "Data user atau layanan tidak valid (foreign key). Pastikan user_id dan service_id ada di database.",
        };
      }

      if (error.code === "P2034") {
        return {
          success: false,
          error: "Sistem sedang sibuk. Silakan coba lagi.",
        };
      }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Terjadi kesalahan internal." };
  }
}
