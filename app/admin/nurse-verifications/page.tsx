import { Metadata } from "next"
import { db } from "@/lib/db"
import { NurseVerificationsTable } from "@/components/nurse-verifications-table"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Nurse Verifications",
  description: "Manage and review nurse verification requests",
}

async function getNurseVerifications() {
  const verifications = await db.nurses.findMany({
    where: {
      nurse_verifications: {
        isNot: null
      }
    },
    include: {
      nurse_verifications: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return verifications
}

export default async function NurseVerificationsPage() {
  const nurses = await getNurseVerifications()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Nurse Verifications</h1>
      <NurseVerificationsTable nurses={nurses} />
    </div>
  )
} 