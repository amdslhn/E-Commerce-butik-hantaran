import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/BookingForm";
import { getSession } from "@/lib/session";
import Link from "next/link";

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

  const myBookings = session?.user_id
    ? await prisma.booking.findMany({
        where: { user_id: session.user_id },
        include: {
          service: {
            select: {
              nama_desain: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
        take: 6,
      })
    : [];

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

      {/* Render Client Component dan Passing Data (Props) */}
      <div className="space-y-8">
        <BookingForm
          services={activeServices}
          userId={bookingUserId}
          isWOUser={isWOUser}
        />

        {myBookings.length > 0 && (
          <section className="mx-auto max-w-3xl rounded-2xl border border-[#d8d0c8]/60 bg-white p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-serif font-semibold text-[#3a302a]">
                Pesanan Saya
              </h2>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                Klik untuk lihat detail
              </span>
            </div>

            <div className="space-y-3">
              {myBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/booking/${booking.id}`}
                  className="block rounded-xl border border-[#d8d0c8]/50 bg-[#faf5ee] p-4 transition hover:border-[#c2652a] hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[#3a302a]">
                        Booking #{booking.id} - {booking.service.nama_desain}
                      </p>
                      <p className="mt-1 text-xs text-[#7a6f69]">
                        Acara:{" "}
                        {new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "medium",
                        }).format(booking.event_date)}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f2f7ec] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#4a5c3a]">
                      {booking.status_booking}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
