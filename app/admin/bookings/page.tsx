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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  MoreHorizontal, 
  CalendarCheck, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter
} from "lucide-react"
import { mockBookings } from "@/lib/mock-data"
import { BookingStatus } from "@/lib/types"
import { format } from "date-fns"

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredBookings = mockBookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusConfig: Record<BookingStatus, { color: string, icon: React.ElementType }> = {
    pending: { color: "bg-chart-4/10 text-chart-4", icon: Clock },
    confirmed: { color: "bg-primary/10 text-primary", icon: CheckCircle },
    "checked_in": { color: "bg-chart-2/10 text-chart-2", icon: CalendarCheck },
    "checked_out": { color: "bg-muted text-muted-foreground", icon: CheckCircle },
    cancelled: { color: "bg-destructive/10 text-destructive", icon: XCircle },
    no_show: { color: "bg-destructive/10 text-destructive", icon: XCircle }
  }

  const stats = [
    { label: "Total Bookings", value: mockBookings.length },
    { label: "Pending", value: mockBookings.filter(b => b.status === "pending").length },
    { label: "Confirmed", value: mockBookings.filter(b => b.status === "confirmed").length },
    { label: "Checked In", value: mockBookings.filter(b => b.status === "checked_in").length }
  ]

  return (
    <DashboardLayout requiredRoles={["admin"]} title="Booking Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>View and manage all hotel reservations</CardDescription>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by guest name, room, or booking ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked_in">Checked In</SelectItem>
                  <SelectItem value="checked_out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    const StatusIcon = statusConfig[booking.status].icon
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.customerName}</p>
                            <p className="text-sm text-muted-foreground">{booking.customerEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Room {booking.roomNumber}</p>
                            <p className="text-sm text-muted-foreground">{booking.numberOfGuests} guests</p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.checkInDate instanceof Date ? format(booking.checkInDate, "MMM dd, yyyy") : "N/A"}</TableCell>
                        <TableCell>{booking.checkOutDate instanceof Date ? format(booking.checkOutDate, "MMM dd, yyyy") : "N/A"}</TableCell>
                        <TableCell className="font-medium">ETB {booking.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={statusConfig[booking.status].color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {booking.status}
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
                                <Edit className="mr-2 h-4 w-4" /> Edit Booking
                              </DropdownMenuItem>
                              {booking.status === "pending" && (
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" /> Confirm
                                </DropdownMenuItem>
                              )}
                              {booking.status === "confirmed" && (
                                <DropdownMenuItem>
                                  <CalendarCheck className="mr-2 h-4 w-4" /> Check In
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <CalendarCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No bookings found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
