"use client"

import {
  BarChart3,
  Calendar,
  CheckSquare,
  FileText,
  Home,
  Settings,
  Users,
  Wrench,
  Building2,
  UserCheck,
  ClipboardList,
  TrendingUp,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useProject, type UserRole } from "@/components/project-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const roleMenuItems = {
  sales: [
    { title: "Dashboard", icon: Home, id: "dashboard" },
    { title: "New Project", icon: FileText, id: "new-project" },
    { title: "My Submissions", icon: ClipboardList, id: "submissions" },
  ],
  admin: [
    { title: "Dashboard", icon: Home, id: "dashboard" },
    { title: "Project Registration", icon: FileText, id: "registration" },
    { title: "All Projects", icon: Building2, id: "all-projects" },
    { title: "System Settings", icon: Settings, id: "settings" },
  ],
  manager: [
    { title: "Dashboard", icon: Home, id: "dashboard" },
    { title: "Project Review", icon: CheckSquare, id: "review" },
    { title: "Reports", icon: BarChart3, id: "reports" },
    { title: "Team Overview", icon: Users, id: "team" },
  ],
  supervisor: [
    { title: "Dashboard", icon: Home, id: "dashboard" },
    { title: "Project Scheduling", icon: Calendar, id: "scheduling" },
    { title: "Technician Management", icon: Users, id: "technicians" },
    { title: "Progress Validation", icon: UserCheck, id: "validation" },
  ],
  technician: [
    { title: "Dashboard", icon: Home, id: "dashboard" },
    { title: "My Projects", icon: Wrench, id: "my-projects" },
    { title: "Attendance", icon: UserCheck, id: "attendance" },
    { title: "Progress Updates", icon: TrendingUp, id: "progress" },
  ],
}

const roleLabels = {
  sales: "Sales",
  admin: "Administrator",
  manager: "Manager Operasional",
  supervisor: "Supervisor",
  technician: "Teknisi",
}

export function AppSidebar() {
  const { currentRole, setCurrentRole, projects } = useProject()
  const menuItems = roleMenuItems[currentRole]

  const pendingCount = projects.filter((p) => {
    if (currentRole === "admin") return p.status === "draft"
    if (currentRole === "manager") return p.status === "registered"
    if (currentRole === "supervisor") return p.status === "approved" || p.status === "in-progress"
    return 0
  }).length

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <span className="font-semibold">ProjectFlow</span>
        </div>
        <div className="mt-4">
          <Select value={currentRole} onValueChange={(value: UserRole) => setCurrentRole(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleLabels).map(([role, label]) => (
                <SelectItem key={role} value={role}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.id === "dashboard" && pendingCount > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {pendingCount}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-sm text-muted-foreground">
          Logged in as: <span className="font-medium">{roleLabels[currentRole]}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
