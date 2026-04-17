import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session || !session.user_id) {
    redirect("/login");
  }

  // Ambil data user dari database
  const user = await prisma.user.findUnique({
    where: { id: session.user_id },
    select: { nama: true, email: true, created_at: true },
  });

  if (!user) {
    redirect("/login");
  }

  // Formatting Tanggal Dibuat (contoh: 12 April 2024)
  const createdDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(user.created_at);

  // Menghitung umur akun dalam hari
  const diffTime = Math.abs(new Date().getTime() - user.created_at.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let accountAge = "";
  if (diffDays === 0) accountAge = "Baru saja bergabung hari ini";
  else if (diffDays < 30) accountAge = `${diffDays} hari yang lalu`;
  else if (diffDays < 365)
    accountAge = `${Math.floor(diffDays / 30)} bulan yang lalu`;
  else accountAge = `${Math.floor(diffDays / 365)} tahun yang lalu`;

  const initial = user.nama.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#faf5ee] py-20 px-6 font-sans">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-serif font-medium text-[#3a302a] tracking-tight mb-8">
          Profil Saya
        </h1>

        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-[#d8d0c8]/60">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-10">
            {/* Foto Profil (Inisial) */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#faf5ee] text-4xl font-serif text-[#c2652a] ring-4 ring-white shadow-md border border-[#d8d0c8]/50">
              {initial}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-bold text-[#3a302a]">{user.nama}</h2>
              <p className="text-[#7a6f69] flex items-center justify-center sm:justify-start gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 pt-8 border-t border-[#d8d0c8]/50">
            {/* Kapan Dibuat */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                Terdaftar Sejak
              </p>
              <p className="text-lg font-medium text-[#3a302a]">
                {createdDate}
              </p>
            </div>

            {/* Lama Akun */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                Lama Bergabung
              </p>
              <p className="text-lg font-medium text-[#3a302a]">{accountAge}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
