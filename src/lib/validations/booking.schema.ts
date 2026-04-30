import { z } from "zod";

const nullableOptionalString = z.preprocess(
  (value) => (value === null || value === undefined ? undefined : value),
  z.string().trim().optional(),
);

export const BookingSchema = z.object({
  user_id: z.coerce
    .number()
    .positive({ message: "Sesi tidak valid, harap login kembali." }),
  service_id: z.coerce
    .number()
    .positive({ message: "Pilih layanan desain terlebih dahulu." }),
  event_date: z
    .string()
    .min(10, { message: "Format tanggal wajib diisi (YYYY-MM-DD)." }),
  jumlah_box: z.coerce
    .number()
    .min(1, { message: "Minimal penyewaan adalah 1 box." })
    .max(70, { message: "Kapasitas maksimal sistem adalah 70 box." }),
  // --- TAMBAHAN BARU ---
  nama_pengantin_pria: z
    .string()
    .min(2, { message: "Nama pengantin pria wajib diisi (minimal 2 huruf)." }),
  nama_pengantin_wanita: z.string().min(2, {
    message: "Nama pengantin wanita wajib diisi (minimal 2 huruf).",
  }),
  catatan_tambahan: nullableOptionalString, // Boleh kosong
  nama_klien_wo: nullableOptionalString,
});

export type BookingInput = z.infer<typeof BookingSchema>;
