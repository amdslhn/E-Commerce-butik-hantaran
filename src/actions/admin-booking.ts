"use server";

import { prisma } from "@/lib/prisma";
import { checkAvailability } from "@/lib/inventory";
import { calculateBookingDates } from "@/lib/dates";
import { BookingStatus } from "@prisma/client";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function createManualBooking(formData: FormData) {
  const session = await getSession();

  // Verifikasi hanya Admin yang bisa melakukan ini
  if (!session || session.user_role !== 3) {
    return { success: false, error: "Akses ditolak. Anda bukan Admin." };
  }

  const service_id = parseInt(formData.get("service_id") as string, 10);
  const event_date = formData.get("event_date") as string;
  const jumlah_box = parseInt(formData.get("jumlah_box") as string, 10);
  const nama_customer = formData.get("nama_customer") as string;

  // --- TAMBAHAN BARU: Tangkap data form ---
  const nama_pengantin_pria = formData.get("nama_pengantin_pria") as string;
  const nama_pengantin_wanita = formData.get("nama_pengantin_wanita") as string;
  const catatan_tambahan = formData.get("catatan_tambahan") as string;

  if (!service_id || !event_date || !jumlah_box || !nama_customer) {
    return { success: false, error: "Semua data form wajib diisi." };
  }

  try {
    const newBooking = await prisma.$transaction(async (tx) => {
      // 1. Validasi Stok (Otomatis menggabungkan pesanan online & offline)
      const inventory = await checkAvailability(
        event_date,
        jumlah_box,
        service_id,
        tx,
      );

      if (!inventory.isAvailable) {
        throw new Error(
          `Stok tidak cukup! Sisa box hanya ${inventory.sisaBox} box (maks tanggal ini: ${inventory.sisaBoxByDate}, sisa aktif saat ini: ${inventory.sisaBoxGlobal}).`,
        );
      }

      const service = await tx.service.findUnique({
        where: { id: service_id },
        select: { harga_reguler: true },
      });

      if (!service) throw new Error("Layanan tidak ditemukan.");

      // 2. Kalkulasi Tanggal (Menerapkan H-3 logic secara otomatis)
      const { eventDate, dropOffDate, pickUpDate, returnDate } =
        calculateBookingDates(event_date);
      const calculatedTotalPrice = service.harga_reguler * jumlah_box;

      // 3. Masukkan ke Database
      const booking = await tx.booking.create({
        data: {
          user_id: session.user_id, // Gunakan ID Admin sebagai pembuat pesanan
          service_id,
          event_date: eventDate,
          drop_off_date: dropOffDate,
          pick_up_date: pickUpDate,
          return_date: returnDate,
          jumlah_box,
          total_price: calculatedTotalPrice,
          status_booking: BookingStatus.CONFIRMED, // LANGSUNG CONFIRMED (Bypass PENDING)

          // Simpan nama pelanggan asli dan data pengantin di Metadata
          custom_metadata: {
            is_offline_booking: true,
            nama_pelanggan_offline: nama_customer,
            pengantin_pria: nama_pengantin_pria,
            pengantin_wanita: nama_pengantin_wanita,
            catatan: catatan_tambahan || "Pesanan masuk via WhatsApp/Offline",
          },
        },
      });

      return booking;
    });

    // Refresh halaman dashboard dan landing page agar stok langsung update
    revalidatePath("/admin/dashboard");
    revalidatePath("/");

    return { success: true, data: newBooking };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}
