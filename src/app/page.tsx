import Image from "next/image";
import Link from "next/link";
import { getCurrentInventory } from "@/lib/inventory";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const inventory = await getCurrentInventory();
  const session = await getSession();

  // TIKET: Diferensiasi Role
  const isAdmin = session?.user_role === 3;
  const bookingUrl = session ? "/booking" : "/login";

  // 1. Ambil data layanan dari database
  const dbServices = await prisma.service.findMany({
    orderBy: { id: "asc" },
  });

  // 2. Kamus Gambar
  const imageMapping: Record<string, string> = {
    "Rustic Wood Tray": "/Rustic_wood_tray.jpeg",
    "Classic White Gold Tray": "/Classic_white_gold_tray.jpeg",
    "Pearl Tray": "/Pearl_tray.jpeg",
    "Crystal Tray": "/Crystal_tray.jpeg",
    "Hidden Hantaran": "/Hidden_hantaran.jpeg",
  };

  // --- 3. LOGIKA PAKET FAVORIT (TRENDING) ---
  const tujuhHariLalu = new Date();
  tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 7);

  let topServiceId: number | undefined;

  const trendingMingguIni = await prisma.booking.groupBy({
    by: ["service_id"],
    where: { created_at: { gte: tujuhHariLalu } },
    _count: { service_id: true },
    orderBy: { _count: { service_id: "desc" } },
    take: 1,
  });

  if (trendingMingguIni.length > 0) {
    topServiceId = trendingMingguIni[0].service_id;
  } else {
    const trendingSepanjangMasa = await prisma.booking.groupBy({
      by: ["service_id"],
      _count: { service_id: true },
      orderBy: { _count: { service_id: "desc" } },
      take: 1,
    });
    if (trendingSepanjangMasa.length > 0) {
      topServiceId = trendingSepanjangMasa[0].service_id;
    }
  }

  let paketFavorit = null;
  if (topServiceId) {
    paketFavorit = await prisma.service.findUnique({
      where: { id: topServiceId },
    });
  }
  if (!paketFavorit && dbServices.length > 0) {
    paketFavorit = dbServices[0];
  }

  const favoritImageUrl = paketFavorit
    ? imageMapping[paketFavorit.nama_desain] || "/Rustic_wood_tray.jpeg"
    : "/Rustic_wood_tray.jpeg";
  // -----------------------------------------

  const stats = [
    { value: `${inventory.sisaBox} box`, label: "tersisa & bisa dipesan" },
    { value: `${inventory.maxCapacity} box`, label: "kapasitas total" },
    { value: "48 jam", label: "waktu pengerjaan" },
    { value: "100%", label: "finishing manual" },
  ];

  const features = [
    {
      title: "Kurasi tema",
      body: "Palet warna selaras, dari nude hingga earthy, sesuai karakter pasangan.",
    },
    {
      title: "Detail tangan",
      body: "Setiap pita, label, dan bunga dirakit manual dengan finishing bersih.",
    },
    {
      title: "Custom pesan",
      body: "Story card bisa disesuaikan untuk momen lamaran, akad, atau resepsi.",
    },
    {
      title: "Kontrol kualitas",
      body: "Cek ulang isi, packaging, dan keamanan sebelum berangkat ke kurir.",
    },
  ];

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);

  const steps = [
    "Pilih tema dan warna favorit.",
    "Kurasi isi paket sesuai kebutuhan.",
    "Kami kirim preview sebelum produksi.",
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#fef3c7_0%,#fff7ed_35%,#ffffff_70%)] text-stone-900">
      <div className="pointer-events-none absolute -left-30 -top-35 h-72 w-72 rounded-full bg-rose-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-30 -right-25 h-72 w-72 rounded-full bg-orange-200/60 blur-3xl" />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-14 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-28 lg:pt-20">
        <div className="space-y-7">
          <p className="inline-flex w-fit rounded-full border border-stone-300/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-700 backdrop-blur">
            {isAdmin
              ? "Mode Administrator Aktif"
              : "Butik Hantaran - kurasi lokal"}
          </p>
          <h1 className="max-w-2xl text-balance text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {isAdmin
              ? "Kelola Butik & Pantau Pesanan Hantaran"
              : "Hantaran modern yang rapi, elegan, dan siap akad"}
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-stone-600 sm:text-lg">
            {isAdmin
              ? "Gunakan dashboard untuk memantau inventaris stok box dan memvalidasi pesanan pelanggan yang masuk."
              : "Pilihan paket premium dengan palet warna lembut, detail tangan, dan story card yang terasa personal."}
          </p>

          <div className="flex flex-wrap gap-3">
            {isAdmin ? (
              <Link
                className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-stone-700 shadow-lg shadow-stone-900/20"
                href="/admin/dashboard"
              >
                Buka Dashboard Admin
              </Link>
            ) : (
              <Link
                className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-stone-700"
                href="#katalog"
              >
                Lihat katalog
              </Link>
            )}

            {!isAdmin && (
              <Link
                className="rounded-full border border-stone-400 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-800 transition duration-300 hover:-translate-y-0.5 hover:border-stone-700"
                href={bookingUrl}
              >
                Custom order
              </Link>
            )}

            {isAdmin && (
              <Link
                className="rounded-full border border-stone-400 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-800 transition duration-300 hover:-translate-y-0.5 hover:border-stone-700"
                href="#katalog"
              >
                Cek Stok Katalog
              </Link>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-4 shadow-[0_10px_30px_-20px_rgba(41,37,36,0.4)] backdrop-blur"
              >
                <p className="text-2xl font-black text-stone-900">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500">
            Data stok sinkron dengan booking yang belum dibatalkan atau selesai.
          </p>

          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 shadow-sm backdrop-blur">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✨</span>
              <p className="text-sm font-medium leading-relaxed text-rose-800">
                <strong className="font-black">Kabar Gembira!</strong> Khusus
                layanan desain{" "}
                <span className="font-bold underline decoration-rose-300 underline-offset-2">
                  Hidden Hantaran
                </span>
                , stok kami <strong className="font-black">Unlimited</strong>{" "}
                (Tidak Terbatas). Anda bisa pesan berapapun tanpa khawatir
                kehabisan!
              </p>
            </div>
          </div>
        </div>

        <aside className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-300 bg-white shadow-[0_30px_80px_-30px_rgba(41,37,36,0.45)]">
          <div className="relative h-48 w-full sm:h-56">
            <Image
              src={favoritImageUrl}
              alt={paketFavorit?.nama_desain || "Paket Favorit"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
            <p className="absolute bottom-4 left-7 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 drop-shadow-md">
              Terlaris Minggu Ini
            </p>
          </div>

          <div className="p-7">
            <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">
              {paketFavorit?.nama_desain || "Paket Eksklusif"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 line-clamp-3">
              {paketFavorit?.deskripsi ||
                "Pilihan hantaran terbaik untuk momen spesial Anda dengan kualitas premium."}
            </p>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-stone-100 pt-5">
              <span className="text-lg font-bold text-stone-900">
                Mulai{" "}
                {paketFavorit ? formatRupiah(paketFavorit.harga_wo) : "Rp -"}
              </span>
              <span className="rounded-full border border-orange-300 bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700">
                Best Seller
              </span>
            </div>
          </div>
        </aside>
      </section>

      {/* --- FITUR SECTION --- */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10" id="fitur">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Kenapa kami
          </p>
          <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
            Rapi, elegan, dan siap akad
          </h2>
          <p className="text-base leading-relaxed text-stone-600">
            Setiap paket dirancang untuk tampil cantik di foto dan terasa hangat
            saat dibuka. Detail kecil kami urus dari awal sampai akhir.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-stone-200 bg-white/80 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(41,37,36,0.55)]"
            >
              <h3 className="text-lg font-bold text-stone-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* --- KATALOG SECTION --- */}
      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10" id="katalog">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Koleksi pilihan
          </p>
          <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
            Katalog untuk setiap cerita
          </h2>
          <p className="text-base leading-relaxed text-stone-600">
            Seluruh katalog berikut sudah tersinkron dengan data layanan aktif
            butik, lengkap dengan harga reguler dan harga WO.
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {dbServices.map((service) => {
            const imageUrl =
              imageMapping[service.nama_desain] || "/Rustic_wood_tray.jpeg";
           const inv = inventory.inventoryMap[service.id];

            return (
              <article
                key={service.id}
                className="rounded-2xl border border-stone-200 bg-white/85 p-4 shadow-[0_22px_40px_-30px_rgba(41,37,36,0.55)] transition duration-300 hover:-translate-y-1"
              >
                <div className="h-56 rounded-xl bg-white p-2 ring-1 ring-stone-200 sm:h-64">
                  <div className="relative h-full w-full">
                    <Image
                      src={imageUrl}
                      alt={service.nama_desain}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-bold text-stone-900">
                  {service.nama_desain}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {service.deskripsi}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-stone-300 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-600">
                    Harga {formatRupiah(service.harga_reguler)}
                  </span>
                  {inv?.is_unlimited ? (
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-700">
                      📦 Stok: Unlimited
                    </span>
                  ) : (
                    <span className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-700">
                      📦 Sisa: {inv?.sisa} / {inv?.max} Box
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* --- FOOTER BOOKING/ADMIN SECTION --- */}
      <section
        className="mx-auto max-w-7xl px-6 pb-20 pt-14 md:px-10"
        id="booking"
      >
        <div className="rounded-3xl border border-stone-300 bg-linear-to-br from-orange-100/70 via-rose-50 to-white p-7 shadow-[0_30px_80px_-40px_rgba(41,37,36,0.55)] sm:p-10">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              {isAdmin ? "Kendali Cepat" : "Booking cepat"}
            </p>
            <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
              {isAdmin
                ? "Manajemen Alur Butik Hantaran"
                : "Bikin hantaran sesuai cerita kalian"}
            </h2>
            <p className="text-base leading-relaxed text-stone-600">
              {isAdmin
                ? "Pastikan semua pesanan terverifikasi dan stok fisik box sesuai dengan data sistem."
                : "Konsultasi warna, isi, dan budget langsung. Kami bantu dari konsep sampai packing."}
            </p>
          </div>

          {!isAdmin && (
            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-2xl border border-stone-200 bg-white/80 p-4"
                >
                  <p className="text-xl font-black text-stone-900">
                    {index + 1}
                  </p>
                  <p className="mt-1 text-sm text-stone-600">{step}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {isAdmin ? (
              <Link
                className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-stone-700"
                href="/admin/dashboard"
              >
                Buka Dashboard Admin
              </Link>
            ) : (
              <Link
                className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-stone-700"
                href={bookingUrl}
              >
                Mulai booking
              </Link>
            )}

            <Link
              className="rounded-full border border-stone-400 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-800 transition duration-300 hover:-translate-y-0.5 hover:border-stone-700"
              href="#katalog"
            >
              Lihat detail paket
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
