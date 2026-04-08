"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from "recharts"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Download,
  Filter,
  Calendar,
  Layers,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

const staffPerformanceData = [
  { name: 'Cleaning', completed: 45, averageTime: 25 },
  { name: 'Maintenance', completed: 12, averageTime: 45 },
  { name: 'Room Service', completed: 38, averageTime: 15 },
  { name: 'Front Desk', completed: 62, averageTime: 8 },
  { name: 'Concierge', completed: 24, averageTime: 12 },
]

const revenueByDepartment = [
  { name: 'Rooms', value: 125000 },
  { name: 'Dining', value: 45000 },
  { name: 'Spa', value: 18000 },
  { name: 'Transport', value: 8000 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function ManagerReportsPage() {
  const { toast } = useToast()
  const [reportType, setReportType] = useState("operational")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [dateRange, setDateRange] = useState("30days")

  const exportReport = () => {
    const headers = ["Department", "Tasks Completed", "Avg Time (min)", "Revenue (ETB)"]
    const rows = staffPerformanceData.map((dept, i) => [
      dept.name,
      dept.completed,
      dept.averageTime,
      revenueByDepartment[i]?.value || 0
    ])

    const csvContent = [
      `Report Type: ${reportType}`,
      `Date Range: ${dateRange}`,
      `Department Filter: ${departmentFilter}`,
      `Generated: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`,
      "",
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `report_${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Report Exported",
      description: "Report has been exported to CSV successfully.",
    })
  }

  return (
    <DashboardLayout requiredRoles={["manager"]} title="Operational Analytics">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Last 30 Days: March 1 - March 31, 2024</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Depts</SelectItem>
                <SelectItem value="housekeeping">Housekeeping</SelectItem>
                <SelectItem value="food">F&B</SelectItem>
                <SelectItem value="reception">Reception</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">Avg. Completion Time</p>
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">18.5 min</div>
              <p className="text-xs text-green-500 font-medium flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> -12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">Tasks per Staff</p>
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">14.2</div>
              <p className="text-xs text-green-500 font-medium flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +5% efficiency
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">Resource Utilization</p>
                <Layers className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">88.4%</div>
              <p className="text-xs text-muted-foreground mt-1">Optimal range: 85-90%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium">Customer Sat.</p>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">4.8/5.0</div>
              <p className="text-xs text-green-500 font-medium flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" /> +0.2 improvement
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Staff Performance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Staff Efficiency by Department</CardTitle>
              <CardDescription>Number of tasks completed vs average resolution time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="completed" name="Tasks Completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="averageTime" name="Avg Time (min)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Share</CardTitle>
              <CardDescription>Distribution by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByDepartment}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {revenueByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => `ETB ${value.toLocaleString()}`}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4 pt-4 border-t">
                {revenueByDepartment.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">ETB {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Report Table Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Operational Hours</CardTitle>
            <CardDescription>Visualizing activity intensity across the hotel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full bg-muted/30 rounded-lg flex items-center justify-center border-dashed border-2">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">Detailed hourly activity map coming in v2.0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
