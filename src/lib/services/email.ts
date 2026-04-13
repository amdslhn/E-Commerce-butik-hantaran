import { Resend } from "resend";

// Mengambil API Key dari file .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTP(email: string, otpCode: string) {
  try {
    // resend.emails.send() harus di-await dan mereturn object { data, error }
    const { data, error } = await resend.emails.send({
      // Gunakan onboarding@resend.dev untuk testing, ganti dengan domainmu saat produksi [cite: 13, 20]
      from: "Butik Hantaran <onboarding@resend.dev>",
      to: [email], // Pastikan email tujuan adalah email testingmu saat MVP
      subject: "Kode Verifikasi Anda - Butik Hantaran",
      html: `
        <h2>Verifikasi Akun</h2>
        <p>Kode OTP Anda adalah: <strong>${otpCode}</strong></p>
        <p>Kode ini berlaku selama 15 menit. Jangan berikan kode ini kepada siapa pun.</p>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Mail Service Failed:", error);
    return { success: false, error: "Gagal mengirim email sistem." };
  }
}
