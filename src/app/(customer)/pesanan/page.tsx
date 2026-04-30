import Link from "next/link";
import { redirect } from "next/navigation";
import { BookingStatus } from "@prisma/client";
import CustomerPortalTabs from "@/components/CustomerPortalTabs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Tracking Pesanan | Butik Hantaran Pekanbaru",
  description: "Lihat status pesanan Anda: sudah di-ACC atau masih menunggu.",
};

type TrackingFilter = "all" | "approved" | "pending" | "cancelled";

const APPROVED_STATUSES: BookingStatus[] = [
  BookingStatus.CONFIRMED,
  BookingStatus.READY,
  BookingStatus.PICKED_UP,
  BookingStatus.RETURNED,
];

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "Menunggu Konfirmasi",
  CONFIRMED: "Sudah Di-ACC",
  READY: "Siap Diambil",
  PICKED_UP: "Sudah Diambil",
  CANCELLED: "Dibatalkan",
  RETURNED: "Selesai Dikembalikan",
};

const STATUS_BADGES: Record<BookingStatus, string> = {
  PENDING: "bg-orange-100 text-orange-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  READY: "bg-blue-100 text-blue-700",
  PICKED_UP: "bg-indigo-100 text-indigo-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  RETURNED: "bg-teal-100 text-teal-700",
};

interface TrackingPageProps {
  searchParams: Promise<{ status?: string | string[] }>;
}

function parseFilter(
  statusParam: string | string[] | undefined,
): TrackingFilter {
  const value = typeof statusParam === "string" ? statusParam : "all";

  if (value === "approved") return "approved";
  if (value === "pending") return "pending";
  if (value === "cancelled") return "cancelled";

  return "all";
}

export default async function TrackingPage({
  searchParams,
}: TrackingPageProps) {
  const session = await getSession();

  if (!session?.user_id) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const currentFilter = parseFilter(resolvedSearchParams.status);

  const bookings = await prisma.booking.findMany({
    where: { user_id: session.user_id },
    include: {
      service: {
        select: {
          nama_desain: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const approvedCount = bookings.filter((booking) =>
    APPROVED_STATUSES.includes(booking.status_booking),
  ).length;
  const pendingCount = bookings.filter(
    (booking) => booking.status_booking === BookingStatus.PENDING,
  ).length;
  const cancelledCount = bookings.filter(
    (booking) => booking.status_booking === BookingStatus.CANCELLED,
  ).length;

  const filteredBookings = bookings.filter((booking) => {
    if (currentFilter === "approved") {
      return APPROVED_STATUSES.includes(booking.status_booking);
    }

    if (currentFilter === "pending") {
      return booking.status_booking === BookingStatus.PENDING;
    }

    if (currentFilter === "cancelled") {
      return booking.status_booking === BookingStatus.CANCELLED;
    }

    return true;
  });

  const getFilterClass = (filterName: TrackingFilter) => {
    const isActive = currentFilter === filterName;

    return isActive
      ? "bg-[#c2652a] text-white border-[#c2652a] shadow-sm"
      : "bg-white text-[#7a6f69] border-[#d8d0c8]/60 hover:bg-[#faf5ee] hover:text-[#3a302a]";
  };

  return (
    <main className="min-h-screen bg-[#faf5ee] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-[#3a302a] sm:text-5xl">
            Tracking Pesanan
          </h1>
          <p className="mt-4 text-lg text-[#7a6f69]">
            Pantau status pesanan Anda: mana yang sudah di-ACC dan mana yang
            masih menunggu konfirmasi admin.
          </p>
        </div>

        <CustomerPortalTabs activeTab="tracking" />

        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl border border-[#d8d0c8]/60 bg-white p-4 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
              Sudah Di-ACC
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700">
              {approvedCount}
            </p>
          </article>
          <article className="rounded-2xl border border-[#d8d0c8]/60 bg-white p-4 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
              Menunggu ACC
            </p>
            <p className="mt-2 text-2xl font-black text-orange-700">
              {pendingCount}
            </p>
          </article>
          <article className="rounded-2xl border border-[#d8d0c8]/60 bg-white p-4 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
              Dibatalkan
            </p>
            <p className="mt-2 text-2xl font-black text-rose-700">
              {cancelledCount}
            </p>
          </article>
        </section>

        <section className="rounded-2xl border border-[#d8d0c8]/60 bg-white p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
          <div className="mb-5 flex flex-wrap gap-2">
            <Link
              href="/pesanan?status=all"
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${getFilterClass(
                "all",
              )}`}
            >
              Semua
            </Link>
            <Link
              href="/pesanan?status=approved"
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${getFilterClass(
                "approved",
              )}`}
            >
              Sudah Di-ACC
            </Link>
            <Link
              href="/pesanan?status=pending"
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${getFilterClass(
                "pending",
              )}`}
            >
              Belum Di-ACC
            </Link>
            <Link
              href="/pesanan?status=cancelled"
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${getFilterClass(
                "cancelled",
              )}`}
            >
              Dibatalkan
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-xl border border-[#d8d0c8]/50 bg-[#faf5ee] p-6 text-center">
              <p className="text-sm font-semibold text-[#3a302a]">
                Anda belum punya pesanan.
              </p>
              <p className="mt-1 text-sm text-[#7a6f69]">
                Yuk buat booking pertama Anda sekarang.
              </p>
              <Link
                href="/booking"
                className="mt-4 inline-flex rounded-xl bg-[#c2652a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a85522]"
              >
                Buat Booking
              </Link>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-xl border border-[#d8d0c8]/50 bg-[#faf5ee] p-6 text-center text-sm text-[#7a6f69]">
              Tidak ada pesanan pada filter ini.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/booking/${booking.id}`}
                  className="block rounded-xl border border-[#d8d0c8]/50 bg-[#faf5ee] p-4 transition hover:border-[#c2652a] hover:bg-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
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
                      <p className="mt-1 text-xs text-[#a39a94]">
                        Dibuat:{" "}
                        {new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(booking.created_at)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${STATUS_BADGES[booking.status_booking]}`}
                    >
                      {STATUS_LABELS[booking.status_booking]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
