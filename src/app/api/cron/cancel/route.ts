import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Aktifkan plugin timezone
dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(request: Request) {
  // 1. VERIFIKASI KEAMANAN (request DIGUNAKAN DI SINI)
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    // 2. Tentukan "Hari Ini" berdasarkan zona waktu Jakarta
    const startOfTodayWIB = dayjs().tz("Asia/Jakarta").startOf("day").toDate();

    // 3. Eksekusi Pembatalan (H-3 logic)
    const expired = await prisma.booking.updateMany({
      where: {
        status_booking: "PENDING",
        drop_off_date: { lt: startOfTodayWIB },
      },
      data: { status_booking: "CANCELLED" },
    });

    return NextResponse.json({
      success: true,
      cancelledCount: expired.count,
      timestamp: dayjs().tz("Asia/Jakarta").format(),
    });
  } catch (error) {
    console.error("Cron Sweeper Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyapu database." },
      { status: 500 },
    );
  }
}
