"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"
import { UserRole } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  title?: string
}

export function DashboardLayout({ children, requiredRoles, title }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  // Use ref so we don't trigger the effect when requiredRoles array ref changes
  const requiredRolesRef = useRef(requiredRoles)
  requiredRolesRef.current = requiredRoles

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.push("/login")
      return
    }
    const roles = requiredRolesRef.current
    if (roles && !roles.includes(user.role)) {
      const roleRoutes: Record<UserRole, string> = {
        admin: "/admin",
        manager: "/manager",
        receptionist: "/receptionist",
        housekeeping: "/housekeeping",
        inventory_manager: "/inventory",
        customer: "/customer"
      }
      router.push(roleRoutes[user.role])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <DashboardSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          title={title}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
