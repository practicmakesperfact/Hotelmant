"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Bed, 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  CheckCircle2,
  AlertTriangle,
  User,
  RefreshCw
} from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { mockRooms } from "@/lib/mock-data"
import { RoomStatus } from "@/lib/types"

export default function HousekeepingRoomsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [floorFilter, setFloorFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRooms = mockRooms.filter(room => {
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    const matchesFloor = floorFilter === "all" || room.floor.toString() === floorFilter
    const matchesSearch = room.roomNumber.includes(searchTerm)
    return matchesStatus && matchesFloor && matchesSearch
  })

  const floors = Array.from(new Set(mockRooms.map(r => r.floor))).sort((a, b) => a - b)

  const statusConfig: Record<RoomStatus, { color: string, icon: any }> = {
    available: { color: "bg-green-500/10 text-green-500", icon: CheckCircle2 },
    occupied: { color: "bg-blue-500/10 text-blue-500", icon: User },
    cleaning: { color: "bg-amber-500/10 text-amber-500", icon: RefreshCw },
    maintenance: { color: "bg-destructive/10 text-destructive", icon: AlertTriangle },
    dirty: { color: "bg-destructive/10 text-destructive", icon: Sparkles },
    reserved: { color: "bg-muted text-muted-foreground", icon: Clock }
  }

  return (
    <DashboardLayout requiredRoles={["housekeeping"]} title="Room Status Overivew">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search room number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="dirty">Dirty</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={floorFilter} onValueChange={setFloorFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Floors</SelectItem>
                    {floors.map(floor => (
                      <SelectItem key={floor} value={floor.toString()}>Floor {floor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredRooms.map((room) => {
            const config = statusConfig[room.status]
            const StatusIcon = config.icon

            return (
              <Card key={room.id} className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
                <CardContent className="p-0">
                  <div className={`p-4 border-b ${config.color} flex items-center justify-between`}>
                    <span className="text-xl font-bold">{room.roomNumber}</span>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{room.type.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">Floor {room.floor}</p>
                    </div>
                    
                    {room.status === 'dirty' ? (
                      <Button size="sm" className="w-full text-[10px] h-8 bg-amber-500 hover:bg-amber-600 border-none">
                        START CLEANING
                      </Button>
                    ) : room.status === 'cleaning' ? (
                      <Button size="sm" className="w-full text-[10px] h-8 bg-green-500 hover:bg-green-600 border-none">
                        MARK AS CLEAN
                      </Button>
                    ) : (
                      <div className="text-[10px] py-1.5 px-2 bg-muted rounded font-medium text-center uppercase">
                        {room.status.replace('_', ' ')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-20 border rounded-lg bg-muted/20">
            <Bed className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground font-medium">No rooms match your filters</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
