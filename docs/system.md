# Butik Hantaran - System Overview

## Ringkas

Aplikasi ini mengelola pemesanan box hantaran dengan peran Customer dan Admin. Sistem fokus pada proses booking, pengelolaan stok, verifikasi akun, dan dashboard admin untuk memantau status operasional pesanan.

## Tech Stack

- Next.js App Router (Server Components + Server Actions)
- Prisma ORM + PostgreSQL
- React 19, Tailwind CSS
- Auth: JWT cookie (jose) + Google OAuth
- Email OTP: nodemailer (SMTP Gmail)

## Entitas Data Utama

- Role: definisi peran (Customer/Admin)
- User: akun pengguna, opsional Google OAuth
- Service: katalog layanan desain, stok, status aktif
- Booking: data pemesanan, status operasional, metadata JSON
- VerificationToken: OTP verifikasi email

### BookingStatus

- PENDING: menunggu konfirmasi admin
- CONFIRMED: sudah dikonfirmasi admin
- READY: siap diambil
- PICKED_UP: barang diambil
- RETURNED: barang kembali
- CANCELLED: dibatalkan

## Alur Booking (Customer)

1. Customer mengisi form booking.
2. Server Action melakukan validasi (Zod), cek stok, hitung tanggal operasional.
3. Booking dibuat dengan status PENDING dan metadata pengantin/WO disimpan di JSONB.
4. Customer memantau status di halaman tracking.

## Alur Admin

- Admin Dashboard menampilkan tab status: aktif (PENDING/CONFIRMED/READY), pending, confirmed, history.
- Admin dapat menandai "Barang Diterima" pada booking PENDING.
- Aksi tersebut mengubah status menjadi CONFIRMED dan menyimpan daftar item ke metadata.
- Admin dapat membuat booking manual (offline/WA) dan langsung berstatus CONFIRMED.

## Inventory dan Stok

- Booking dengan status CANCELLED dan RETURNED tidak memblok stok.
- Ketersediaan dihitung dari overlap drop_off_date dan return_date.
- Layanan dengan is_unlimited tidak dibatasi stok.

## Halaman Utama

- /booking: form booking customer
- /booking/[id]: detail booking + daftar barang diterima
- /pesanan: tracking status booking customer
- /admin/dashboard: tabel kontrol admin

## Server Actions

- checkoutBooking: membuat booking PENDING setelah validasi dan cek stok.
- markGoodsReceived: menerima barang dan set status CONFIRMED.
- createManualBooking: input manual booking oleh admin.

## API Routes

- /api/auth/google: redirect ke OAuth Google
- /api/auth/google/callback: verifikasi OAuth, buat session cookie
- /api/cron/cancel: auto-cancel booking PENDING yang melewati H-3

## Background Job

- Cron cancel: mengubah booking PENDING menjadi CANCELLED bila drop_off_date < hari ini (WIB).

## Environment Variables

- DATABASE_URL: koneksi PostgreSQL
- JWT_SECRET: kunci tanda tangan JWT session
- GOOGLE_CLIENT_ID: OAuth Google
- GOOGLE_CLIENT_SECRET: OAuth Google
- NEXT_PUBLIC_APP_URL: base URL aplikasi
- EMAIL_USER: SMTP Gmail user
- EMAIL_PASS: SMTP Gmail password/app password
- CRON_SECRET: token bearer untuk /api/cron/cancel

## Catatan Teknis

- Session disimpan di cookie "session" dengan JWT (7 hari).
- Tanggal operasional dihitung dari event_date dengan aturan H-3/H-1/H+2.
- Metadata booking (JSONB) menyimpan data pengantin, catatan, dan intake.

## Rencana/Pengembangan Lanjutan

- Integrasi payment gateway QRIS dan webhook pembayaran.
- Pemisahan payment_status dari status_booking.
- Tombol admin untuk set READY dan CANCELLED.
