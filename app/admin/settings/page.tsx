"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Settings,
  Hotel,
  Bell,
  CreditCard,
  Lock,
  Globe,
  Save,
  Check
} from "lucide-react"
import {
  Switch
} from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Settings saved successfully")
    }, 1000)
  }

  return (
    <DashboardLayout requiredRoles={["admin"]} title="System Settings">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">System Configuration</h2>
            <p className="text-muted-foreground">Global preferences and hotel-wide settings.</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-fit">
            <TabsTrigger value="general" className="gap-2">
              <Hotel className="h-4 w-4" /> General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" /> Alerts
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="h-4 w-4" /> Billing
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" /> Security
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-6">
            <TabsContent value="general">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hotel Information</CardTitle>
                    <CardDescription>Primary details displayed on your booking site and invoices.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hotelName">Hotel Name</Label>
                        <Input id="hotelName" defaultValue="Leul Mekonen Hotel" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxId">TAX / VAT ID</Label>
                        <Input id="taxId" defaultValue="ET-123456789" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue="Combolcha, Ethiopia" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Public Email</Label>
                        <Input id="email" defaultValue="info@leulmekonenhotel.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Public Phone</Label>
                        <Input id="phone" defaultValue="+251 11 234 5678" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Regional & Localization</CardTitle>
                    <CardDescription>Set your local time, currency and units.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Input defaultValue="ETB (Ethiopian Birr)" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Input defaultValue="(GMT+03:00) Addis Ababa" disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control how you and your staff receive system alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">New Booking Alerts</p>
                      <p className="text-sm text-muted-foreground">Notify front desk when a new reservation is made online.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Inventory Alerts</p>
                      <p className="text-sm text-muted-foreground">Alert managers when stock levels are below threshold.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Maintenance Updates</p>
                      <p className="text-sm text-muted-foreground">Notify housekeeping when a room is marked as fixed.</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Enable or disable payment gateways for your customers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/20 rounded-md flex items-center justify-center font-bold text-accent">C</div>
                      <div>
                        <p className="font-medium">Chapa</p>
                        <p className="text-sm text-muted-foreground">Local bank transfers & mobile money (Telebirr, CBE Birr).</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-10 h-10 text-primary p-2" />
                      <div>
                        <p className="font-medium">International Cards</p>
                        <p className="text-sm text-muted-foreground">Accept Visa, Mastercard and AMEX via global gateways.</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage password policies and session behavior.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground mb-4">Require 2FA for all administrator accounts.</p>
                    <Button variant="outline">Setup 2FA</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto Logout</p>
                      <p className="text-sm text-muted-foreground">Automatically log out inactive sessions after 30 minutes.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
