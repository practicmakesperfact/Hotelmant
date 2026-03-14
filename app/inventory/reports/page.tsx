"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from "recharts"
import { 
  FileText, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Package,
  ArrowRight,
  Filter,
  Calendar
} from "lucide-react"
import { mockInventoryItems, mockPurchaseOrders } from "@/lib/mock-data"

export default function InventoryReportsPage() {
  // Process data for category breakdown chart
  const categoryCounts = mockInventoryItems.reduce((acc: any, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {})

  const pieData = Object.keys(categoryCounts).map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: categoryCounts[cat]
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658']

  // Process data for stock value chart (top 5 expensive items)
  const stockValueData = [...mockInventoryItems]
    .sort((a, b) => (b.currentStock * b.unitPrice) - (a.currentStock * a.unitPrice))
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      value: item.currentStock * item.unitPrice
    }))

  const stats = [
    { label: "Total Inventory Value", value: `ETB ${mockInventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0).toLocaleString()}`, icon: Package, trend: "up", percentage: "+5.2%" },
    { label: "Monthly Spend", value: `ETB ${mockPurchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString()}`, icon: FileText, trend: "down", percentage: "-2.4%" },
    { label: "Pending POs", value: mockPurchaseOrders.filter(po => po.status === 'ordered').length.toString(), icon: Calendar, trend: "neutral", percentage: "0.0%" },
  ]

  return (
    <DashboardLayout requiredRoles={["inventory_manager"]} title="Inventory Reports & Analytics">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant={stat.trend === "up" ? "secondary" : stat.trend === "down" ? "destructive" : "outline"} className="text-[10px]">
                      {stat.percentage}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Distribution of items by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

          {/* Top 5 Items by Total Value */}
          <Card>
            <CardHeader>
              <CardTitle>High Value Stock</CardTitle>
              <CardDescription>Top 5 items by total stock value (ETB)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockValueData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} className="text-[10px]" />
                    <Tooltip 
                      formatter={(v: number) => `ETB ${v.toLocaleString()}`}
                      contentStyle={{ 
                        backgroundColor: "var(--card)", 
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)"
                      }}
                    />
                    <Bar dataKey="value" fill="var(--chart-4)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity / Expense Log */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Expense History</CardTitle>
              <CardDescription>Last 5 purchase orders</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPurchaseOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-background border rounded-md">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.supplierName}</p>
                      <p className="text-xs text-muted-foreground">{order.orderNumber} • {order.items.length} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">ETB {order.totalAmount.toLocaleString()}</p>
                    <Badge variant="outline" className="text-[10px] capitalize mt-1">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs" asChild>
                <a href="/inventory/orders">
                  View All Orders <ArrowRight className="ml-2 h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
