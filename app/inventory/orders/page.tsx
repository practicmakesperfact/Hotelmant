"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  MoreHorizontal, 
  ShoppingCart, 
  Plus,
  Filter,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Download,
  Printer
} from "lucide-react"
import { mockPurchaseOrders } from "@/lib/mock-data"
import { PurchaseOrderStatus } from "@/lib/types"
import { format } from "date-fns"

export default function InventoryOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders = mockPurchaseOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusConfig: Record<PurchaseOrderStatus, { color: string, icon: React.ElementType }> = {
    draft: { color: "bg-muted text-muted-foreground", icon: Clock },
    submitted: { color: "bg-blue-500/10 text-blue-500", icon: FileText },
    approved: { color: "bg-primary/10 text-primary", icon: CheckCircle2 },
    ordered: { color: "bg-amber-500/10 text-amber-500", icon: ShoppingCart },
    received: { color: "bg-green-500/10 text-green-500", icon: CheckCircle2 },
    partial: { color: "bg-amber-500/10 text-amber-500", icon: Clock },
    cancelled: { color: "bg-destructive/10 text-destructive", icon: XCircle }
  }

  return (
    <DashboardLayout requiredRoles={["inventory_manager"]} title="Purchase Orders">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Track and manage supply purchase orders</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Order
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by order number or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Info</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Expected Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const status = statusConfig[order.status]
                    const StatusIcon = status.icon
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-mono text-xs font-bold">{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {format(order.createdAt, "MMM dd, yyyy")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{order.supplierName}</p>
                          <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-bold">ETB {order.totalAmount.toLocaleString()}</p>
                        </TableCell>
                        <TableCell>
                          {order.expectedDelivery ? (
                            <p className="text-sm">{format(order.expectedDelivery, "MMM dd, yyyy")}</p>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">Not set</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${status.color} border-transparent shadow-none capitalize flex w-fit items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="mr-2 h-4 w-4" /> Print PO
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" /> Export PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {order.status === 'ordered' && (
                                <DropdownMenuItem className="text-primary">
                                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Received
                                </DropdownMenuItem>
                              )}
                              {['draft', 'submitted'].includes(order.status) && (
                                <DropdownMenuItem className="text-destructive">
                                  <XCircle className="mr-2 h-4 w-4" /> Cancel Order
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No purchase orders found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
