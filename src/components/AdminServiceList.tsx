"use client";

import { useState } from "react";
import { updateServiceStock } from "@/actions/admin-services"; // Pastikan path ini sesuai dengan action yang dibuat sebelumnya

type Service = {
  id: number;
  nama_desain: string;
  deskripsi: string | null;
  harga_reguler: number;
  stok_box: number;
  is_unlimited: boolean;
};

export default function AdminServiceList({
  services,
}: {
  services: Service[];
}) {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [stok, setStok] = useState(0);
  const [isPending, setIsPending] = useState(false);

  // Format Rupiah
  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  const openModal = (service: Service) => {
    setEditingService(service);
    setIsUnlimited(service.is_unlimited);
    setStok(service.stok_box);
  };

  const handleSave = async () => {
    if (!editingService) return;
    setIsPending(true);

    try {
      await updateServiceStock(editingService.id, stok, isUnlimited);
      setEditingService(null);
    } catch (error) {
      console.error("Gagal update stok:", error);
      alert("Terjadi kesalahan saat menyimpan stok.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-[#d8d0c8]/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf5ee] border-b border-[#d8d0c8]/60">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                  Desain Hantaran
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                  Harga Reguler
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                  Kapasitas
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94]">
                  Stok Fisik
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#a39a94] text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d8d0c8]/30">
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-[#faf5ee]/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#3a302a]">
                      {service.nama_desain}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#3a302a]">
                    {formatRupiah(service.harga_reguler)}
                  </td>
                  <td className="px-6 py-4">
                    {service.is_unlimited ? (
                      <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-700">
                        Unlimited
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-700">
                        Terbatas
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#3a302a]">
                    {service.is_unlimited ? "∞" : `${service.stok_box} Box`}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openModal(service)}
                      className="rounded-lg border border-[#c2652a] bg-[#faf5ee] px-4 py-1.5 text-xs font-bold text-[#c2652a] transition-all hover:bg-[#c2652a] hover:text-white active:scale-95"
                    >
                      Edit Stok
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL EDIT STOK --- */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm scale-100 rounded-3xl bg-white p-7 shadow-2xl transition-transform">
            <h3 className="font-serif text-xl font-medium text-[#3a302a] mb-1">
              Atur Stok Box
            </h3>
            <p className="text-sm text-[#7a6f69] mb-6 border-b border-[#d8d0c8]/50 pb-4">
              Desain:{" "}
              <strong className="font-semibold text-[#3a302a]">
                {editingService.nama_desain}
              </strong>
            </p>

            <div className="space-y-5">
              {/* Toggle Unlimited */}
              <div className="flex items-center justify-between rounded-xl bg-[#faf5ee] p-4 border border-[#d8d0c8]/40">
                <div>
                  <p className="text-sm font-semibold text-[#3a302a]">
                    Stok Unlimited
                  </p>
                  <p className="text-[11px] text-[#7a6f69] mt-0.5">
                    Bypass pengecekan stok (khusus Acrylic)
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isUnlimited}
                    onChange={(e) => setIsUnlimited(e.target.checked)}
                  />
                  <div className="h-6 w-11 rounded-full bg-stone-300 peer-checked:bg-[#c2652a] peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all content-['']"></div>
                </label>
              </div>

              {/* Input Stok (Hanya Muncul Jika Terbatas) */}
              {!isUnlimited && (
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[#a39a94]">
                    Total Kapasitas Fisik (Box)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stok}
                    onChange={(e) => setStok(parseInt(e.target.value) || 0)}
                    className="w-full rounded-xl border border-[#d8d0c8] bg-white px-4 py-3 text-sm font-medium text-[#3a302a] focus:border-[#c2652a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setEditingService(null)}
                className="w-full rounded-xl bg-[#d8d0c8]/30 py-3 text-sm font-semibold text-[#3a302a] transition hover:bg-[#d8d0c8]/50 active:scale-95"
                disabled={isPending}
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="w-full rounded-xl bg-[#c2652a] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#a85522] active:scale-95 disabled:opacity-50"
              >
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
