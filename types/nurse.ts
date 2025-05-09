import { type nurses, type nurse_verifications } from "@prisma/client"

export type NurseWithVerification = nurses & {
  nurse_verifications: nurse_verifications | null
}

export const VERIFICATION_STATUSES = {
  PENDING: "Pending Review",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected"
} as const

export type VerificationStatus = keyof typeof VERIFICATION_STATUSES

export type StatusUpdate = {
  nurseId: string
  status: VerificationStatus
} 