"use client";

import { useActionState, useState } from "react";
import { loginUser } from "@/actions/login";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Mengikuti pola TypeScript yang sama dengan halaman register
type LoginActionState = Awaited<ReturnType<typeof loginUser>>;

const initialState: LoginActionState = {
  success: false,
  error: "",
};

const GOOGLE_ERROR_MAP: Record<string, string> = {
  google_cancelled: "Login dengan Google dibatalkan.",
  google_token_failed: "Gagal mendapatkan token Google. Coba lagi.",
  google_userinfo_failed: "Gagal mengambil data akun Google. Coba lagi.",
  google_server_error: "Terjadi kesalahan server. Coba beberapa saat lagi.",
};


export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<
    LoginActionState,
    FormData
  >(loginUser, initialState);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";
  const googleError = searchParams.get("error");
  const googleErrorMsg = googleError ? GOOGLE_ERROR_MAP[googleError] : null;

  return (
    // Background Warm linen (#faf5ee)
    <div className="min-h-screen flex items-center justify-center bg-[#faf5ee] p-4 font-sans">
      <form
        action={formAction}
        // Card dengan padding luas, border hangat, dan soft shadow
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-[#d8d0c8]/60 w-full max-w-md space-y-6"
      >
        {/* Headline: Garamond-style serif, text warm dark */}
        <h2 className="text-3xl font-serif font-medium text-center text-[#3a302a] tracking-tight mb-2">
          Selamat Datang
        </h2>

        {isVerified && (
          // Success message (Verified) disesuaikan dengan tone hangat
          <div className="p-4 bg-[#f2f7ec] text-[#4a5c3a] border border-[#e0ebd5] rounded-lg text-sm">
            Email berhasil diverifikasi. Silakan login.
          </div>
        )}

        {(state?.error || googleErrorMsg) && (
          // Error message dengan Dusty rose
          <div className="p-4 bg-[#fdf2f2] text-[#8c3c3c] border border-[#f5d8d8] rounded-lg text-sm">
            {state?.error || googleErrorMsg}
          </div>
        )}

        {/* Wrapper input */}
        <div className="space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full bg-white border border-[#d8d0c8] p-3 rounded-lg focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#3a302a] placeholder-[#a39a94] transition-all"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Password (Min. 6 Karakter)"
              className="w-full bg-white border border-[#d8d0c8] p-3 pr-12 rounded-lg focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#3a302a] placeholder-[#a39a94] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a39a94] hover:text-[#c2652a] transition-colors"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Button primary (Burnt sienna) */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 bg-[#c2652a] hover:bg-[#a85522] text-white font-medium py-3.5 rounded-lg disabled:opacity-50 transition-colors shadow-sm"
        >
          {isPending ? "Masuk..." : "Masuk"}
        </button>

        {/* Divider */}
        <div className="relative flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-[#d8d0c8]" />
          <span className="text-xs text-[#a39a94] font-medium">atau</span>
          <div className="flex-1 h-px bg-[#d8d0c8]" />
        </div>

        {/* Tombol Google */}
        <a
          href="/api/auth/google"
          className="flex items-center justify-center gap-3 w-full border border-[#d8d0c8] bg-white hover:bg-[#faf5ee] text-[#3a302a] font-medium py-3.5 rounded-lg transition-colors shadow-sm"
        >
          <GoogleIcon />
          Masuk dengan Google
        </a>

        <p className="text-center text-sm mt-2 text-[#7a6f69]">
          Belum punya akun?{" "}
          <Link
            href="/register"
            // Teks link menggunakan warna primary dengan underline saat di-hover
            className="text-[#c2652a] font-medium hover:underline underline-offset-4"
          >
            Daftar sekarang
          </Link>
        </p>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12.a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}
