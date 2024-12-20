// src/types/doctor.ts
import { type doctors, type DoctorVerification } from "@prisma/client"

export type DoctorWithVerification = doctors & {
  DoctorVerification: DoctorVerification | null
}

export const VERIFICATION_STATUSES = {
  PENDING: "Pending Review",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected"
} as const




export type VerificationStatus = keyof typeof VERIFICATION_STATUSES

export type StatusUpdate = {
  doctorId: string
  status: VerificationStatus
}