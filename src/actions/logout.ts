"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutUser() {
  const cookieStore = await cookies();

  // Hapus cookie JWT yang baru
  cookieStore.delete("session");

  // Hapus cookie mentah yang lama (untuk membersihkan sisa bug sebelumnya)
  cookieStore.delete("user_name");
  cookieStore.delete("user_id");
  cookieStore.delete("user_role");

  redirect("/login");
}
