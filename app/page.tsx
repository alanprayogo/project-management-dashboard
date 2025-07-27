"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardContent } from "@/components/dashboard-content";
import { ProjectProvider } from "@/components/project-context";

export default function Dashboard() {
  return (
    <ProjectProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <DashboardContent />
          </main>
        </div>
      </SidebarProvider>
    </ProjectProvider>
  );
}
