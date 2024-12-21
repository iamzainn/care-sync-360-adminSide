// src/components/orders/orders-table.tsx
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
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  MoreVertical, 
  ExternalLink,
  AlertCircle 
} from "lucide-react"
import { type MedicineOrderWithTransaction } from "@/types"
import { ORDER_STATUSES } from "@/types"
import { updateOrderStatus } from "@/app/actions/update-order-status"
import { useToast } from "@/hooks/use-toast"


const columns: ColumnDef<MedicineOrderWithTransaction>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs whitespace-nowrap">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "patientName",
    header: "Patient",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.getValue("patientName")}</p>
        <p className="text-sm text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "medicines",
    header: "Medicines",
    cell: ({ row }) => {
      const medicines = row.getValue("medicines") as string[]
      return medicines && medicines.length > 0 ? (
        <div className="max-w-[200px] space-y-1">
          {medicines.map((medicine, index) => (
            <Badge key={index} variant="secondary" className="mr-1">
              {medicine}
            </Badge>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      )
    },
  },
  {
    accessorKey: "prescriptionUrl",
    header: "Prescription",
    cell: ({ row }) => {
      const url = row.getValue("prescriptionUrl") as string
      return url ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(url, '_blank')}
          className="flex items-center gap-1"
        >
          View <ExternalLink className="h-4 w-4" />
        </Button>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      )
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">
          Rs. {row.getValue<number>("totalAmount").toFixed(2)}
        </p>
        <p className="text-sm text-muted-foreground">
          {row.original.paymentMethod === "CARD" ? "Card Payment" : "Cash on Delivery"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string
      return (
        <Badge
          variant={status === "COMPLETED" ? "default" : 
                 status === "PENDING" ? "default" : "outline"}
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as keyof typeof ORDER_STATUSES
      return (
        <Badge
          variant={
            status === "DELIVERED" ? "default" :
            status === "PROCESSING" ? "outline" :
            status === "CANCELLED" ? "destructive" : 
            "secondary"
          }
        >
          {ORDER_STATUSES[status]}
        </Badge>
      )
    },
  },
  {
    accessorKey: "pharmacyName",
    header: "Pharmacy",
    cell: ({ row }) => {
      const pharmacy = row.getValue("pharmacyName") as string
      return pharmacy || <span className="text-muted-foreground">N/A</span>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue<Date>("createdAt")
      return <span className="whitespace-nowrap">{format(date, "PPp")}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <OrderActions order={row.original} />,
  },
]

function OrderActions({ order }: { order: MedicineOrderWithTransaction }) {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState<string | null>(null)
  const { toast } = useToast()

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return

    const result = await updateOrderStatus(order.id, selectedStatus as any)
    
    if (result.success) {
      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${ORDER_STATUSES[selectedStatus as keyof typeof ORDER_STATUSES]}`,
      })
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status",
      })
    }
    
    setOpen(false)
    setSelectedStatus(null)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {Object.entries(ORDER_STATUSES).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => {
                setSelectedStatus(key)
                setOpen(true)
              }}
              disabled={order.orderStatus === key}
            >
              Update to {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Order Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this orders status to{" "}
              {selectedStatus && ORDER_STATUSES[selectedStatus as keyof typeof ORDER_STATUSES]}?
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

interface OrdersTableProps {
  orders: MedicineOrderWithTransaction[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const table = useReactTable({
    data: orders,
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
                    No orders found.
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