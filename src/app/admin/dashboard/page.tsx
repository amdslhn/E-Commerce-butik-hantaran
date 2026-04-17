import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminBookingActions from "@/components/AdminBookingActions";

export default async function AdminDashboard() {
  const session = await getSession();
  // Jika bukan Admin (role_id 2), tendang balik ke beranda
 if (!session || session.user_role !== 3) {
   redirect("/");
 }

  
  // Ambil pesanan yang PENDING untuk diproses Admin
  const pendingBookings = await prisma.booking.findMany({
    where: {
      status_booking: "PENDING",
    },
    include: {
      user: {
        select: { nama: true, email: true },
      },
      service: {
        select: { nama_desain: true },
      },
    },
    orderBy: { drop_off_date: "asc" },
  });

  return (
    <main className="min-h-screen bg-[#faf5ee] py-12 px-6 font-sans">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <h1 className="text-3xl font-serif font-medium text-[#3a302a] tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-[#7a6f69] mt-2">
            Kelola penerimaan barang dan pantau status pesanan pelanggan.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-[#d8d0c8]/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf5ee] border-b border-[#d8d0c8]/60">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                    Desain
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                    Jumlah
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                    Batas Drop-off
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d8d0c8]/30">
                {pendingBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-[#a39a94]"
                    >
                      Tidak ada pesanan pending saat ini.
                    </td>
                  </tr>
                ) : (
                  pendingBookings.map((booking) => {
                    // Ekstrak metadata dengan aman
                    const metadata = booking.custom_metadata as {
                      pengantin_pria?: string;
                      pengantin_wanita?: string;
                      catatan?: string;
                    } | null;

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-[#faf5ee]/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#3a302a]">
                            {booking.user.nama}
                          </p>
                          <p className="text-xs text-[#7a6f69]">
                            {booking.user.email}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#3a302a]">
                          {booking.service.nama_desain}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#3a302a]">
                          {booking.jumlah_box} Box
                        </td>
                        <td className="px-6 py-4 text-sm text-[#3a302a]">
                          {new Intl.DateTimeFormat("id-ID", {
                            dateStyle: "medium",
                          }).format(booking.drop_off_date)}
                        </td>
                        <td className="px-6 py-4">
                          {/* PANGGIL KOMPONEN CLIENT KITA DI SINI */}
                          <AdminBookingActions
                            bookingId={booking.id}
                            metadata={metadata}
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
