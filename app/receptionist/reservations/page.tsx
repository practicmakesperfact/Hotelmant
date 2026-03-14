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
  Search, 
  MoreHorizontal, 
  CalendarCheck, 
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Filter,
  Eye,
  LogOut,
  LogIn
} from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockBookings } from "@/lib/mock-data"
import { BookingStatus } from "@/lib/types"
import { format } from "date-fns"

export default function ReceptionistReservationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredBookings = mockBookings.filter(booking => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchLower) ||
      booking.roomNumber.toLowerCase().includes(searchLower) ||
      booking.id.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = [
    { label: "Today's Check-ins", value: mockBookings.filter(b => b.status === "confirmed").length, icon: LogIn, color: "text-blue-500" },
    { label: "Today's Check-outs", value: mockBookings.filter(b => b.status === "checked_in").length, icon: LogOut, color: "text-amber-500" },
    { label: "Pending Conf.", value: mockBookings.filter(b => b.status === "pending").length, icon: Clock, color: "text-muted-foreground" },
  ]

  const statusConfig: Record<BookingStatus, { color: string, icon: any }> = {
    pending: { color: "bg-muted text-muted-foreground", icon: Clock },
    confirmed: { color: "bg-blue-500/10 text-blue-500", icon: CheckCircle2 },
    checked_in: { color: "bg-primary/10 text-primary", icon: LogIn },
    checked_out: { color: "bg-green-500/10 text-green-500", icon: LogOut },
    cancelled: { color: "bg-destructive/10 text-destructive", icon: XCircle },
    no_show: { color: "bg-destructive/10 text-destructive", icon: XCircle }
  }

  return (
    <DashboardLayout requiredRoles={["receptionist"]} title="Reservations Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 bg-muted rounded-full ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Reservations Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Reservations</CardTitle>
                <CardDescription>Monitor and manage guest bookings and stay status</CardDescription>
              </div>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Walk-in booking
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by guest, room, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Status" />
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
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    const status = statusConfig[booking.status]
                    const StatusIcon = status.icon
                    
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{booking.customerName}</p>
                            <p className="text-xs text-muted-foreground">{booking.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Room {booking.roomNumber}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <p>{format(new Date(booking.checkInDate), "MMM dd")} - {format(new Date(booking.checkOutDate), "MMM dd")}</p>
                            <p className="text-muted-foreground mt-0.5">{booking.numberOfNights} nights</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${status.color} border-transparent shadow-none capitalize flex w-fit items-center gap-1`}>
                            <StatusIcon className="h-3 w-3" />
                            {booking.status.replace('_', ' ')}
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
                              {booking.status === "confirmed" && (
                                <DropdownMenuItem className="text-primary">
                                  <LogIn className="mr-2 h-4 w-4" /> Check In
                                </DropdownMenuItem>
                              )}
                              {booking.status === "checked_in" && (
                                <DropdownMenuItem className="text-primary">
                                  <LogOut className="mr-2 h-4 w-4" /> Check Out
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="mr-2 h-4 w-4" /> Cancel Reservation
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
                <p className="text-muted-foreground">No reservations found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
