"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";

const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function loginUser(prevState: unknown, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.issues[0].message };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { success: false, error: "Email atau password salah." };
    }

    // Pengecekan status verifikasi sebelum mengecek password
    if (!user.is_verified) {
      // Mengarahkan user kembali ke halaman verifikasi dengan membawa email di URL
      redirect(`/verify?email=${encodeURIComponent(email)}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return { success: false, error: "Email atau password salah." };
    }

    // TODO: Implementasi Session (JWT/NextAuth) diletakkan di sini nantinya.
    // Sementara, kita asumsikan sukses dan redirect ke halaman booking
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Biarkan Next.js menangani redirect
    }
    return { success: false, error: "Terjadi kesalahan sistem." };
  }

  redirect("/booking");
}
