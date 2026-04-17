"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/session";

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
  let targetPath = "/"; // Default path untuk customer

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { success: false, error: "Email atau password salah." };
    }

    if (!user.is_verified) {
      redirect(`/verify?email=${encodeURIComponent(email)}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return { success: false, error: "Email atau password salah." };
    }

    // --- LOGIKA ROLE-BASED REDIRECT ---
    // Asumsi: role_id 1 = Customer, role_id 3 = Admin
    if (user.role_id === 3) {
      targetPath = "/admin/dashboard";
    }

    const sessionData = {
      user_id: user.id,
      user_name: user.nama,
      user_role: user.role_id,
    };

    // 2. Enkripsi datanya
    const encryptedSession = await encrypt(sessionData);

    // 3. Simpan ke SATU cookie bernama 'session'
    const cookieStore = await cookies();
    cookieStore.set("session", encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: "/",
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return { success: false, error: "Terjadi kesalahan sistem." };
  }

  redirect(targetPath); // Pindah ke halaman yang sesuai
}
