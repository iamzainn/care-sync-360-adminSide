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
import { MoreVertical } from "lucide-react"
import { NurseWithVerification, VERIFICATION_STATUSES } from "@/types/nurse"
import { updateNurseVerificationStatus } from "@/app/actions/update-nurse-verification"
import { useToast } from "@/hooks/use-toast"

const columns: ColumnDef<NurseWithVerification>[] = [
  {
    accessorKey: "name",
    header: "Nurse Details",
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
          <p className="text-sm text-muted-foreground">{row.original.phone}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "nurse_verifications",
    header: "Services",
    cell: ({ row }) => {
      const verification = row.original.nurse_verifications
      return verification?.services ? (
        <div className="max-w-[200px] space-y-1">
          {verification.services.map((service, index) => (
            <Badge key={index} variant="secondary" className="mr-1">
              {service}
            </Badge>
          ))}
        </div>
      ) : null
    },
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => <span>{row.original.city}</span>,
  },
  {
    accessorKey: "nurse_verifications.status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.nurse_verifications?.status
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
      const date = row.original.nurse_verifications?.createdAt
      return date ? <span>{format(date, "PP")}</span> : null
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <VerificationActions nurse={row.original} />,
  },
]

function VerificationActions({ nurse }: { nurse: NurseWithVerification }) {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null)
  const { toast } = useToast()

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !nurse.nurse_verifications) return

    const result = await updateNurseVerificationStatus(
      nurse.nurse_verifications.nurseId,
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

  if (!nurse.nurse_verifications) return null

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
              disabled={nurse.nurse_verifications?.status === key}
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
              Are you sure you want to mark this nurse&apos;s verification as{" "}
              {selectedStatus && VERIFICATION_STATUSES[selectedStatus as keyof typeof VERIFICATION_STATUSES]}?
              {selectedStatus === "APPROVED" && 
                " This will allow the nurse to provide services on the platform."}
              {selectedStatus === "REJECTED" && 
                " The nurse will need to reapply with correct information."}
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

interface NurseVerificationsTableProps {
  nurses: NurseWithVerification[]
}

export function NurseVerificationsTable({ nurses }: NurseVerificationsTableProps) {
  const table = useReactTable({
    data: nurses,
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