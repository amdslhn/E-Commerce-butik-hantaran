import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminBookingActions from "@/components/AdminBookingActions";
import AdminManualBookingModal from "@/components/Client";
import { Prisma } from "@prisma/client";

// PERBAIKAN: Definisikan tipe searchParams sebagai Promise untuk Next.js terbaru
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  const session = await getSession();

  if (!session || session.user_role !== 3) {
    redirect("/");
  }

  // --- PERBAIKAN LOGIKA FILTERING (AWAIT SEARCH PARAMS) ---
  const resolvedSearchParams = await searchParams; // Wajib di-await di Next.js 15+
  const currentTab =
    typeof resolvedSearchParams.status === "string"
      ? resolvedSearchParams.status
      : "active";

  let statusFilter: Prisma.EnumBookingStatusFilter;
  let orderByFilter: Prisma.BookingOrderByWithRelationInput;

  switch (currentTab) {
    case "pending":
      statusFilter = { in: ["PENDING"] };
      orderByFilter = { drop_off_date: "asc" };
      break;
    case "confirmed":
      statusFilter = { in: ["CONFIRMED"] };
      orderByFilter = { drop_off_date: "asc" };
      break;
    case "history":
      // Tab Riwayat: Tampilkan yang sudah diambil, dikembalikan, atau dibatalkan
      statusFilter = { in: ["PICKED_UP", "RETURNED", "CANCELLED"] };
      orderByFilter = { updated_at: "desc" }; // Urutkan dari yang paling baru di-update
      break;
    case "active":
    default:
      // Tab Default: Semua yang masih berjalan
      statusFilter = { in: ["PENDING", "CONFIRMED", "READY"] };
      orderByFilter = { drop_off_date: "asc" };
      break;
  }

  // Ambil list desain untuk Dropdown di Modal Pesanan Manual
  const servicesList = await prisma.service.findMany({
    where: { is_active: true },
    select: { id: true, nama_desain: true },
    orderBy: { nama_desain: "asc" },
  });

  // Query Data Booking sesuai Filter
  const filteredBookings = await prisma.booking.findMany({
    where: { status_booking: statusFilter },
    include: {
      user: { select: { nama: true, email: true, role_id: true } },
      service: { select: { nama_desain: true } },
    },
    orderBy: orderByFilter,
  });

  // Helper untuk styling Tab Aktif
  const getTabClass = (tabName: string) => {
    const isActive =
      currentTab === tabName ||
      (currentTab === "active" && tabName === "active");
    return isActive
      ? "bg-[#c2652a] text-white shadow-md border-[#c2652a]"
      : "bg-white text-[#7a6f69] border-[#d8d0c8]/60 hover:bg-[#faf5ee] hover:text-[#3a302a]";
  };

  return (
    <main className="min-h-screen bg-[#faf5ee] py-12 px-6 font-sans">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-serif font-medium tracking-tight text-[#3a302a]">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-[#7a6f69]">
              Kelola pesanan online dan input manual pesanan via WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/service"
              className="flex items-center gap-2 rounded-xl border border-[#c2652a] bg-white px-5 py-2.5 text-sm font-bold text-[#c2652a] shadow-sm transition-all hover:bg-[#c2652a] hover:text-white active:scale-95"
            >
              Kelola Stok Layanan
            </Link>

            <AdminManualBookingModal services={servicesList} />
          </div>
        </header>

        {/* --- TAB NAVIGASI FILTER --- */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Link
            href="/admin/dashboard?status=active"
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${getTabClass("active")}`}
          >
            Semua Aktif
          </Link>
          <Link
            href="/admin/dashboard?status=pending"
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${getTabClass("pending")}`}
          >
            Menunggu (Pending)
          </Link>
          <Link
            href="/admin/dashboard?status=confirmed"
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${getTabClass("confirmed")}`}
          >
            Terkonfirmasi & WA
          </Link>
          <Link
            href="/admin/dashboard?status=history"
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${getTabClass("history")}`}
          >
            Riwayat Selesai
          </Link>
        </div>

        {/* --- TABEL DATA --- */}
        <div className="overflow-hidden rounded-2xl border border-[#d8d0c8]/60 bg-white shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#d8d0c8]/60 bg-[#faf5ee]">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                    Desain
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                    Status / Jadwal
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d8d0c8]/30">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className="text-[#a39a94] font-medium">
                        Tidak ada pesanan di kategori ini.
                      </p>
                      <p className="text-sm text-[#d8d0c8] mt-1">
                        Coba pilih tab filter yang lain.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const metadata = booking.custom_metadata as {
                      is_offline_booking?: boolean;
                      nama_pelanggan_offline?: string;
                      pengantin_pria?: string;
                      pengantin_wanita?: string;
                      catatan?: string;
                    } | null;

                    const isOffline = metadata?.is_offline_booking;
                    const displayNama = isOffline
                      ? metadata.nama_pelanggan_offline
                      : booking.user.nama;

                    // Helper Warna Status
                    let statusColor = "bg-stone-100 text-stone-700";
                    if (booking.status_booking === "PENDING")
                      statusColor = "bg-orange-100 text-orange-700";
                    if (booking.status_booking === "CONFIRMED")
                      statusColor = "bg-blue-100 text-blue-700";
                    if (booking.status_booking === "READY")
                      statusColor = "bg-indigo-100 text-indigo-700";
                    if (booking.status_booking === "PICKED_UP")
                      statusColor = "bg-emerald-100 text-emerald-700";
                    if (booking.status_booking === "RETURNED")
                      statusColor = "bg-teal-100 text-teal-700";
                    if (booking.status_booking === "CANCELLED")
                      statusColor = "bg-rose-100 text-rose-700";

                    return (
                      <tr
                        key={booking.id}
                        className="transition-colors hover:bg-[#faf5ee]/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[#3a302a]">
                              {displayNama}
                            </p>
                            {isOffline && (
                              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                OFFLINE (WA)
                              </span>
                            )}
                          </div>
                          {!isOffline && (
                            <p className="text-xs text-[#7a6f69]">
                              {booking.user.email}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#3a302a]">
                          <p className="font-semibold">
                            {booking.service.nama_desain}
                          </p>
                          <p className="text-xs text-[#7a6f69]">
                            {booking.jumlah_box} Box
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider mb-1 ${statusColor}`}
                          >
                            {booking.status_booking}
                          </span>
                          <p className="text-xs text-[#3a302a]">
                            Drop:{" "}
                            {new Intl.DateTimeFormat("id-ID", {
                              dateStyle: "medium",
                            }).format(booking.drop_off_date)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <AdminBookingActions
                            bookingId={booking.id}
                            metadata={metadata}
                            currentStatus={booking.status_booking} // <--- PROPERTI YANG HILANG SUDAH SAYA TAMBAHKAN DI SINI
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
