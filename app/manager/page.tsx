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
  Clock,
  Star,
  BarChart3,
  Target,
  AlertCircle
} from "lucide-react"
import { 
  AreaChart, Area, 
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { mockBookings, mockRooms, mockStaff, getOccupancyStats, getRevenueStats } from "@/lib/mock-data"
import Link from "next/link"
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns"

export default function ManagerDashboard() {
  const occupancyStats = getOccupancyStats()
  const revenueStats = getRevenueStats()

  // Calculate key metrics
  const totalRooms = mockRooms.length
  const occupiedRooms = mockRooms.filter(r => r.status === "occupied").length
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100)
  
  const weeklyRevenue = mockBookings
    .filter(b => {
      const bookingDate = b.createdAt
      const now = new Date()
      return isWithinInterval(bookingDate instanceof Date ? bookingDate : new Date(), {
        start: startOfWeek(now),
        end: endOfWeek(now)
      }) && (b.status === "confirmed" || b.status === "checked_in" || b.status === "checked_out")
    })
    .reduce((sum, b) => sum + b.totalAmount, 0)

  const activeStaff = mockStaff.filter(s => s.isActive).length
  const pendingBookings = mockBookings.filter(b => b.status === "pending").length

  const stats = [
    {
      title: "Occupancy Rate",
      value: `${occupancyRate}%`,
      change: "+3.2%",
      trend: "up",
      icon: Hotel,
      target: "85%"
    },
    {
      title: "Weekly Revenue",
      value: `ETB ${(weeklyRevenue / 1000).toFixed(0)}K`,
      change: "+8.5%",
      trend: "up",
      icon: DollarSign,
      target: "ETB 500K"
    },
    {
      title: "Staff On Duty",
      value: `${activeStaff}/${mockStaff.length}`,
      change: "Normal",
      trend: "neutral",
      icon: Users,
      target: "Full"
    },
    {
      title: "Pending Actions",
      value: pendingBookings.toString(),
      change: "-2 from yesterday",
      trend: "down",
      icon: Clock,
      target: "0"
    }
  ]

  // Guest satisfaction data
  const satisfactionData = [
    { aspect: "Cleanliness", score: 4.8 },
    { aspect: "Service", score: 4.6 },
    { aspect: "Amenities", score: 4.4 },
    { aspect: "Value", score: 4.3 },
    { aspect: "Location", score: 4.9 }
  ]

  // Department performance
  const departmentPerformance = [
    { name: "Front Desk", tasks: 45, completed: 42, efficiency: 93 },
    { name: "Housekeeping", tasks: 60, completed: 55, efficiency: 92 },
    { name: "Room Service", tasks: 30, completed: 28, efficiency: 93 },
    { name: "Maintenance", tasks: 15, completed: 12, efficiency: 80 }
  ]

  return (
    <DashboardLayout requiredRoles={["manager"]} title="Manager Dashboard">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Target className="h-3 w-3 mr-1" />
                      Target: {stat.target}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-accent" />}
                      {stat.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                      <span className={`text-sm ${
                        stat.trend === "up" ? "text-accent" : 
                        stat.trend === "down" ? "text-destructive" : 
                        "text-muted-foreground"
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Comparison</CardTitle>
              <CardDescription>This month vs last month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueStats}>
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
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="var(--chart-1)" 
                      strokeWidth={2}
                      dot={{ fill: "var(--chart-1)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Guest Satisfaction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Guest Satisfaction
              </CardTitle>
              <CardDescription>Average ratings by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={satisfactionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" domain={[0, 5]} className="text-xs" />
                    <YAxis dataKey="aspect" type="category" className="text-xs" width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "var(--card)", 
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)"
                      }}
                      formatter={(value: number) => [`${value}/5`, "Rating"]}
                    />
                    <Bar dataKey="score" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Task completion rates by department</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/manager/reports">
                <BarChart3 className="mr-2 h-4 w-4" /> Full Report
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {departmentPerformance.map((dept, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {dept.completed}/{dept.tasks} tasks completed
                      </p>
                    </div>
                    <Badge variant={dept.efficiency >= 90 ? "secondary" : "outline"}>
                      {dept.efficiency}% efficiency
                    </Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        dept.efficiency >= 90 ? "bg-accent" : 
                        dept.efficiency >= 80 ? "bg-chart-4" : "bg-destructive"
                      }`}
                      style={{ width: `${dept.efficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Staff and Alerts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Staff Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Staff Overview</CardTitle>
                <CardDescription>Current shift status</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/manager/staff">Manage Staff</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStaff.slice(0, 5).map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium">
                        {staff.firstName[0]}{staff.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium">{staff.firstName} {staff.lastName}</p>
                        <p className="text-sm text-muted-foreground">{staff.department}</p>
                      </div>
                    </div>
                    <Badge variant={
                      staff.isActive ? "secondary" : "outline"
                    }>
                      {staff.isActive ? "On Duty" : "Off Duty"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts and Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Attention Required
              </CardTitle>
              <CardDescription>Items that need your review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: "Booking", message: "VIP guest arriving tomorrow - Suite 501", priority: "high" },
                  { type: "Staff", message: "2 sick leave requests pending approval", priority: "medium" },
                  { type: "Inventory", message: "Minibar stock running low", priority: "low" },
                  { type: "Maintenance", message: "Room 305 AC repair overdue", priority: "high" },
                  { type: "Review", message: "New negative review needs response", priority: "medium" }
                ].map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        alert.priority === "high" ? "destructive" :
                        alert.priority === "medium" ? "secondary" : "outline"
                      }>
                        {alert.type}
                      </Badge>
                      <span className="text-sm">{alert.message}</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/manager/bookings">
                  <CalendarCheck className="h-6 w-6" />
                  <span>View Bookings</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/manager/staff">
                  <Users className="h-6 w-6" />
                  <span>Staff Schedule</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/manager/reports">
                  <BarChart3 className="h-6 w-6" />
                  <span>Generate Report</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/manager/services">
                  <DollarSign className="h-6 w-6" />
                  <span>Service Pricing</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
