"use client";

import { useActionState } from "react";
import { registerUser } from "@/actions/auth";
import Link from "next/link";

type RegisterActionState = Awaited<ReturnType<typeof registerUser>>;

const initialState: RegisterActionState = {
  success: false,
  error: "",
};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState<
    RegisterActionState,
    FormData
  >(registerUser, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        action={formAction}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Daftar Akun
        </h2>

        {state?.error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {state.error}
          </div>
        )}
        {state?.success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
            {state.message}
          </div>
        )}

        <input
          type="text"
          name="nama"
          required
          placeholder="Nama Lengkap"
          className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="text"
          name="no_wa"
          placeholder="Nomor WhatsApp (Opsional)"
          className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password (Min. 6 Karakter)"
          className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          disabled={isPending || state?.success}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
        >
          {isPending ? "Memproses..." : "Daftar Sekarang"}
        </button>

        <p className="text-center text-sm mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
