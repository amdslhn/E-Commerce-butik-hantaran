import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/BookingForm";
import { getSession } from "@/lib/session";
import Link from "next/link";
import CustomerPortalTabs from "@/components/CustomerPortalTabs";

export const metadata = {
  title: "Booking Hantaran | Butik Hantaran Pekanbaru",
  description: "Pesan box hantaran eksklusif tanpa DP di Pekanbaru.",
};

export default async function BookingPage() {
  const session = await getSession();

  // Langsung fetch dari DB (Server-Side)
  // Hanya ambil layanan yang sedang aktif
  const activeServices = await prisma.service.findMany({
    where: {
      is_active: true,
    },
    select: {
      id: true,
      nama_desain: true,
      harga_reguler: true,
      harga_wo: true,
    },
  });

  // Untuk mode tanpa auth penuh, ambil user pertama sebagai tester agar FK user_id valid.
  const fallbackUser = await prisma.user.findFirst({
    select: { id: true },
    orderBy: { id: "asc" },
  });

  let isWOUser = false;
  if (session?.user_id) {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user_id },
      select: {
        role_id: true,
        role: {
          select: {
            nama_role: true,
          },
        },
      },
    });

    if (currentUser) {
      const roleName = currentUser.role.nama_role.toLowerCase();
      isWOUser =
        currentUser.role_id === 2 ||
        roleName.includes("wo") ||
        roleName.includes("wedding");
    }
  }

  const bookingUserId = session?.user_id ?? fallbackUser?.id ?? null;

  return (
    <main className="min-h-screen bg-[#faf5ee] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold text-[#3a302a] sm:text-5xl">
          Sewa Box Hantaran
        </h1>
        <p className="mt-4 text-lg text-[#7a6f69]">
          Lengkapi momen bahagiamu. Pilih desain, tentukan tanggal, kami yang
          urus sisanya.
        </p>
      </div>

      <CustomerPortalTabs activeTab="booking" />

      {/* Render Client Component dan Passing Data (Props) */}
      <div className="space-y-8">
        <BookingForm
          services={activeServices}
          userId={bookingUserId}
          isWOUser={isWOUser}
        />

        <section className="mx-auto max-w-3xl rounded-2xl border border-[#d8d0c8]/60 bg-white p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
          <h2 className="font-serif text-xl font-semibold text-[#3a302a]">
            Mau cek status pesanan?
          </h2>
          <p className="mt-2 text-sm text-[#7a6f69]">
            Tracking status sudah dipindah ke tab khusus supaya Anda bisa lihat
            pesanan yang sudah di-ACC dan yang masih menunggu tanpa buka form
            booking lagi.
          </p>

          <Link
            href="/pesanan"
            className="mt-4 inline-flex rounded-xl bg-[#c2652a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a85522]"
          >
            Buka Tracking Pesanan
          </Link>
        </section>
      </div>
    </main>
  );
}
