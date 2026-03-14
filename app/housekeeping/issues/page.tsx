"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  AlertTriangle, 
  Search, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle2, 
  MoreVertical,
  Plus,
  Filter,
  Wrench,
  AlertCircle
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { mockMaintenanceRequests } from "@/lib/mock-data"
import { format } from "date-fns"

export default function HousekeepingIssuesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredIssues = mockMaintenanceRequests.filter(issue => {
    const matchesSearch = 
      issue.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.issue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>
      case 'in_progress': return <Badge variant="secondary" className="flex items-center gap-1 bg-blue-500/10 text-blue-500 border-blue-500/20"><Wrench className="h-3 w-3" /> In Progress</Badge>
      case 'completed': return <Badge variant="secondary" className="flex items-center gap-1 bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle2 className="h-3 w-3" /> Fixed</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <DashboardLayout requiredRoles={["housekeeping"]} title="Maintenance Issues">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-destructive/10 rounded-full">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Issues</p>
                <p className="text-xl font-bold">{mockMaintenanceRequests.filter(i => i.status !== 'completed').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-amber-500/10 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-xl font-bold">{mockMaintenanceRequests.filter(i => i.priority === 'high').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved Today</p>
                <p className="text-xl font-bold">5</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by room or issue..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Report New Issue
            </Button>
          </div>
        </div>

        {/* Issues List */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle>Active Maintenance Requests</CardTitle>
            <CardDescription>Items reported by housekeeping staff needing technical attention.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue / Room</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Date Reported</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No issues found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold flex items-center gap-2">
                             {issue.issue}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Room {issue.roomNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" /> {issue.reportedByName}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(issue.createdAt), "MMM dd, p")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" /> Mark Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Wrench className="h-4 w-4" /> Assign Tech
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                              <AlertTriangle className="h-4 w-4" /> Escalate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
