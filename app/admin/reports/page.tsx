"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Bed, 
  Calendar,
  Download,
  Filter
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const revenueData = [
  { name: "Mon", revenue: 45000, bookings: 12 },
  { name: "Tue", revenue: 52000, bookings: 15 },
  { name: "Wed", revenue: 48000, bookings: 14 },
  { name: "Thu", revenue: 61000, bookings: 18 },
  { name: "Fri", revenue: 75000, bookings: 22 },
  { name: "Sat", revenue: 82000, bookings: 25 },
  { name: "Sun", revenue: 58000, bookings: 16 },
]

const roomTypeData = [
  { name: "Standard", value: 40 },
  { name: "Deluxe", value: 30 },
  { name: "Suite", value: 20 },
  { name: "Presidential", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState("week")

  return (
    <DashboardLayout requiredRoles={["admin"]} title="Reports & Analytics">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Analytics Overview</h2>
            <p className="text-muted-foreground">Monitor performance and revenue metrics.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Revenue", value: "ETB 421,000", change: "+12.5%", icon: TrendingUp, color: "text-accent" },
            { label: "Avg. Occupancy", value: "78%", change: "+5.2%", icon: Bed, color: "text-chart-1" },
            { label: "Guest Satisfaction", value: "4.8/5", change: "+0.3", icon: Users, color: "text-chart-2" },
            { label: "RevPAR", value: "ETB 5,200", change: "+8.1%", icon: BarChart3, color: "text-chart-3" },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium">{stat.label}</p>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-xs text-accent font-medium">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Revenue Chart */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Daily revenue performance for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                      labelStyle={{ fontWeight: "bold" }}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Occupancy Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Occupancy by Room Type</CardTitle>
              <CardDescription>Distribution of bookings across room categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roomTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roomTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {roomTypeData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
