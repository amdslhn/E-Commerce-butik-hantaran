import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminServiceList from "@/components/AdminServiceList";

export default async function AdminServicesPage() {
  // 1. Verifikasi Keamanan Level Admin
  const session = await getSession();

  if (!session || session.user_role !== 3) {
    redirect("/"); // Tendang ke beranda jika bukan Admin
  }

  // 2. Fetch data katalog layanan (Hanya butuh sekali render)
  const services = await prisma.service.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      nama_desain: true,
      deskripsi: true,
      harga_reguler: true,
      stok_box: true,
      is_unlimited: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#faf5ee] py-12 px-6 font-sans">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#c2652a]">
            Admin Privileges
          </p>
          <h1 className="text-3xl font-serif font-medium text-[#3a302a] tracking-tight">
            Manajemen Layanan & Stok
          </h1>
          <p className="text-[#7a6f69] mt-2 max-w-2xl">
            Atur ketersediaan kapasitas box secara spesifik untuk masing-masing
            desain. Aktifkan mode{" "}
            <strong className="font-medium text-[#3a302a]">Unlimited</strong>{" "}
            khusus untuk pesanan tanpa batas fisik (misal: Hidden Hantaran
            Akrilik).
          </p>
        </header>

        {/* Lempar data ke Client Component untuk dikelola */}
        <AdminServiceList services={services} />
      </div>
    </main>
  );
}
