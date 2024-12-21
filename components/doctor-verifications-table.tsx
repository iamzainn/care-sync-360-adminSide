// src/components/doctor-verifications-table.tsx
"use client"

import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, MoreVertical } from "lucide-react"
import { DoctorWithVerification, VERIFICATION_STATUSES } from "@/types/doctor"
import { updateVerificationStatus } from "@/app/actions/update-verification"
import { useToast } from "@/hooks/use-toast"


const columns: ColumnDef<DoctorWithVerification>[] = [
  {
    accessorKey: "title",
    header: "Doctor Details",
    cell: ({ row }) => {
      const verification = row.original.DoctorVerification
      return (
        <div className="space-y-1">
          <p className="font-medium">
            {row.getValue("title")} {verification?.fullName}
          </p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
          <p className="text-sm text-muted-foreground">{verification?.phoneNumber}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "DoctorVerification",
    header: "Professional Info",
    cell: ({ row }) => {
      const verification = row.original.DoctorVerification
      return verification ? (
        <div className="space-y-1">
          <p className="text-sm">PMC: {verification.pmcNumber}</p>
          <p className="text-sm">CNIC: {verification.cnic}</p>
          <p className="text-sm">Experience: {verification.experienceYears} years</p>
        </div>
      ) : null
    },
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
    cell: ({ row }) => {
      const verification = row.original.DoctorVerification
      return verification?.specialization ? (
        <div className="max-w-[200px] space-y-1">
          {verification.specialization.map((spec, index) => (
            <Badge key={index} variant="secondary" className="mr-1">
              {spec}
            </Badge>
          ))}
        </div>
      ) : null
    },
  },
  {
    id: "documents",
    header: "Documents",
    cell: ({ row }) => {
      const verification = row.original.DoctorVerification
      if (!verification) return null

      const documents = [
        { name: "Profile Photo", url: verification.profilePhoto },
        { name: "Degree", url: verification.degreeImage },
        { name: "PMC License", url: verification.pmcImage },
        { name: "CNIC", url: verification.cnicImage },
      ]

      return (
        <div className="space-y-1">
          {documents.map((doc, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => window.open(doc.url, '_blank')}
              className="w-full justify-start text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {doc.name}
            </Button>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "DoctorVerification.status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.DoctorVerification?.status
      if (!status) return null


   

      return (
        <Badge
          variant={
            status === "APPROVED" ? "default" :
            status === "REJECTED" ? "secondary" :
            status === "UNDER_REVIEW" ? "destructive" :
            "secondary"
          }
        >
          {VERIFICATION_STATUSES[status]}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Applied Date",
    cell: ({ row }) => {
      const date = row.original.DoctorVerification?.createdAt
      return date ? <span>{format(date, "PP")}</span> : null
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <VerificationActions doctor={row.original} />,
  },
]

function VerificationActions({ doctor }: { doctor: DoctorWithVerification }) {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null)
  const { toast } = useToast()

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !doctor.DoctorVerification) return

    const result = await updateVerificationStatus(
      doctor.DoctorVerification.doctorId,
      selectedStatus as any
    )
    
    if (result.success) {
      toast({
        title: "Status Updated",
        description: `Verification status has been updated to ${
          VERIFICATION_STATUSES[selectedStatus as keyof typeof VERIFICATION_STATUSES]
        }`,
      })
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update verification status",
      })
    }
    
    setOpen(false)
    setSelectedStatus(null)
  }

  if (!doctor.DoctorVerification) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
          {Object.entries(VERIFICATION_STATUSES).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => {
                setSelectedStatus(key)
                setOpen(true)
              }}
              disabled={doctor.DoctorVerification?.status === key}
            >
              Mark as {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Verification Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this doctors verification as{" "}
              {selectedStatus && VERIFICATION_STATUSES[selectedStatus as keyof typeof VERIFICATION_STATUSES]}?
              {selectedStatus === "APPROVED" && 
                " This will allow the doctor to provide services on the platform."}
              {selectedStatus === "REJECTED" && 
                " The doctor will need to reapply with correct documents."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedStatus(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusUpdate}>
              Update Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface DoctorVerificationsTableProps {
  doctors: DoctorWithVerification[]
}

export function DoctorVerificationsTable({ doctors }: DoctorVerificationsTableProps) {
  const table = useReactTable({
    data: doctors,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Card className="overflow-hidden">
      <div className="relative rounded-md border">
        <div className="overflow-x-auto">
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
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No verification requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
}