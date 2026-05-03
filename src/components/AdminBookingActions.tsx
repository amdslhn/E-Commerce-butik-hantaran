"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { BookingStatus } from "@prisma/client";
import { markGoodsReceived } from "@/actions/admin";
import { overrideBookingStatus } from "@/actions/booking-status";
import {
  Loader2,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Package,
  PackageCheck,
  Truck,
  RotateCcw,
  Ban,
  ClipboardList,
  X,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================
interface Metadata {
  pengantin_pria?: string;
  pengantin_wanita?: string;
  catatan?: string;
  nama_klien_wo?: string;
  wo_global_note?: string;
  items_received?: string[];
}

interface Props {
  bookingId: number;
  metadata: Metadata | null;
  currentStatus: string;
}

// ============================================================================
// State Machine — mirrors the server-side transition rules exactly.
// Key = current status, Value = list of statuses it can transition INTO.
// ============================================================================
const NEXT_TRANSITIONS: Record<string, BookingStatus[]> = {
  PENDING: [BookingStatus.CANCELLED],
  CONFIRMED: [BookingStatus.READY, BookingStatus.CANCELLED],
  READY: [BookingStatus.PICKED_UP],
  PICKED_UP: [BookingStatus.RETURNED],
  RETURNED: [],
  CANCELLED: [],
};

// Human-readable labels (Bahasa Indonesia)
const STATUS_CONFIG: Record<
  string,
  { label: string; icon: typeof Package; colorClass: string }
> = {
  READY: {
    label: "Siap Ambil",
    icon: PackageCheck,
    colorClass: "text-indigo-600",
  },
  PICKED_UP: {
    label: "Sudah Diambil",
    icon: Truck,
    colorClass: "text-emerald-600",
  },
  RETURNED: {
    label: "Dikembalikan",
    icon: RotateCcw,
    colorClass: "text-teal-600",
  },
  CANCELLED: {
    label: "Batalkan",
    icon: Ban,
    colorClass: "text-rose-600",
  },
};

// ============================================================================
// Toast Notification Component
// ============================================================================
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm transition-all animate-[slideUp_0.3s_ease-out] ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
          : "border-rose-200 bg-rose-50/95 text-rose-800"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
      )}
      <p className="text-sm font-medium leading-snug">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto shrink-0 rounded-md p-0.5 opacity-60 transition hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================
export default function AdminBookingActions({
  bookingId,
  metadata,
  currentStatus,
}: Props) {
  // --- Modals ---
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  // --- Dropdown ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Status Transition ---
  const [isPending, startTransition] = useTransition();

  // --- Receive Modal Form ---
  const [isReceivePending, setIsReceivePending] = useState(false);
  const [itemsDraft, setItemsDraft] = useState("");
  const [woGlobalNote, setWoGlobalNote] = useState("");
  const [relatedBookingIdsInput, setRelatedBookingIdsInput] = useState("");
  const [formError, setFormError] = useState("");

  // --- Toast ---
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---- Available transitions for the current status ----
  const availableTransitions = NEXT_TRANSITIONS[currentStatus] ?? [];
  const isTerminal = availableTransitions.length === 0;

  // ---- Handle Status Change via Server Action ----
  function handleStatusChange(newStatus: BookingStatus) {
    setIsDropdownOpen(false);

    startTransition(async () => {
      const result = await overrideBookingStatus(bookingId, newStatus);

      setToast({
        message: result.message,
        type: result.success ? "success" : "error",
      });
    });
  }

  // ---- Handle Goods Receipt (existing logic, adapted) ----
  const handleReceive = async () => {
    const daftarBarang = itemsDraft
      .split(/\r?\n/)
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter((line) => line.length > 0);

    if (daftarBarang.length === 0) {
      setFormError("Silakan isi minimal satu item barang yang diterima.");
      return;
    }

    const relatedBookingIds = relatedBookingIdsInput
      .split(",")
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((id) => Number.isInteger(id) && id > 0 && id !== bookingId);

    setFormError("");
    setIsReceivePending(true);

    const result = await markGoodsReceived({
      bookingId,
      daftar_barang: daftarBarang,
      wo_global_note: woGlobalNote.trim() || undefined,
      related_booking_ids: relatedBookingIds,
    });

    if (!result.success) {
      setFormError(result.error || "Gagal memproses penerimaan barang.");
      setIsReceivePending(false);
      return;
    }

    setToast({
      message: `Barang untuk booking #${bookingId} berhasil dikonfirmasi.`,
      type: "success",
    });
    setIsReceiveModalOpen(false);
    setIsReceivePending(false);
    setItemsDraft("");
    setWoGlobalNote("");
    setRelatedBookingIdsInput("");
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        {/* ─── Detail Button ─── */}
        <button
          onClick={() => setIsDetailModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#c2652a] bg-[#faf5ee] px-3 py-2 text-xs font-bold text-[#c2652a] transition-all hover:bg-[#c2652a] hover:text-white active:scale-95"
        >
          <ClipboardList className="h-3.5 w-3.5" />
          Detail
        </button>

        {/* ─── Receive Goods Button (only for PENDING status) ─── */}
        {currentStatus === "PENDING" && (
          <button
            onClick={() => {
              setFormError("");
              setIsReceiveModalOpen(true);
            }}
            disabled={isPending || isReceivePending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#c2652a] px-3 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#a85522] active:scale-95 disabled:opacity-50"
          >
            <Package className="h-3.5 w-3.5" />
            {isReceivePending ? "Memproses..." : "Barang Diterima"}
          </button>
        )}

        {/* ─── Status Transition Dropdown ─── */}
        {!isTerminal && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#d8d0c8] bg-white px-3 py-2 text-xs font-bold text-[#3a302a] shadow-sm transition-all hover:bg-[#faf5ee] active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              )}
              {isPending ? "Memproses..." : "Ubah Status"}
            </button>

            {isDropdownOpen && !isPending && (
              <div className="absolute right-0 z-50 mt-1.5 w-48 origin-top-right rounded-xl border border-[#d8d0c8]/60 bg-white py-1 shadow-xl animate-[fadeIn_0.15s_ease-out]">
                {availableTransitions.map((targetStatus) => {
                  const config = STATUS_CONFIG[targetStatus];
                  if (!config) return null;
                  const Icon = config.icon;

                  return (
                    <button
                      key={targetStatus}
                      onClick={() => handleStatusChange(targetStatus)}
                      className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-[#faf5ee] ${config.colorClass}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* TOAST NOTIFICATION                                                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODAL: DETAIL PESANAN                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md scale-100 rounded-2xl bg-white p-6 shadow-2xl transition-transform">
            <div className="mb-4 flex items-center justify-between border-b border-[#d8d0c8]/50 pb-3">
              <h3 className="font-serif text-lg font-medium text-[#3a302a]">
                Detail Pesanan #{bookingId}
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded-full p-1 text-[#7a6f69] transition hover:bg-[#fdf2f2] hover:text-[#c2652a]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#faf5ee] p-4 border border-[#d8d0c8]/40">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94]">
                    Pengantin Pria
                  </p>
                  <p className="text-sm font-medium text-[#3a302a] mt-0.5">
                    {metadata?.pengantin_pria || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94]">
                    Pengantin Wanita
                  </p>
                  <p className="text-sm font-medium text-[#3a302a] mt-0.5">
                    {metadata?.pengantin_wanita || "-"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94] mb-1">
                  Catatan Tambahan
                </p>
                <div className="rounded-xl border border-[#d8d0c8]/50 bg-white p-3 text-sm text-[#7a6f69] min-h-20">
                  {metadata?.catatan ? (
                    metadata.catatan
                  ) : (
                    <span className="italic text-[#a39a94]">
                      Tidak ada catatan dari pelanggan.
                    </span>
                  )}
                </div>
              </div>

              {metadata?.nama_klien_wo && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94] mb-1">
                    Nama Klien WO
                  </p>
                  <div className="rounded-xl border border-[#d8d0c8]/50 bg-white p-3 text-sm text-[#3a302a]">
                    {metadata.nama_klien_wo}
                  </div>
                </div>
              )}

              {metadata?.wo_global_note && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94] mb-1">
                    Catatan Global WO
                  </p>
                  <div className="rounded-xl border border-[#d8d0c8]/50 bg-white p-3 text-sm text-[#3a302a]">
                    {metadata.wo_global_note}
                  </div>
                </div>
              )}

              {metadata?.items_received &&
                metadata.items_received.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94] mb-1">
                      Daftar Barang Diterima
                    </p>
                    <ul className="space-y-1 rounded-xl border border-[#d8d0c8]/50 bg-white p-3 text-sm text-[#3a302a]">
                      {metadata.items_received.map((item, index) => (
                        <li key={`${item}-${index}`} className="flex gap-2">
                          <span className="text-[#a39a94]">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-full rounded-lg bg-[#d8d0c8]/30 py-2.5 text-sm font-semibold text-[#3a302a] transition hover:bg-[#d8d0c8]/50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MODAL: INTAKE BARANG                                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#d8d0c8]/60 bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-4 border-b border-[#d8d0c8]/50 pb-3">
              <h3 className="font-serif text-lg font-semibold text-[#3a302a]">
                Intake Barang - Booking #{bookingId}
              </h3>
              <p className="mt-1 text-sm text-[#7a6f69]">
                Input daftar barang yang benar-benar diterima dari pelanggan.
              </p>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg border border-[#f5d8d8] bg-[#fdf2f2] px-3 py-2 text-sm text-[#8c3c3c]">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor={`items-${bookingId}`}
                  className="mb-1 block text-sm font-semibold text-[#3a302a]"
                >
                  Daftar Barang Diterima
                </label>
                <textarea
                  id={`items-${bookingId}`}
                  value={itemsDraft}
                  onChange={(event) => setItemsDraft(event.target.value)}
                  rows={6}
                  disabled={isReceivePending}
                  className="w-full rounded-xl border border-[#d8d0c8] bg-white p-3 text-sm text-[#3a302a] outline-none transition focus:border-[#c2652a] focus:ring-1 focus:ring-[#c2652a]"
                  placeholder={`Tulis satu item per baris\nContoh:\n- Sajadah putih\n- Mukena satin\n- Box mahar`}
                />
              </div>

              <div>
                <label
                  htmlFor={`wo-note-${bookingId}`}
                  className="mb-1 block text-sm font-semibold text-[#3a302a]"
                >
                  Catatan Global WO (Opsional)
                </label>
                <textarea
                  id={`wo-note-${bookingId}`}
                  value={woGlobalNote}
                  onChange={(event) => setWoGlobalNote(event.target.value)}
                  rows={2}
                  disabled={isReceivePending}
                  className="w-full rounded-xl border border-[#d8d0c8] bg-white p-3 text-sm text-[#3a302a] outline-none transition focus:border-[#c2652a] focus:ring-1 focus:ring-[#c2652a]"
                  placeholder="Misal: Barang WO tiba bersamaan dalam 1 mobil box."
                />
              </div>

              <div>
                <label
                  htmlFor={`related-bookings-${bookingId}`}
                  className="mb-1 block text-sm font-semibold text-[#3a302a]"
                >
                  Booking ID Terkait WO (Opsional)
                </label>
                <input
                  id={`related-bookings-${bookingId}`}
                  value={relatedBookingIdsInput}
                  onChange={(event) =>
                    setRelatedBookingIdsInput(event.target.value)
                  }
                  disabled={isReceivePending}
                  className="w-full rounded-xl border border-[#d8d0c8] bg-white p-3 text-sm text-[#3a302a] outline-none transition focus:border-[#c2652a] focus:ring-1 focus:ring-[#c2652a]"
                  placeholder="Pisahkan dengan koma, contoh: 120, 121, 122"
                />
                <p className="mt-1 text-xs text-[#7a6f69]">
                  Jika diisi, catatan global akan diterapkan ke booking yang
                  ID-nya Anda masukkan.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (isReceivePending) return;
                  setIsReceiveModalOpen(false);
                }}
                className="rounded-lg border border-[#d8d0c8] bg-white px-4 py-2.5 text-sm font-semibold text-[#3a302a] transition hover:bg-[#faf5ee]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReceive}
                disabled={isReceivePending}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c2652a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a85522] disabled:opacity-50"
              >
                {isReceivePending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {isReceivePending ? "Menyimpan..." : "Simpan & Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
