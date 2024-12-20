// src/app/actions/update-verification.ts
"use server"

import { db } from "@/lib/db"
import { VerificationStatus } from "@/types/doctor"
import { revalidatePath } from "next/cache"

export async function updateVerificationStatus(
  doctorId: string, 
  status: VerificationStatus
) {
  try {
    // Update verification status
    await db.doctorVerification.update({
      where: { doctorId },
      data: { status : status }
    })

    // Update doctor verification flag if approved
    if (status === 'APPROVED') {
      await db.doctors.update({
        where: { id: doctorId },
        data: { isVerifiedDoctor: true }
      })
    }

    revalidatePath("/doctor-verifications")
    return { success: true }
  } catch (error) {
    console.error("Failed to update verification status:", error)
    return { success: false, error: "Failed to update status" }
  }
}