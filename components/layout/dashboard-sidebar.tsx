"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-context"
import { useLocale } from "@/lib/i18n/locale-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Hotel,
  CalendarCheck,
  Users,
  UserCog,
  Package,
  Sparkles,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Building2,
  Bell,
  CreditCard,
  FileText,
  Bed,
  Clock,
  ShoppingCart,
  AlertTriangle,
  UserCircle,
  Receipt
} from "lucide-react"
import { UserRole } from "@/lib/types"

interface DashboardSidebarProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
}

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
  badge?: number
}

const navItems: NavItem[] = [
  // Admin items
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["admin"] },
  { title: "Users", href: "/admin/users", icon: UserCog, roles: ["admin"] },
  { title: "Rooms", href: "/admin/rooms", icon: Hotel, roles: ["admin"] },
  { title: "Bookings", href: "/admin/bookings", icon: CalendarCheck, roles: ["admin"] },
  { title: "Staff", href: "/admin/staff", icon: Users, roles: ["admin"] },
  { title: "Reports", href: "/admin/reports", icon: BarChart3, roles: ["admin"] },
  { title: "Settings", href: "/admin/settings", icon: Settings, roles: ["admin"] },
  
  // Manager items
  { title: "Dashboard", href: "/manager", icon: LayoutDashboard, roles: ["manager"] },
  { title: "Bookings", href: "/manager/bookings", icon: CalendarCheck, roles: ["manager"] },
  { title: "Staff", href: "/manager/staff", icon: Users, roles: ["manager"] },
  { title: "Reports", href: "/manager/reports", icon: BarChart3, roles: ["manager"] },
  { title: "Services", href: "/manager/services", icon: Sparkles, roles: ["manager"] },
  
  // Receptionist items
  { title: "Dashboard", href: "/receptionist", icon: LayoutDashboard, roles: ["receptionist"] },
  { title: "Check-in/out", href: "/receptionist/checkin", icon: Clock, roles: ["receptionist"] },
  { title: "Reservations", href: "/receptionist/reservations", icon: CalendarCheck, roles: ["receptionist"] },
  { title: "Room Status", href: "/receptionist/rooms", icon: Bed, roles: ["receptionist"] },
  { title: "Guests", href: "/receptionist/guests", icon: Users, roles: ["receptionist"] },
  
  // Housekeeping items
  { title: "Dashboard", href: "/housekeeping", icon: LayoutDashboard, roles: ["housekeeping"] },
  { title: "Tasks", href: "/housekeeping/tasks", icon: ClipboardList, roles: ["housekeeping"], badge: 5 },
  { title: "Room Status", href: "/housekeeping/rooms", icon: Bed, roles: ["housekeeping"] },
  { title: "Supplies", href: "/housekeeping/supplies", icon: Package, roles: ["housekeeping"] },
  { title: "Issues", href: "/housekeeping/issues", icon: AlertTriangle, roles: ["housekeeping"] },
  
  // Inventory items
  { title: "Dashboard", href: "/inventory", icon: LayoutDashboard, roles: ["inventory_manager"] },
  { title: "Stock", href: "/inventory/stock", icon: Package, roles: ["inventory_manager"] },
  { title: "Orders", href: "/inventory/orders", icon: ShoppingCart, roles: ["inventory_manager"] },
  { title: "Suppliers", href: "/inventory/suppliers", icon: Building2, roles: ["inventory_manager"] },
  { title: "Reports", href: "/inventory/reports", icon: FileText, roles: ["inventory_manager"] },
  
  // Customer items
  { title: "My Bookings", href: "/customer", icon: CalendarCheck, roles: ["customer"] },
  { title: "Profile", href: "/customer/profile", icon: UserCircle, roles: ["customer"] },
  { title: "Invoices", href: "/customer/invoices", icon: Receipt, roles: ["customer"] },
  { title: "Services", href: "/customer/services", icon: Sparkles, roles: ["customer"] },
]

export function DashboardSidebar({ collapsed = false, onToggleCollapse }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { t } = useLocale()

  if (!user) return null

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role))

  const roleLabels: Record<UserRole, string> = {
    admin: "Administrator",
    manager: "Manager",
    receptionist: "Receptionist",
    housekeeping: "Housekeeping",
    inventory_manager: "Inventory Manager",
    customer: "Guest"
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sidebar-primary" />
            <span className="font-serif font-bold text-lg">Leul Mekonen</span>
          </Link>
        )}
        {collapsed && (
          <Building2 className="h-6 w-6 text-sidebar-primary mx-auto" />
        )}
        {onToggleCollapse && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleCollapse}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-serif font-bold">L</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-sidebar-foreground/60">{roleLabels[user.role]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        <Button 
          variant="ghost" 
          onClick={logout}
          className={cn(
            "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  )
}
