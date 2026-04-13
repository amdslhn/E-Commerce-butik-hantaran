"use client";

import { useActionState } from "react";
import { verifyOTP } from "@/actions/verify";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const [state, formAction, isPending] = useActionState(verifyOTP, {
    success: false,
    error: "",
  });
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        action={formAction}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Verifikasi Email
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Masukkan 6 digit kode OTP yang kami kirimkan ke email Anda.
        </p>

        {state?.error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {state.error}
          </div>
        )}

        <input
          type="email"
          name="email"
          defaultValue={emailParam}
          required
          placeholder="Email Anda"
          className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
          readOnly={!!emailParam}
        />
        <input
          type="text"
          name="otp"
          maxLength={6}
          required
          placeholder="Contoh: 123456"
          className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest text-lg font-semibold"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
        >
          {isPending ? "Memverifikasi..." : "Verifikasi Sekarang"}
        </button>
      </form>
    </div>
  );
}
