"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

export type UserRole =
  | "sales"
  | "admin"
  | "manager"
  | "supervisor"
  | "technician";

export type ProjectStatus =
  | "draft"
  | "registered"
  | "approved"
  | "rejected"
  | "scheduled"
  | "in-progress"
  | "completed"
  | "done"
  | "cancelled"
  | "pending";

export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  status: ProjectStatus;
  createdBy: string;
  assignedTechnicians?: string[];
  scheduledDate?: string;
  progress?: number;
  report?: string;
  progressNotes?: string; // Add this line
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  projects: Project[];
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("sales");
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Website Redesign",
      client: "Acme Corp",
      description: "Complete website redesign with modern UI/UX",
      status: "scheduled",
      createdBy: "sales",
      assignedTechnicians: ["John Doe", "Jane Smith"],
      scheduledDate: "2024-02-15",
      progress: 45,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
    },
    {
      id: "2",
      title: "Mobile App Development",
      client: "Tech Solutions",
      description: "Native mobile app for iOS and Android",
      status: "approved",
      createdBy: "sales",
      createdAt: "2024-01-18",
      updatedAt: "2024-01-18",
    },
    {
      id: "3",
      title: "Database Migration",
      client: "DataFlow Inc",
      description: "Migrate legacy database to cloud infrastructure",
      status: "registered",
      createdBy: "admin",
      createdAt: "2024-01-20",
      updatedAt: "2024-01-20",
    },
  ]);

  const addProject = (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
    );
  };

  return (
    <ProjectContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        projects,
        addProject,
        updateProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
