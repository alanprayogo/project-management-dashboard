"use client"

import { useProject } from "@/components/project-context"
import { SalesDashboard } from "@/components/dashboards/sales-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { ManagerDashboard } from "@/components/dashboards/manager-dashboard"
import { SupervisorDashboard } from "@/components/dashboards/supervisor-dashboard"
import { TechnicianDashboard } from "@/components/dashboards/technician-dashboard"

export function DashboardContent() {
  const { currentRole } = useProject()

  const renderDashboard = () => {
    switch (currentRole) {
      case "sales":
        return <SalesDashboard />
      case "admin":
        return <AdminDashboard />
      case "manager":
        return <ManagerDashboard />
      case "supervisor":
        return <SupervisorDashboard />
      case "technician":
        return <TechnicianDashboard />
      default:
        return <SalesDashboard />
    }
  }

  return <div className="flex-1 overflow-auto">{renderDashboard()}</div>
}
