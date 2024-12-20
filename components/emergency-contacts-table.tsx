// components/emergency-contacts-table.tsx
"use client"

import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Phone, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface EmergencyContact {
  id: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

interface Patient {
  id: string
  name: string
  email: string
  city: string
  gender: string
  createdAt: string
  emergency_patient_details: EmergencyContact[]
}

interface EmergencyContactsTableProps {
  patients: Patient[]
}

const columns: ColumnDef<Patient>[] = [
  {
    id: "expander",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Patient Details",
    cell: ({ row }) => {
      const patient = row.original
      return (
        <div className="space-y-1">
          <div className="font-medium">{patient.name}</div>
          <div className="text-sm text-muted-foreground">{patient.email}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {patient.city}
            <User className="h-3 w-3 ml-2" /> {patient.gender}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "emergency_patient_details",
    header: "Emergency Contacts",
    cell: ({ row }) => {
      const contacts = row.original.emergency_patient_details
      return (
        <Badge variant="secondary">
          {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registration Date",
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPp"),
  },
]

const renderSubComponent = ({ row }: { row: any }) => {
  const contacts = row.original.emergency_patient_details

  return (
    <div className="p-4 bg-muted/50 space-y-4">
      <h4 className="font-medium text-sm">Emergency Contact Numbers</h4>
      <div className="grid gap-3">
        {contacts.map((contact: EmergencyContact) => (
          <div 
            key={contact.id} 
            className="flex items-center justify-between bg-background p-3 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span className="font-medium">{contact.phoneNumber}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Added {format(new Date(contact.createdAt), "PP")}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function EmergencyContactsTable({ patients }: EmergencyContactsTableProps) {
  const table = useReactTable({
    data: patients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand: () => true,
  })

  return (
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell 
                        colSpan={columns.length}
                        className="p-0"
                      >
                        {renderSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No emergency contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}