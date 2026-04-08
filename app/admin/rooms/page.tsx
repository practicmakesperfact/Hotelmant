"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, 
  Plus, 
  Hotel,
  Bed,
  Users,
  DollarSign,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Paintbrush,
  Wrench
} from "lucide-react"
import { mockRooms } from "@/lib/mock-data"
import { RoomStatus, RoomType } from "@/lib/types"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AdminRoomsPage() {
  const { toast } = useToast()
  const [rooms, setRooms] = useState(mockRooms)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [floorFilter, setFloorFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    roomNumber: "",
    floor: "",
    type: "standard" as RoomType,
    bedType: "double",
    capacity: "2",
    pricePerNight: "",
    size: "",
    description: "",
    status: "available" as RoomStatus,
  })

  const filteredRooms = rooms.filter(room => {
    const roomName = room.type || ""
    const matchesSearch = 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roomName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || room.status === statusFilter
    const matchesType = typeFilter === "all" || room.type === typeFilter
    const matchesFloor = floorFilter === "all" || room.floor.toString() === floorFilter
    return matchesSearch && matchesStatus && matchesType && matchesFloor
  })

  const statusConfig: Record<RoomStatus, { color: string, icon: React.ElementType }> = {
    available: { color: "bg-accent/10 text-accent", icon: CheckCircle },
    occupied: { color: "bg-chart-1/10 text-chart-1", icon: Users },
    cleaning: { color: "bg-chart-4/10 text-chart-4", icon: Paintbrush },
    maintenance: { color: "bg-destructive/10 text-destructive", icon: Wrench },
    reserved: { color: "bg-primary/10 text-primary", icon: Hotel }
  }

  const stats = [
    { label: "Total Rooms", value: rooms.length, icon: Hotel, color: "text-primary" },
    { label: "Available", value: rooms.filter(r => r.status === "available").length, icon: CheckCircle, color: "text-accent" },
    { label: "Occupied", value: rooms.filter(r => r.status === "occupied").length, icon: Users, color: "text-chart-1" },
    { label: "Maintenance", value: rooms.filter(r => r.status === "maintenance").length, icon: Wrench, color: "text-destructive" }
  ]

  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort((a, b) => a - b)

  const resetForm = () => {
    setFormData({
      roomNumber: "",
      floor: "",
      type: "standard",
      bedType: "double",
      capacity: "2",
      pricePerNight: "",
      size: "",
      description: "",
      status: "available",
    })
  }

  const handleAddRoom = () => {
    const newRoom = {
      id: `room-${Date.now()}`,
      roomNumber: formData.roomNumber,
      type: formData.type,
      floor: parseInt(formData.floor),
      bedType: formData.bedType as any,
      maxOccupancy: parseInt(formData.capacity),
      pricePerNight: parseFloat(formData.pricePerNight),
      status: formData.status,
      amenities: ['WiFi', 'TV', 'Air Conditioning'],
      description: formData.description || `${formData.type} room with modern amenities`,
      descriptionAm: formData.description || `${formData.type} room with modern amenities`,
      descriptionOm: formData.description || `${formData.type} room with modern amenities`,
      images: [],
      size: parseInt(formData.size),
      view: 'city' as any,
      isSmokingAllowed: false,
      hasBalcony: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setRooms([...rooms, newRoom])
    setIsAddDialogOpen(false)
    resetForm()
    toast({
      title: "Room Added",
      description: `Room ${formData.roomNumber} has been added successfully.`,
    })
  }

  const handleEditRoom = () => {
    if (!selectedRoom) return

    const updatedRooms = rooms.map(room => 
      room.id === selectedRoom.id 
        ? {
            ...room,
            roomNumber: formData.roomNumber,
            type: formData.type,
            floor: parseInt(formData.floor),
            bedType: formData.bedType as any,
            maxOccupancy: parseInt(formData.capacity),
            pricePerNight: parseFloat(formData.pricePerNight),
            status: formData.status,
            size: parseInt(formData.size),
            description: formData.description,
            updatedAt: new Date(),
          }
        : room
    )

    setRooms(updatedRooms)
    setIsEditDialogOpen(false)
    setSelectedRoom(null)
    resetForm()
    toast({
      title: "Room Updated",
      description: `Room ${formData.roomNumber} has been updated successfully.`,
    })
  }

  const handleDeleteRoom = () => {
    if (!selectedRoom) return

    setRooms(rooms.filter(room => room.id !== selectedRoom.id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "Room Deleted",
      description: `Room ${selectedRoom.roomNumber} has been deleted.`,
      variant: "destructive",
    })
    setSelectedRoom(null)
  }

  const openEditDialog = (room: any) => {
    setSelectedRoom(room)
    setFormData({
      roomNumber: room.roomNumber,
      floor: room.floor.toString(),
      type: room.type,
      bedType: room.bedType,
      capacity: room.maxOccupancy.toString(),
      pricePerNight: room.pricePerNight.toString(),
      size: room.size.toString(),
      description: room.description,
      status: room.status,
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (room: any) => {
    setSelectedRoom(room)
    setIsDeleteDialogOpen(true)
  }

  return (
    <DashboardLayout requiredRoles={["admin"]} title="Room Management">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Rooms Grid */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Rooms</CardTitle>
                <CardDescription>Manage hotel rooms and their status</CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" /> Add Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>Create a new room in the system</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="roomNumber">Room Number *</Label>
                        <Input 
                          id="roomNumber" 
                          placeholder="101" 
                          value={formData.roomNumber}
                          onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="floor">Floor *</Label>
                        <Input 
                          id="floor" 
                          type="number" 
                          placeholder="1" 
                          value={formData.floor}
                          onChange={(e) => setFormData({...formData, floor: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Room Type *</Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as RoomType})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="deluxe">Deluxe</SelectItem>
                            <SelectItem value="suite">Suite</SelectItem>
                            <SelectItem value="presidential">Presidential</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bedType">Bed Type *</Label>
                        <Select value={formData.bedType} onValueChange={(value) => setFormData({...formData, bedType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bed" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="double">Double</SelectItem>
                            <SelectItem value="twin">Twin</SelectItem>
                            <SelectItem value="queen">Queen</SelectItem>
                            <SelectItem value="king">King</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity *</Label>
                        <Input 
                          id="capacity" 
                          type="number" 
                          placeholder="2" 
                          value={formData.capacity}
                          onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size">Size (sqm) *</Label>
                        <Input 
                          id="size" 
                          type="number" 
                          placeholder="35" 
                          value={formData.size}
                          onChange={(e) => setFormData({...formData, size: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price per Night (ETB) *</Label>
                        <Input 
                          id="price" 
                          type="number" 
                          placeholder="5000" 
                          value={formData.pricePerNight}
                          onChange={(e) => setFormData({...formData, pricePerNight: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as RoomStatus})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="cleaning">Cleaning</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="reserved">Reserved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Room description..." 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddRoom}>Create Room</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-full sm:w-[130px]">
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="presidential">Presidential</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Room Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map((room) => {
                const StatusIcon = statusConfig[room.status].icon
                return (
                  <Card key={room.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      <img 
                        src={room.images[0] || `https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=500&auto=format&fit=crop`} 
                        alt={room.type}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=500&auto=format&fit=crop";
                        }}
                      />
                      <Badge className={`absolute top-2 right-2 ${statusConfig[room.status].color} border-none`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        <span className="capitalize">{room.status}</span>
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold capitalize">{room.type} Room</h3>
                          <p className="text-sm text-muted-foreground">Room {room.roomNumber} • Floor {room.floor}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">{room.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{room.maxOccupancy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span className="capitalize">{room.bedType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>ETB {room.pricePerNight.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/rooms/${room.id}`}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(room)}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="icon" className="shrink-0" onClick={() => openDeleteDialog(room)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <Hotel className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No rooms found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update room information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-roomNumber">Room Number *</Label>
                <Input 
                  id="edit-roomNumber" 
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-floor">Floor *</Label>
                <Input 
                  id="edit-floor" 
                  type="number" 
                  value={formData.floor}
                  onChange={(e) => setFormData({...formData, floor: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Room Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as RoomType})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="presidential">Presidential</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bedType">Bed Type *</Label>
                <Select value={formData.bedType} onValueChange={(value) => setFormData({...formData, bedType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="twin">Twin</SelectItem>
                    <SelectItem value="queen">Queen</SelectItem>
                    <SelectItem value="king">King</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacity *</Label>
                <Input 
                  id="edit-capacity" 
                  type="number" 
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-size">Size (sqm) *</Label>
                <Input 
                  id="edit-size" 
                  type="number" 
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price per Night (ETB) *</Label>
                <Input 
                  id="edit-price" 
                  type="number" 
                  value={formData.pricePerNight}
                  onChange={(e) => setFormData({...formData, pricePerNight: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as RoomStatus})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditRoom}>Update Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete room {selectedRoom?.roomNumber}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoom} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
