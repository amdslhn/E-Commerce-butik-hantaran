export default function HomePage() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker reveal delay-1">Butik Hantaran - kurasi lokal</p>
          <h1 className="hero-title reveal delay-2">
            Hantaran modern yang rapi, elegan, dan siap akad
          </h1>
          <p className="hero-subtitle reveal delay-3">
            Pilihan paket premium dengan palet warna lembut, detail tangan, dan
            story card yang terasa personal.
          </p>
          <div className="hero-actions reveal delay-4">
            <a className="btn primary" href="#katalog">
              Lihat katalog
            </a>
            <a className="btn ghost" href="#booking">
              Custom order
            </a>
          </div>
          <div className="hero-stats reveal delay-5">
            <div className="stat">
              <span className="stat-value">120+</span>
              <span className="stat-label">desain siap kirim</span>
            </div>
            <div className="stat">
              <span className="stat-value">48 jam</span>
              <span className="stat-label">waktu pengerjaan</span>
            </div>
            <div className="stat">
              <span className="stat-value">100%</span>
              <span className="stat-label">finishing manual</span>
            </div>
          </div>
        </div>
        <div className="hero-card reveal delay-3">
          <span className="card-eyebrow">Paket favorit minggu ini</span>
          <h2 className="card-title">Paket Sakinah</h2>
          <p className="card-note">
            Warna creamy, aksen gold, dan bunga kering pilihan.
          </p>
          <ul className="card-list">
            <li>Hantaran skincare lengkap</li>
            <li>Perlengkapan ibadah minimalis</li>
            <li>Box akrilik premium</li>
          </ul>
          <div className="card-footer">
            <span className="price">Mulai 480k</span>
            <span className="badge">free kartu ucapan</span>
          </div>
        </div>
      </section>

      <section className="features" id="fitur">
        <div className="section-head">
          <p className="section-kicker">Kenapa kami</p>
          <h2 className="section-title">Rapi, elegan, dan siap akad</h2>
          <p className="section-lede">
            Setiap paket dirancang untuk tampil cantik di foto dan terasa hangat
            saat dibuka. Detail kecil kami urus dari awal sampai akhir.
          </p>
        </div>
        <div className="feature-grid">
          <article className="feature-card reveal delay-1">
            <h3>Kurasi tema</h3>
            <p>
              Palet warna selaras, dari nude hingga earthy, sesuai karakter
              pasangan.
            </p>
          </article>
          <article className="feature-card reveal delay-2">
            <h3>Detail tangan</h3>
            <p>
              Setiap pita, label, dan bunga dirakit manual dengan finishing
              bersih.
            </p>
          </article>
          <article className="feature-card reveal delay-3">
            <h3>Custom pesan</h3>
            <p>
              Story card bisa disesuaikan untuk momen lamaran, akad, atau
              resepsi.
            </p>
          </article>
          <article className="feature-card reveal delay-4">
            <h3>Kontrol kualitas</h3>
            <p>
              Cek ulang isi, packaging, dan keamanan sebelum berangkat ke kurir.
            </p>
          </article>
        </div>
      </section>

      <section className="catalog" id="katalog">
        <div className="section-head">
          <p className="section-kicker">Koleksi pilihan</p>
          <h2 className="section-title">Katalog untuk setiap cerita</h2>
          <p className="section-lede">
            Mulai dari paket simpel hingga lengkap, semua siap disesuaikan
            dengan warna dan isi favorit.
          </p>
        </div>
        <div className="catalog-grid">
          <article className="catalog-card reveal delay-1">
            <div className="card-media media-a"></div>
            <h3>Seruni pastel</h3>
            <p>Nuansa lembut untuk acara lamaran yang hangat.</p>
            <div className="card-meta">
              <span className="tag">7 item</span>
              <span className="tag">mulai 320k</span>
            </div>
          </article>
          <article className="catalog-card reveal delay-2">
            <div className="card-media media-b"></div>
            <h3>Jingga terracotta</h3>
            <p>Pilihan earthy dengan aksen bunga kering artistik.</p>
            <div className="card-meta">
              <span className="tag">9 item</span>
              <span className="tag">mulai 420k</span>
            </div>
          </article>
          <article className="catalog-card reveal delay-3">
            <div className="card-media media-c"></div>
            <h3>Ivory luxe</h3>
            <p>Sentuhan premium untuk hari akad yang berkesan.</p>
            <div className="card-meta">
              <span className="tag">11 item</span>
              <span className="tag">mulai 520k</span>
            </div>
          </article>
        </div>
      </section>

      <section className="booking" id="booking">
        <div className="booking-card">
          <div className="booking-copy">
            <p className="section-kicker">Booking cepat</p>
            <h2 className="section-title">
              Bikin hantaran sesuai cerita kalian
            </h2>
            <p className="section-lede">
              Konsultasi warna, isi, dan budget langsung. Kami bantu dari konsep
              sampai packing.
            </p>
          </div>
          <div className="booking-steps">
            <div className="step">
              <span className="step-index">1</span>
              <p className="step-text">Pilih tema dan warna favorit.</p>
            </div>
            <div className="step">
              <span className="step-index">2</span>
              <p className="step-text">Kurasi isi paket sesuai kebutuhan.</p>
            </div>
            <div className="step">
              <span className="step-index">3</span>
              <p className="step-text">Kami kirim preview sebelum produksi.</p>
            </div>
          </div>
          <div className="hero-actions">
            <a className="btn primary" href="/booking">
              Mulai booking
            </a>
            <a className="btn ghost" href="/katalog">
              Lihat detail paket
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
