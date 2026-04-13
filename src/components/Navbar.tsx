import Link from "next/link";

export default function Navbar() {
  // TODO: Di Sprint berikutnya, variabel ini akan diambil dari Session Cookies (JWT / NextAuth)
  const isLoggedIn = false;

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-stone-200/50 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        {/* Logo Brand */}
        <Link
          href="/"
          className="text-xl font-black tracking-tighter text-stone-900 transition hover:opacity-80"
        >
          Butik<span className="text-orange-600">Hantaran</span>
        </Link>

        {/* Menu Navigasi & Autentikasi */}
        <div className="flex items-center gap-5">
          {/* Link yang selalu muncul */}
          <Link
            href="/"
            className="hidden text-sm font-semibold text-stone-600 transition hover:text-stone-900 sm:block"
          >
            Katalog
          </Link>
          <div className="h-5 w-px bg-stone-300 hidden sm:block"></div>{" "}
          {/* Divider */}
          {isLoggedIn ? (
            /* Tampilan jika SUDAH Login (Profile Icon) */
            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-700 hover:shadow-md"
              title="Profil Saya"
            >
              P {/* Nanti ini diganti dengan inisial user dari database */}
            </Link>
          ) : (
            /* Tampilan jika BELUM Login (Masuk & Daftar) */
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-stone-700 transition hover:text-stone-900"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-700 hover:shadow-md"
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
