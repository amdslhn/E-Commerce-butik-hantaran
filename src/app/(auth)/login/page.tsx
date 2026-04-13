"use client";

import { useActionState } from "react";
import { loginUser } from "@/actions/login";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, {
    success: false,
    error: "",
  });
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        action={formAction}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Selamat Datang
        </h2>

        {isVerified && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
            Email berhasil diverifikasi. Silakan login.
          </div>
        )}
        {state?.error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {state.error}
          </div>
        )}

        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
        >
          {isPending ? "Masuk..." : "Masuk"}
        </button>

        <p className="text-center text-sm mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </form>
    </div>
  );
}
