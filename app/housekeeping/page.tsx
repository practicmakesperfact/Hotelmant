"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ClipboardList, 
  Bed,
  Clock,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Package,
  Timer,
  User
} from "lucide-react"
import { mockRooms, mockHousekeepingTasks } from "@/lib/mock-data"
import { format } from "date-fns"
import Link from "next/link"

export default function HousekeepingDashboard() {
  const [tasks, setTasks] = useState(mockHousekeepingTasks)

  const pendingTasks = tasks.filter(t => t.status === "pending")
  const inProgressTasks = tasks.filter(t => t.status === "in-progress")
  const completedTasks = tasks.filter(t => t.status === "completed")
  
  const roomsNeedingCleaning = mockRooms.filter(r => r.status === "cleaning")
  const urgentTasks = tasks.filter(t => t.priority === "urgent" && t.status !== "completed")

  const stats = [
    { label: "Pending Tasks", value: pendingTasks.length, icon: ClipboardList, color: "text-chart-4" },
    { label: "In Progress", value: inProgressTasks.length, icon: Timer, color: "text-primary" },
    { label: "Completed Today", value: completedTasks.length, icon: CheckCircle, color: "text-accent" },
    { label: "Rooms to Clean", value: roomsNeedingCleaning.length, icon: Bed, color: "text-chart-1" }
  ]

  const startTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: "in-progress" as const } : t
    ))
  }

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: "completed" as const, completedAt: new Date().toISOString() } : t
    ))
  }

  return (
    <DashboardLayout requiredRoles={["housekeeping"]} title="Housekeeping">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
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

        {/* Urgent Alerts */}
        {urgentTasks.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Urgent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urgentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-background">
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">Urgent</Badge>
                      <div>
                        <p className="font-medium">Room {task.roomNumber}</p>
                        <p className="text-sm text-muted-foreground">{task.type} - {task.description}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => startTask(task.id)}>
                      Start Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Lists */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-chart-4" />
                Pending Tasks
              </CardTitle>
              <CardDescription>{pendingTasks.length} tasks waiting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.slice(0, 6).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === "urgent" ? "bg-destructive" :
                        task.priority === "high" ? "bg-chart-4" : "bg-muted-foreground"
                      }`} />
                      <div>
                        <p className="font-medium">Room {task.roomNumber}</p>
                        <p className="text-sm text-muted-foreground capitalize">{task.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">{task.priority}</Badge>
                      <Button size="sm" variant="outline" onClick={() => startTask(task.id)}>
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No pending tasks</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* In Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                In Progress
              </CardTitle>
              <CardDescription>{inProgressTasks.length} tasks being worked on</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inProgressTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
                        {task.assignedTo?.split(" ").map(n => n[0]).join("") || "?"}
                      </div>
                      <div>
                        <p className="font-medium">Room {task.roomNumber}</p>
                        <p className="text-sm text-muted-foreground capitalize">{task.type}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => completeTask(task.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Complete
                    </Button>
                  </div>
                ))}
                {inProgressTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Timer className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No tasks in progress</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Room Cleaning Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rooms Requiring Attention</CardTitle>
              <CardDescription>Rooms marked for cleaning after checkout</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/housekeeping/rooms">View All Rooms</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roomsNeedingCleaning.map((room) => (
                <div key={room.id} className="p-4 rounded-lg border bg-chart-4/5 border-chart-4/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{room.roomNumber}</span>
                    <Badge className="bg-chart-4/10 text-chart-4">Cleaning</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {room.type} • Floor {room.floor}
                  </p>
                  <Button size="sm" className="w-full">
                    <Sparkles className="h-4 w-4 mr-1" /> Start Cleaning
                  </Button>
                </div>
              ))}
              {roomsNeedingCleaning.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  <Sparkles className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>All rooms are clean</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/housekeeping/tasks">
                  <ClipboardList className="h-6 w-6" />
                  <span>All Tasks</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/housekeeping/rooms">
                  <Bed className="h-6 w-6" />
                  <span>Room Status</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/housekeeping/supplies">
                  <Package className="h-6 w-6" />
                  <span>Request Supplies</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
                <Link href="/housekeeping/issues">
                  <AlertTriangle className="h-6 w-6" />
                  <span>Report Issue</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
