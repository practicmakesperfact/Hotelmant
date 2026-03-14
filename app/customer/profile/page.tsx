"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Bell,
  Star,
  Trophy,
  History,
  CreditCard,
  Save
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CustomerProfilePage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <DashboardLayout requiredRoles={["customer"]} title="My Account">
      <div className="space-y-6">
        {/* Profile Overview */}
        <div className="flex flex-col md:flex-row gap-6">
          <Card className="md:w-1/3">
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                <UserCircle className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Abebe Kebede</h3>
              <p className="text-sm text-muted-foreground mb-4">Member since January 2024</p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  <Star className="h-3 w-3 mr-1 fill-amber-500" /> Gold Member
                </Badge>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 border-t pt-6">
                <div>
                  <p className="text-2xl font-bold text-primary">1,250</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Points</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Stays</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader className="pb-0">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 gap-6">
                  <TabsTrigger value="personal" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-3 text-sm font-medium">
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-3 text-sm font-medium">
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-3 text-sm font-medium">
                    Preferences
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="pt-6 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Abebe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Kebede" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" className="pl-9" defaultValue="abebe.kebede@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" className="pl-9" defaultValue="+251 911 234 567" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="address" className="pl-9" defaultValue="Bole, Addis Ababa, Ethiopia" />
                    </div>
                  </div>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                  </Button>
                </TabsContent>

                <TabsContent value="security" className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Two-Factor Authentication</p>
                          <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-sm font-bold">Change Password</h4>
                      <div className="grid gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="currentPass">Current Password</Label>
                          <Input id="currentPass" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPass">New Password</Label>
                          <Input id="newPass" type="password" />
                        </div>
                        <Button variant="secondary" size="sm" className="w-fit">Update Password</Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Push Notifications</p>
                          <p className="text-xs text-muted-foreground">Get instant alerts about your bookings</p>
                        </div>
                      </div>
                      <Badge>Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Marketing Emails</p>
                          <p className="text-xs text-muted-foreground">Receive special offers and hotel news</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Modify</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Loyalty Program Perks */}
        <Card className="bg-gradient-to-br from-primary/5 via-transparent to-primary/10 border-none">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="h-6 w-6 text-primary" />
              <h4 className="text-xl font-bold">Gold Tier Benefits</h4>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { title: "Complimentary Breakfast", desc: "Enjoy full buffet every morning" },
                { title: "Early Check-in", desc: "Subject to availability from 10:00 AM" },
                { title: "Late Check-out", desc: "Keep your room until 4:00 PM" },
                { title: "Welcome Amenity", desc: "Local fruits and drinks on arrival" },
                { title: "Room Upgrade", desc: "Complimentary upgrade to next category" },
                { title: "Exclusive Lounge", desc: "Access to private business lounge" },
              ].map((perk, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <p className="text-sm font-bold">{perk.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground pl-3.5">{perk.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
