import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type BookingMetadata = {
  pengantin_pria?: string;
  pengantin_wanita?: string;
  catatan?: string;
  nama_klien_wo?: string;
  wo_global_note?: string;
  items_received?: string[];
};

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const session = await getSession();

  if (!session?.user_id) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const bookingId = Number.parseInt(resolvedParams.id, 10);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    redirect("/booking");
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      user_id: session.user_id,
    },
    include: {
      service: {
        select: {
          nama_desain: true,
        },
      },
    },
  });

  if (!booking) {
    redirect("/booking");
  }

  const metadata = (booking.custom_metadata as BookingMetadata | null) ?? null;
  const itemsReceived = metadata?.items_received ?? [];

  return (
    <main className="min-h-screen bg-[#faf5ee] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
              Detail Pesanan
            </p>
            <h1 className="font-serif text-3xl font-semibold text-[#3a302a]">
              Booking #{booking.id}
            </h1>
          </div>
          <Link
            href="/pesanan"
            className="rounded-full border border-[#d8d0c8] bg-white px-4 py-2 text-sm font-semibold text-[#3a302a] transition hover:bg-[#faf5ee]"
          >
            Kembali ke Tracking
          </Link>
        </div>

        <section className="rounded-2xl border border-[#d8d0c8]/60 bg-white p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                Layanan
              </p>
              <p className="mt-1 text-sm font-semibold text-[#3a302a]">
                {booking.service.nama_desain}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                Status Booking
              </p>
              <p className="mt-1 inline-block rounded-full bg-[#f2f7ec] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4a5c3a]">
                {booking.status_booking}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                Tanggal Acara
              </p>
              <p className="mt-1 text-sm text-[#3a302a]">
                {new Intl.DateTimeFormat("id-ID", {
                  dateStyle: "full",
                }).format(booking.event_date)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                Jumlah Box
              </p>
              <p className="mt-1 text-sm text-[#3a302a]">
                {booking.jumlah_box} box
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#d8d0c8]/60 bg-white p-6 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
          <h2 className="font-serif text-xl font-semibold text-[#3a302a]">
            Daftar Barang yang Kami Terima
          </h2>

          {itemsReceived.length > 0 ? (
            <ul className="mt-4 space-y-2 rounded-xl border border-[#d8d0c8]/50 bg-[#faf5ee] p-4 text-sm text-[#3a302a]">
              {itemsReceived.map((item, index) => (
                <li key={`${item}-${index}`} className="flex gap-2">
                  <span className="text-[#a39a94]">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-xl border border-[#d8d0c8]/50 bg-[#faf5ee] p-4 text-sm text-[#7a6f69]">
              Data intake barang belum tersedia. Tim admin akan mengisi daftar
              ini saat proses Barang Diterima.
            </p>
          )}

          {metadata?.wo_global_note && (
            <div className="mt-4 rounded-xl border border-[#f5d8d8] bg-[#fdf2f2] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                Catatan Global WO
              </p>
              <p className="mt-1 text-sm text-[#3a302a]">
                {metadata.wo_global_note}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
