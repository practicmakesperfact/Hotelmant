"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Play,
  CheckCircle,
  MoreHorizontal,
  Plus,
  ArrowRight,
  Filter,
  Check
} from "lucide-react"
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
import { mockHousekeepingTasks } from "@/lib/mock-data"
import { format } from "date-fns"

export default function HousekeepingTasksPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [tasks, setTasks] = useState(mockHousekeepingTasks)

  const filteredTasks = tasks.filter(task => 
    statusFilter === "all" || task.status === statusFilter
  )

  const priorityConfig = {
    urgent: "bg-destructive/10 text-destructive border-destructive/20",
    high: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    low: "bg-muted text-muted-foreground border-transparent"
  }

  const markInProgress = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'in_progress' } : t))
  }

  const markCompleted = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed', completedAt: new Date() } : t))
  }

  return (
    <DashboardLayout requiredRoles={["housekeeping"]} title="Assigned Tasks">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Daily Schedule</h2>
            <p className="text-muted-foreground">Manage and track your assigned housekeeping duties</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> New Task
            </Button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className={task.priority === 'urgent' ? 'border-destructive/30 bg-destructive/5' : ''}>
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center p-6 gap-6">
                  {/* Status Icon */}
                  <div className={`p-4 rounded-full w-fit ${
                    task.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                    task.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                  }`}>
                    {task.status === 'completed' ? <CheckCircle className="h-6 w-6" /> : 
                     task.status === 'in_progress' ? <Clock className="h-6 w-6" /> : <ClipboardList className="h-6 w-6" />}
                  </div>

                  {/* Task Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">Room {task.roomNumber}</h3>
                      <Badge variant="outline" className={`capitalize text-[10px] ${priorityConfig[task.priority]}`}>
                        {task.priority === 'urgent' && <AlertTriangle className="mr-1 h-3 w-3" />}
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium capitalize text-muted-foreground">
                      {task.type.replace('_', ' ')} • Scheduled for {format(new Date(task.scheduledFor), "hh:mm a")}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Check className="h-3 w-3" />
                        {task.checklistItems?.filter(i => i.isCompleted).length || 0}/{task.checklistItems?.length || 0} Items
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {task.status === 'pending' && (
                      <Button onClick={() => markInProgress(task.id)} className="w-full sm:w-auto">
                        <Play className="mr-2 h-4 w-4" /> Start Task
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button onClick={() => markCompleted(task.id)} variant="secondary" className="w-full sm:w-auto">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Finish
                      </Button>
                    )}
                    {task.status === 'completed' && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-transparent h-9 px-4">
                        Completed at {format(new Date(task.completedAt || new Date()), "hh:mm a")}
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-20 border rounded-lg bg-muted/20">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground font-medium">All tasks completed!</p>
              <p className="text-sm text-muted-foreground">No pending or active tasks found for the current filter.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
