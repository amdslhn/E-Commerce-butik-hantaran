"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { redirect } from "next/navigation";

// Sterilisasi ketat: Wajib 6 digit, tanpa spasi, hanya angka.
const VerifySchema = z.object({
  email: z.string().email("Email tidak valid"),
  otp: z
    .string()
    .trim()
    .length(6, "OTP harus 6 digit")
    .regex(/^\d+$/, "OTP hanya boleh berisi angka"),
});

export async function verifyOTP(prevState: unknown, formData: FormData) {
  const validatedFields = VerifySchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.issues[0].message };
  }

  const { email, otp } = validatedFields.data;

  try {
    // 1. Cari token berdasarkan email
    // Kita asumsikan token terbaru adalah yang paling valid jika ada duplikasi (meski idealnya tidak ada)
    const dbToken = await prisma.verificationToken.findFirst({
      where: { email },
      orderBy: { id: "desc" },
    });

    if (!dbToken) {
      return {
        success: false,
        error: "Kode OTP tidak ditemukan atau sudah hangus.",
      };
    }

    // 2. Eksekusi Rumus OTP Validation
    const isOtpMatch = otp === dbToken.otp;
    const isNotExpired = new Date() <= dbToken.expires_at;

    if (!isOtpMatch || !isNotExpired) {
      return {
        success: false,
        error: "Kode OTP salah atau sudah kedaluwarsa.",
      };
    }

    // 3. Transaksi Database (Atomic) & Hard Delete
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { email },
        data: { is_verified: true },
      });

      await tx.verificationToken.delete({
        where: { id: dbToken.id },
      });
    });
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: "Terjadi kesalahan internal saat verifikasi.",
    };
  }

  // Redirect harus diletakkan di luar blok try-catch
  redirect("/login?verified=true");
}
