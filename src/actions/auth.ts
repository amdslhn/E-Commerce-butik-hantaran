"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOTP } from "@/lib/services/email";
import { z } from "zod";

// 1. Skema Validasi
const RegisterSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  no_wa: z.string().optional(),
});

export async function registerUser(prevState: unknown, formData: FormData) {
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.issues[0].message };
  }

  const { nama, email, password, no_wa } = validatedFields.data;

  try {
    // 2. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: "Email sudah terdaftar." };
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Generate OTP (6 Digit Angka)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Kalkulasi Expiration Time (15 Menit)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // 6. Jalankan Transaksi Database
    await prisma.$transaction(async (tx) => {
      // Buat user dengan is_verified: false dan default role_id: 1 (Customer Reguler)
      await tx.user.create({
        data: {
          role_id: 1,
          nama,
          email,
          password_hash: hashedPassword,
          no_wa: no_wa || null,
          is_verified: false,
        },
      });

      // Simpan OTP
      await tx.verificationToken.create({
        data: {
          email,
          otp: otpCode,
          expires_at: expiresAt,
        },
      });
    });

    // 7. Kirim Email
    const emailResult = await sendOTP(email, otpCode);
    if (!emailResult.success) {
      console.warn(
        "User dibuat, tapi email gagal terkirim:",
        emailResult.error,
      );
      // Bisa handle fallback disini, tapi untuk MVP kita lanjutkan
    }

    return {
      success: true,
      message: "Registrasi berhasil! Cek email untuk kode OTP.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Terjadi kesalahan sistem.",
    };
  }
}
