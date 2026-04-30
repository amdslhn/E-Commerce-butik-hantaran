import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/session";
import { cookies } from "next/headers";

interface GoogleTokenResponse {
  access_token: string;
  error?: string;
}

interface GoogleUserInfo {
  sub: string; // Google's unique user ID
  name: string;
  email: string;
  email_verified: boolean;
  picture?: string;
}

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Jika user menolak izin di halaman Google
  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/login?error=google_cancelled`);
  }

  try {
    // ── LANGKAH 1: Tukar 'code' dengan 'access_token' ──────────────────────
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google token exchange failed:", tokenData);
      return NextResponse.redirect(`${appUrl}/login?error=google_token_failed`);
    }

    // ── LANGKAH 2: Ambil info user dari Google ─────────────────────────────
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );

    const googleUser = (await userInfoRes.json()) as GoogleUserInfo;

    if (!userInfoRes.ok || !googleUser.email) {
      return NextResponse.redirect(
        `${appUrl}/login?error=google_userinfo_failed`,
      );
    }

    // ── LANGKAH 3: Cari atau buat user di database ─────────────────────────
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ google_id: googleUser.sub }, { email: googleUser.email }],
      },
    });

    if (!user) {
      // User baru → buat akun baru (role Customer = 1, langsung verified)
      user = await prisma.user.create({
        data: {
          role_id: 1,
          nama: googleUser.name,
          email: googleUser.email,
          password_hash: null,
          google_id: googleUser.sub,
          is_verified: true,
        },
      });
    } else if (!user.google_id) {
      // User sudah punya akun via email/password → hubungkan dengan Google
      user = await prisma.user.update({
        where: { id: user.id },
        data: { google_id: googleUser.sub, is_verified: true },
      });
    }

    // ── LANGKAH 4: Buat session JWT (sama seperti login biasa) ─────────────
    const sessionData = {
      user_id: user.id,
      user_name: user.nama,
      user_role: user.role_id,
    };

    const encryptedSession = await encrypt(sessionData);

    const cookieStore = await cookies();
    cookieStore.set("session", encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: "/",
    });

    // ── LANGKAH 5: Redirect sesuai role ───────────────────────────────────
    const targetPath = user.role_id === 3 ? "/admin/dashboard" : "/";
    return NextResponse.redirect(`${appUrl}${targetPath}`);
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(`${appUrl}/login?error=google_server_error`);
  }
}
