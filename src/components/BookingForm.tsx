"use client";

import { useActionState } from "react";
import { checkoutBooking } from "@/actions/booking";

type Service = {
  id: number;
  nama_desain: string;
  harga_reguler: number;
  harga_wo: number;
};

const initialState = { success: false, error: "", message: "" };

type BookingFormProps = {
  services: Service[];
  userId: number | null;
};

export default function BookingForm({ services, userId }: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(
    checkoutBooking,
    initialState,
  );

  const isUserMissing = userId === null;

  return (
    <form
      action={formAction}
      className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Form Penyewaan Hantaran
      </h2>

      {state?.error && (
        <div
          className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md"
          role="alert"
        >
          {state.error}
        </div>
      )}
      {state?.success && (
        <div
          className="p-3 bg-green-100 text-green-700 border border-green-300 rounded-md"
          role="alert"
        >
          Berhasil! Pesanan Anda sedang diproses.
        </div>
      )}

      {isUserMissing && (
        <div
          className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md"
          role="alert"
        >
          Data user tidak ditemukan di database. Tambahkan minimal 1 user dulu
          untuk testing booking.
        </div>
      )}

      <input type="hidden" name="user_id" value={userId ?? 1} />

      {/* --- TAMBAHAN UI BARU --- */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="nama_pengantin_pria"
            className="text-sm font-semibold text-gray-700"
          >
            Nama Pengantin Pria
          </label>
          <input
            type="text"
            id="nama_pengantin_pria"
            name="nama_pengantin_pria"
            required
            disabled={isPending || isUserMissing}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            placeholder="Misal: Budi"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="nama_pengantin_wanita"
            className="text-sm font-semibold text-gray-700"
          >
            Nama Pengantin Wanita
          </label>
          <input
            type="text"
            id="nama_pengantin_wanita"
            name="nama_pengantin_wanita"
            required
            disabled={isPending || isUserMissing}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            placeholder="Misal: Siti"
          />
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <label
          htmlFor="catatan_tambahan"
          className="text-sm font-semibold text-gray-700"
        >
          Catatan (Opsional)
        </label>
        <textarea
          id="catatan_tambahan"
          name="catatan_tambahan"
          rows={2}
          disabled={isPending || isUserMissing}
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
          placeholder="Misal: Warna pita sage green"
        />
      </div>
      {/* --- AKHIR TAMBAHAN UI BARU --- */}

      <div className="flex flex-col space-y-1">
        <label
          htmlFor="service_id"
          className="text-sm font-semibold text-gray-700"
        >
          Pilih Desain Hantaran
        </label>
        <select
          id="service_id"
          name="service_id"
          required
          disabled={isPending || isUserMissing}
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
        >
          <option value="">-- Pilih Desain --</option>
          {services.map((svc) => (
            <option key={svc.id} value={svc.id}>
              {svc.nama_desain} - Rp{svc.harga_reguler.toLocaleString("id-ID")}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-1">
        <label
          htmlFor="event_date"
          className="text-sm font-semibold text-gray-700"
        >
          Tanggal Acara (H-Hari H)
        </label>
        <input
          type="date"
          id="event_date"
          name="event_date"
          required
          disabled={isPending || isUserMissing}
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
        />
        <span className="text-xs text-gray-500">
          Box akan diantar H-7 dan diambil H+2.
        </span>
      </div>

      <div className="flex flex-col space-y-1">
        <label
          htmlFor="jumlah_box"
          className="text-sm font-semibold text-gray-700"
        >
          Jumlah Box (Maks 70)
        </label>
        <input
          type="number"
          id="jumlah_box"
          name="jumlah_box"
          min="1"
          max="70"
          required
          disabled={isPending || isUserMissing}
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || isUserMissing}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400 flex justify-center items-center"
      >
        {isPending ? (
          <span className="animate-pulse">Memproses...</span>
        ) : (
          "Checkout Sekarang"
        )}
      </button>
    </form>
  );
}
