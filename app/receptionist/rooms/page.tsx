"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Hotel,
  CheckCircle,
  Users,
  Paintbrush,
  Wrench,
  Calendar,
  Bed,
  DollarSign,
  Phone
} from "lucide-react"
import { mockRooms, mockBookings } from "@/lib/mock-data"
import { RoomStatus } from "@/lib/types"

export default function ReceptionistRoomsPage() {
  const [floorFilter, setFloorFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const floors = [...new Set(mockRooms.map(r => r.floor))].sort((a, b) => a - b)

  const filteredRooms = mockRooms.filter(room => {
    const matchesFloor = floorFilter === "all" || room.floor.toString() === floorFilter
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    return matchesFloor && matchesStatus
  })

  const statusConfig: Record<RoomStatus, { color: string, bgColor: string, icon: React.ElementType, label: string }> = {
    available: { color: "text-accent", bgColor: "bg-accent/20 border-accent", icon: CheckCircle, label: "Available" },
    occupied: { color: "text-chart-1", bgColor: "bg-chart-1/20 border-chart-1", icon: Users, label: "Occupied" },
    cleaning: { color: "text-chart-4", bgColor: "bg-chart-4/20 border-chart-4", icon: Paintbrush, label: "Cleaning" },
    maintenance: { color: "text-destructive", bgColor: "bg-destructive/20 border-destructive", icon: Wrench, label: "Maintenance" },
    reserved: { color: "text-primary", bgColor: "bg-primary/20 border-primary", icon: Calendar, label: "Reserved" }
  }

  const stats = [
    { label: "Available", value: mockRooms.filter(r => r.status === "available").length, color: "text-accent" },
    { label: "Occupied", value: mockRooms.filter(r => r.status === "occupied").length, color: "text-chart-1" },
    { label: "Cleaning", value: mockRooms.filter(r => r.status === "cleaning").length, color: "text-chart-4" },
    { label: "Maintenance", value: mockRooms.filter(r => r.status === "maintenance").length, color: "text-destructive" }
  ]

  const getGuestForRoom = (roomNumber: string) => {
    return mockBookings.find(b => 
      b.roomNumber === roomNumber && b.status === "checked-in"
    )
  }

  return (
    <DashboardLayout requiredRoles={["receptionist"]} title="Room Status">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  {floors.map(floor => (
                    <SelectItem key={floor} value={floor.toString()}>Floor {floor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1" />
              <div className="flex gap-2 flex-wrap">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const Icon = config.icon
                  return (
                    <div key={status} className="flex items-center gap-1.5 text-sm">
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      <span className="text-muted-foreground">{config.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Grid by Floor */}
        {floors.filter(f => floorFilter === "all" || f.toString() === floorFilter).map(floor => {
          const floorRooms = filteredRooms.filter(r => r.floor === floor)
          if (floorRooms.length === 0) return null
          
          return (
            <Card key={floor}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5" />
                  Floor {floor}
                </CardTitle>
                <CardDescription>
                  {floorRooms.filter(r => r.status === "available").length} available,{" "}
                  {floorRooms.filter(r => r.status === "occupied").length} occupied
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {floorRooms.map((room) => {
                    const StatusIcon = statusConfig[room.status].icon
                    const guest = getGuestForRoom(room.roomNumber)
                    
                    return (
                      <div 
                        key={room.id}
                        className={`p-4 rounded-lg border-2 ${statusConfig[room.status].bgColor}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold">{room.roomNumber}</h3>
                            <p className="text-sm text-muted-foreground">{room.type}</p>
                          </div>
                          <StatusIcon className={`h-5 w-5 ${statusConfig[room.status].color}`} />
                        </div>
                        
                        <div className="space-y-2 text-sm mb-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Bed className="h-4 w-4" />
                            <span>{room.bedType}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Max {room.capacity} guests</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>ETB {room.pricePerNight.toLocaleString()}/night</span>
                          </div>
                        </div>

                        {guest && room.status === "occupied" && (
                          <div className="p-2 rounded bg-background/50 mb-3">
                            <p className="font-medium text-sm">{guest.guestName}</p>
                            <p className="text-xs text-muted-foreground">{guest.guestPhone}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {room.status === "available" && (
                            <Button size="sm" className="flex-1">Book Now</Button>
                          )}
                          {room.status === "occupied" && (
                            <Button size="sm" variant="outline" className="flex-1">
                              <Phone className="h-4 w-4 mr-1" /> Contact
                            </Button>
                          )}
                          {room.status === "cleaning" && (
                            <Button size="sm" variant="outline" className="flex-1">Mark Ready</Button>
                          )}
                          {room.status === "maintenance" && (
                            <Button size="sm" variant="outline" className="flex-1">View Issue</Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredRooms.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Hotel className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No rooms match your filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
