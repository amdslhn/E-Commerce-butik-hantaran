"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markGoodsReceived(bookingId: number) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status_booking: "CONFIRMED", 
      },
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error marking goods received:", error);
    return { success: false, error: "Gagal memperbarui status pesanan." };
  }
}
