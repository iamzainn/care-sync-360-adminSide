"use server"

import { db } from "@/lib/db"
import { VerificationStatus } from "@/types/nurse"
import { revalidatePath } from "next/cache"

export async function updateNurseVerificationStatus(
  nurseId: string, 
  status: VerificationStatus
) {
  try {
    // Update verification status
    await db.nurse_verifications.update({
      where: { nurseId },
      data: { status }
    })

    // Update nurse verification flag if approved
    if (status === 'APPROVED') {
      await db.nurses.update({
        where: { id: nurseId },
        data: { isVerifiedNurse: true }
      })
    }

    revalidatePath("/nurse-verifications")
    return { success: true }
  } catch (error) {
    console.error("Failed to update nurse verification status:", error)
    return { success: false, error: "Failed to update status" }
  }
} 