import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Mengambil kunci rahasia dari .env
const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// Tipe data apa saja yang akan kita simpan di dalam brankas
type SessionPayload = {
  user_id: number;
  user_name: string;
  user_role: number;
};

// Fungsi Mengunci (Encrypt)
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Brankas hangus dalam 7 hari
    .sign(encodedKey);
}

// Fungsi Membuka (Decrypt)
export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    
    return null;
  }
}

// Fungsi praktis untuk dipanggil di halaman/komponen lain
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
