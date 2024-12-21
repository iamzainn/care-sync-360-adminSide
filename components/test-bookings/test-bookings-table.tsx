
"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import { ChevronDown, ChevronRight, MoreVertical } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { updateBookingStatus } from "@/lib/actions/test-booking"

interface TestBooking {
  id: string
  patientId: string
  patients: {
    name: string
    email: string
    phone: string
  }
  bookingDate: Date
  status: string
  paymentStatus: string
  paymentMethod: string
  amount: number
  serviceCharge: number
  totalAmount: number
  address: string
  phoneNumber: string
  bookedTests: {
    testId: string
    testName: string
    labId: string
    labName: string
    price: number
    discountedPrice?: number
  }[]
  stripePaymentId?: string | null
  paymentDate?: Date | null
  createdAt: Date
  updatedAt: Date
}

const columns: ColumnDef<TestBooking>[] = [
  {
    id: "expander",
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button
          variant="ghost"
          onClick={row.getToggleExpandedHandler()}
          className="h-8 w-8 p-0"
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      ) : null
    }
  },
  {
    accessorKey: "bookingDate",
    header: "Booking Date",
    cell: ({ row }) => format(new Date(row.original.bookingDate), "PPp")
  },
  {
    accessorKey: "patient",
    header: "Patient Details",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="font-medium">{row.original.patients.name}</p>
        <p className="text-sm text-muted-foreground">{row.original.patients.email}</p>
        <p className="text-sm text-muted-foreground">{row.original.phoneNumber}</p>
      </div>
    )
  },
  {
    accessorKey: "bookedTests",
    header: "Tests",
    cell: ({ row }) => (
      <span>{row.original.bookedTests.length} tests booked</span>
    )
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p className="font-medium">Rs. {row.original.totalAmount}</p>
        <Badge variant={row.original.paymentMethod === 'CARD' ? 'default' : 'secondary'}>
          {row.original.paymentMethod === 'CARD' ? 'Card Payment' : 'Cash on Collection'}
        </Badge>
      </div>
    )
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.paymentStatus === 'COMPLETED' ? 'default' :
          row.original.paymentStatus === 'PENDING' ? 'outline' : 'destructive'
        }
      >
        {row.original.paymentStatus}
      </Badge>
    )
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === 'COMPLETED' ? 'default' :
          row.original.status === 'PROCESSING' ? 'outline' :
          row.original.status === 'CANCELLED' ? 'destructive' :
          'secondary'
        }
      >
        {row.original.status}
      </Badge>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <BookingActions booking={row.original} />
  }
]

function BookingActions({ booking }: { booking: TestBooking }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const { toast } = useToast()

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return

    const result = await updateBookingStatus(booking.id, selectedStatus as any)
    
    if (result.success) {
      toast({
        title: "Status Updated",
        description: `Booking status has been updated to ${selectedStatus}`
      })
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update booking status"
      })
    }
    
    setIsOpen(false)
    setSelectedStatus(null)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {['PENDING', 'SAMPLE_COLLECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map((status) => (
            <DropdownMenuItem
              key={status}
              onClick={() => {
                setSelectedStatus(status)
                setIsOpen(true)
              }}
              disabled={booking.status === status}
            >
              Update to {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Booking Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this bookings status to {selectedStatus}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedStatus(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusUpdate}>
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function TestDetails({ tests }: { tests: TestBooking['bookedTests'] }) {
  return (
    <div className="p-4 bg-muted/50 space-y-4">
      <h4 className="font-medium mb-2">Booked Tests</h4>
      <div className="space-y-3">
        {tests.map((test, index) => (
          <div 
            key={`${test.testId}-${index}`}
            className="bg-background p-3 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{test.testName}</p>
                <p className="text-sm text-muted-foreground">
                  Lab: {test.labName}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  Rs. {test.discountedPrice || test.price}
                </p>
                {test.discountedPrice && (
                  <p className="text-sm text-muted-foreground line-through">
                    Rs. {test.price}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface TestBookingsTableProps {
  bookings: TestBooking[]
}

export function TestBookingsTable({ bookings }: TestBookingsTableProps) {
  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
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
                <>
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
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-0">
                        <TestDetails tests={row.original.bookedTests} />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
