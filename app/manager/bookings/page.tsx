"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts"
import { 
  CalendarCheck, 
  TrendingUp, 
  Users, 
  Hotel,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download
} from "lucide-react"
import { mockBookings, mockRooms, getOccupancyStats } from "@/lib/mock-data"
import { format } from "date-fns"

export default function ManagerBookingsPage() {
  const occupancyData = getOccupancyStats()
  
  const totalRooms = mockRooms.length
  const occupiedRooms = mockRooms.filter(r => r.status === "occupied").length
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100)

  const stats = [
    { label: "Current Occupancy", value: `${occupancyRate}%`, trend: "up", percentage: "+12%", icon: Hotel },
    { label: "Avg. Daily Rate", value: "ETB 4,500", trend: "up", percentage: "+5%", icon: TrendingUp },
    { label: "Total Revenue (Mo)", value: `ETB ${(mockBookings.reduce((sum, b) => sum + b.totalAmount, 0) / 1000).toFixed(0)}K`, trend: "up", percentage: "+8%", icon: Users },
  ]

  return (
    <DashboardLayout requiredRoles={["manager"]} title="Bookings & Occupancy">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className={`flex items-center text-xs font-medium ${stat.trend === "up" ? "text-green-500" : "text-destructive"}`}>
                      {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {stat.percentage}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Occupancy Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Occupancy Trends</CardTitle>
              <CardDescription>Daily occupancy percentage for the current month</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyData}>
                  <defs>
                    <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="day" className="text-[10px]" axisLine={false} tickLine={false} />
                  <YAxis className="text-[10px]" axisLine={false} tickLine={false} unit="%" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--card)", 
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Area type="monotone" dataKey="occupancy" stroke="var(--primary)" fillOpacity={1} fill="url(#colorOcc)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Booking Activity</CardTitle>
                <CardDescription>Latest reservations and their revenue impact</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All Bookings</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Room Type</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.slice(0, 5).map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium text-sm">{booking.customerName}</TableCell>
                      <TableCell className="text-xs">
                        {format(new Date(booking.checkInDate), "MMM dd")} - {format(new Date(booking.checkOutDate), "MMM dd")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-[10px]">
                          {booking.roomType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-semibold">ETB {booking.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          booking.status === "confirmed" ? "default" :
                          booking.status === "checked_in" ? "secondary" : "outline"
                        } className="text-[10px] capitalize">
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
