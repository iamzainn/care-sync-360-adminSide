// src/app/doctor-verifications/page.tsx
import { Metadata } from "next"
import { db } from "@/lib/db"
import { DoctorVerificationsTable } from "@/components/doctor-verifications-table"


export const metadata: Metadata = {
  title: "Doctor Verifications",
  description: "Manage and review doctor verification requests",
}

async function getDoctorVerifications() {
  const verifications = await db.doctors.findMany({
    where: {
      DoctorVerification: {
        isNot: null
      }
    },
    include: {
      DoctorVerification: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return verifications
}

export default async function DoctorVerificationsPage() {
  const doctors = await getDoctorVerifications()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Doctor Verifications</h1>
      <DoctorVerificationsTable doctors={doctors} />
    </div>
  )
}