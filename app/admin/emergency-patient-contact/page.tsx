// app/emergency-patient-contact/page.tsx
import { Metadata } from "next"
import { db } from "@/lib/db"
import { EmergencyContactsTable } from "@/components/emergency-contacts-table"
import { json } from "stream/consumers"
// import { EmergencyContactsTable } from "@/components/emergency-contacts-table"

export const metadata: Metadata = {
  title: "Emergency Patient Contacts",
  description: "View all patient emergency contacts"
}

async function getEmergencyContacts() {
  const patients = await db.patients.findMany({
    select:{
        email:true,
        city:true,
        name:true,
        gender:true,
        id:true,
        createdAt:true,
        emergency_patient_details:{
            select:{
                id:true,
                phoneNumber:true,
                createdAt:true,
                updatedAt:true
            }
        }
    },
    
    
    
    
  })
  return patients
}

export default async function EmergencyContactsPage() {
  const patients = await getEmergencyContacts()
  

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Emergency Patient Contacts</h1>
      <EmergencyContactsTable patients= {patients as any}  />
    </div>
  )
}