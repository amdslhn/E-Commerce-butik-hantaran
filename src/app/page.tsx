import Image from "next/image";
import { getCurrentInventory } from "@/lib/inventory";

export default async function HomePage() {
  const inventory = await getCurrentInventory();

  const stats = [
    {
      value: `${inventory.sisaBox} box`,
      label: "tersisa & bisa dipesan",
    },
    {
      value: `${inventory.maxCapacity} box`,
      label: "kapasitas total",
    },
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

  const services = [
    {
      namaDesain: "Rustic Wood Tray",
      deskripsi: "Desain kayu natural yang hangat, bertema alam dan estetik",
      hargaReguler: 50000,
      hargaWo: 40000,
      imageUrl: "/Rustic_wood_tray.jpeg",
    },
    {
      namaDesain: "Classic White Gold Tray",
      deskripsi: "Perpaduan warna putih dan emas yang elegan dan klasik",
      hargaReguler: 80000,
      hargaWo: 50000,
      imageUrl: "/Classic_white_gold_tray.jpeg",
    },
    {
      namaDesain: "Pearl Tray",
      deskripsi: "Berbalut hiasan mutiara mewah untuk kesan premium",
      hargaReguler: 60000,
      hargaWo: 45000,
      imageUrl: "/Pearl_tray.jpeg",
    },
    {
      namaDesain: "Crystal Tray",
      deskripsi: "Desain akrilik bening mengkilap yang memantulkan cahaya",
      hargaReguler: 75000,
      hargaWo: 55000,
      imageUrl: "/Crystal_tray.jpeg",
    },
    {
      namaDesain: "Hidden Hantaran",
      deskripsi:
        "Desain tertutup (acrylic box) eksklusif untuk menjaga kejutan",
      hargaReguler: 85000,
      hargaWo: 60000,
      imageUrl: "/Hidden_hantaran.jpeg",
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
            Butik Hantaran - kurasi lokal
          </p>
          <h1 className="max-w-2xl text-balance text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Hantaran modern yang rapi, elegan, dan siap akad
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-stone-600 sm:text-lg">
            Pilihan paket premium dengan palet warna lembut, detail tangan, dan
            story card yang terasa personal.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-stone-700"
              href="#katalog"
            >
              Lihat katalog
            </a>
            <a
              className="rounded-full border border-stone-400 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-800 transition duration-300 hover:-translate-y-0.5 hover:border-stone-700"
              href="#booking"
            >
              Custom order
            </a>
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
        </div>

        <aside className="rounded-3xl border border-stone-300 bg-linear-to-br from-white via-orange-50 to-rose-50 p-7 shadow-[0_30px_80px_-30px_rgba(41,37,36,0.45)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
            Paket favorit minggu ini
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900">
            Paket Sakinah
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Warna creamy, aksen gold, dan bunga kering pilihan.
          </p>
          <ul className="mt-5 space-y-3 text-sm text-stone-700">
            <li className="rounded-xl bg-white/80 px-4 py-3">
              Hantaran skincare lengkap
            </li>
            <li className="rounded-xl bg-white/80 px-4 py-3">
              Perlengkapan ibadah minimalis
            </li>
            <li className="rounded-xl bg-white/80 px-4 py-3">
              Box akrilik premium
            </li>
          </ul>
          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-lg font-bold text-stone-900">Mulai 480k</span>
            <span className="rounded-full border border-orange-300 bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700">
              free kartu ucapan
            </span>
          </div>
        </aside>
      </section>

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
          {services.map((service) => (
            <article
              key={service.namaDesain}
              className="rounded-2xl border border-stone-200 bg-white/85 p-4 shadow-[0_22px_40px_-30px_rgba(41,37,36,0.55)] transition duration-300 hover:-translate-y-1"
            >
              <div className="h-56 rounded-xl bg-white p-2 ring-1 ring-stone-200 sm:h-64">
                <div className="relative h-full w-full">
                  <Image
                    src={service.imageUrl}
                    alt={service.namaDesain}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-bold text-stone-900">
                {service.namaDesain}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {service.deskripsi}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-stone-300 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Reguler {formatRupiah(service.hargaReguler)}
                </span>
                <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-700">
                  WO {formatRupiah(service.hargaWo)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-6 pb-20 pt-14 md:px-10"
        id="booking"
      >
        <div className="rounded-3xl border border-stone-300 bg-linear-to-br from-orange-100/70 via-rose-50 to-white p-7 shadow-[0_30px_80px_-40px_rgba(41,37,36,0.55)] sm:p-10">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
              Booking cepat
            </p>
            <h2 className="text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">
              Bikin hantaran sesuai cerita kalian
            </h2>
            <p className="text-base leading-relaxed text-stone-600">
              Konsultasi warna, isi, dan budget langsung. Kami bantu dari konsep
              sampai packing.
            </p>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-stone-200 bg-white/80 p-4"
              >
                <p className="text-xl font-black text-stone-900">{index + 1}</p>
                <p className="mt-1 text-sm text-stone-600">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-stone-700"
              href="/booking"
            >
              Mulai booking
            </a>
            <a
              className="rounded-full border border-stone-400 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-800 transition duration-300 hover:-translate-y-0.5 hover:border-stone-700"
              href="/katalog"
            >
              Lihat detail paket
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
