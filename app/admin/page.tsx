"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Hotel, 
  Users, 
  CalendarCheck, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Bed,
  Clock,
  AlertCircle
} from "lucide-react"
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { mockBookings, mockRooms, getOccupancyStats, getRevenueStats } from "@/lib/mock-data"
import Link from "next/link"
import { format } from "date-fns"

export default function AdminDashboard() {
  const occupancyStats = getOccupancyStats()
  const revenueStats = getRevenueStats()

  // Calculate stats
  const totalRooms = mockRooms.length
  const occupiedRooms = mockRooms.filter(r => r.status === "occupied").length
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100)
  
  const todayBookings = mockBookings.filter(b => {
    const checkIn = new Date(b.checkInDate)
    const today = new Date()
    return checkIn.toDateString() === today.toDateString()
  }).length

  const totalRevenue = mockBookings
    .filter(b => b.status === "confirmed" || b.status === "checked_in" || b.status === "checked_out")
    .reduce((sum, b) => sum + b.totalAmount, 0)

  const pendingBookings = mockBookings.filter(b => b.status === "pending").length

  const stats = [
    {
      title: "Occupancy Rate",
      value: `${occupancyRate}%`,
      change: "+5.2%",
      trend: "up",
      icon: Hotel,
      color: "text-chart-1"
    },
    {
      title: "Total Revenue",
      value: `ETB ${(totalRevenue / 1000).toFixed(0)}K`,
      change: "+12.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-chart-2"
    },
    {
      title: "Today's Check-ins",
      value: todayBookings.toString(),
      change: "+2",
      trend: "up",
      icon: CalendarCheck,
      color: "text-chart-3"
    },
    {
      title: "Pending Bookings",
      value: pendingBookings.toString(),
      change: "-3",
      trend: "down",
      icon: Clock,
      color: "text-chart-4"
    }
  ]

  // Room status data for pie chart
  const roomStatusData = [
    { name: "Occupied", value: mockRooms.filter(r => r.status === "occupied").length, color: "var(--chart-1)" },
    { name: "Available", value: mockRooms.filter(r => r.status === "available").length, color: "var(--chart-2)" },
    { name: "Cleaning", value: mockRooms.filter(r => r.status === "cleaning").length, color: "var(--chart-3)" },
    { name: "Maintenance", value: mockRooms.filter(r => r.status === "maintenance").length, color: "var(--chart-4)" }
  ]

  // Recent bookings
  const recentBookings = mockBookings.slice(0, 5)

  // Upcoming check-ins
  const upcomingCheckins = mockBookings
    .filter(b => b.status === "confirmed" && new Date(b.checkInDate) >= new Date())
    .slice(0, 5)

  return (
    <DashboardLayout requiredRoles={["admin"]} title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-accent" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={`text-sm ${stat.trend === "up" ? "text-accent" : "text-destructive"}`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-muted-foreground">vs last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueStats}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `${v/1000}K`} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--card)", 
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)"
                      }}
                      formatter={(value: number) => [`ETB ${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--chart-1)" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Room Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Room Status</CardTitle>
              <CardDescription>Current room availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roomStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {roomStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--card)", 
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)"
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Occupancy Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Trends</CardTitle>
            <CardDescription>Daily occupancy rate for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--card)", 
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)"
                    }}
                    formatter={(value: number) => [`${value}%`, "Occupancy"]}
                  />
                  <Bar dataKey="occupancy" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tables Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Bookings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest reservation activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/bookings">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          Room {booking.roomNumber} • {booking.checkInDate instanceof Date ? format(booking.checkInDate, "MMM dd") : "Recent"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={
                      booking.status === "confirmed" ? "default" :
                      booking.status === "checked_in" ? "secondary" :
                      booking.status === "pending" ? "outline" : "destructive"
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Check-ins */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Check-ins</CardTitle>
                <CardDescription>Arrivals scheduled for today and tomorrow</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/receptionist/checkin">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingCheckins.length > 0 ? (
                  upcomingCheckins.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bed className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            Room {booking.roomNumber} • {booking.numberOfGuests} guests
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{booking.checkInDate instanceof Date ? format(booking.checkInDate, "h:mm a") : "N/A"}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.checkInDate instanceof Date ? format(booking.checkInDate, "MMM dd") : "Today"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarCheck className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No upcoming check-ins</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                <div className="flex items-center gap-3">
                  <Badge variant="destructive">Urgent</Badge>
                  <span>Room 305 maintenance overdue - 3 days</span>
                </div>
                <Button variant="outline" size="sm">Review</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Info</Badge>
                  <span>Low inventory: Toiletries need restocking</span>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Reminder</Badge>
                  <span>Staff meeting scheduled for tomorrow 10 AM</span>
                </div>
                <Button variant="outline" size="sm">Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
