"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateServiceStock(
  serviceId: number,
  newStock: number,
  isUnlimited: boolean,
) {
  await prisma.service.update({
    where: { id: serviceId },
    data: {
      stok_box: newStock,
      is_unlimited: isUnlimited,
    },
  });

  revalidatePath("/admin/services");
  revalidatePath("/"); // Update beranda
}
