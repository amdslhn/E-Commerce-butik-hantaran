import Link from "next/link";
import UserMenu from "./UserMenu";
import { getSession } from "@/lib/session";

export default async function Navbar() {
  // Membaca cookie untuk mengecek apakah user sudah login
  const session = await getSession();
  const userName = session?.user_name;
  const isLoggedIn = !!userName;

  // Mengambil huruf pertama dari nama untuk dijadikan Ikon Profil (Inisial)
 const initial = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-stone-200/50 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        {/* Logo Brand */}
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-stone-900 transition hover:opacity-80"
        >
          Butik<span className="text-[#c2652a]">Hantaran</span>
        </Link>

        {/* Menu Navigasi & Autentikasi */}
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="hidden text-sm font-semibold text-[#7a6f69] transition hover:text-[#c2652a] sm:block"
          >
            Katalog
          </Link>
          <div className="h-5 w-px bg-[#d8d0c8] hidden sm:block"></div>{" "}
          {/* Divider */}
          {isLoggedIn ? (
            /* --- TAMPILAN JIKA SUDAH LOGIN --- */
            <UserMenu userName={userName} initial={initial} />
          ) : (
            /* --- TAMPILAN JIKA BELUM LOGIN --- */
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-[#3a302a] transition hover:text-[#c2652a]"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#c2652a] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#a85522] hover:shadow-md"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
