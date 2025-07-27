"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Wrench,
  Clock,
  CheckCircle,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import { useProject } from "@/components/project-context";

export function TechnicianDashboard() {
  const { projects, updateProject } = useProject();
  const [attendanceMarked, setAttendanceMarked] = useState<string[]>([]);
  const [progressUpdate, setProgressUpdate] = useState<{
    [key: string]: { progress: number; notes: string };
  }>({});

  // For demo purposes, we'll show projects assigned to "John Doe"
  const myProjects = projects.filter(
    (p) =>
      p.assignedTechnicians?.includes("John Doe") &&
      (p.status === "scheduled" || p.status === "in-progress")
  );

  const handleMarkAttendance = (projectId: string) => {
    setAttendanceMarked((prev) => [...prev, projectId]);
    updateProject(projectId, { status: "in-progress" });
  };

  const handleProgressUpdate = (projectId: string) => {
    const update = progressUpdate[projectId];
    if (update) {
      updateProject(projectId, {
        progress: update.progress,
        progressNotes: update.notes,
      });
      setProgressUpdate((prev) => {
        const newState = { ...prev };
        delete newState[projectId];
        return newState;
      });
    }
  };

  const updateProgressData = (
    projectId: string,
    field: "progress" | "notes",
    value: number | string
  ) => {
    setProgressUpdate((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value,
      },
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Technician Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your assigned projects and track progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Projects
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myProjects.filter((p) => p.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">✓</div>
          </CardContent>
        </Card>
      </div>

      {/* My Projects */}
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Projects</CardTitle>
          <CardDescription>
            Projects assigned to you and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myProjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No projects assigned to you
            </p>
          ) : (
            <div className="space-y-4">
              {myProjects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Client: {project.client}
                      </p>
                      <p className="text-sm">{project.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)}
                        </Badge>
                        {project.scheduledDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(
                              project.scheduledDate
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 min-w-fit">
                      {project.status === "scheduled" &&
                        !attendanceMarked.includes(project.id) && (
                          <Button
                            onClick={() => handleMarkAttendance(project.id)}
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            Mark Attendance
                          </Button>
                        )}
                      {project.status === "in-progress" && (
                        <Button
                          onClick={() => handleProgressUpdate(project.id)}
                          size="sm"
                          disabled={!progressUpdate[project.id]?.progress}
                        >
                          Update Progress
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Section */}
                  {project.status === "in-progress" && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            Current Progress
                          </Label>
                          <span className="text-sm text-muted-foreground">
                            {project.progress || 0}%
                          </span>
                        </div>
                        <Progress
                          value={project.progress || 0}
                          className="w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`progress-${project.id}`}>
                            Update Progress (%)
                          </Label>
                          <Input
                            id={`progress-${project.id}`}
                            type="number"
                            min="0"
                            max="100"
                            value={progressUpdate[project.id]?.progress || ""}
                            onChange={(e) =>
                              updateProgressData(
                                project.id,
                                "progress",
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                            placeholder="Enter progress percentage"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`notes-${project.id}`}>
                            Progress Notes
                          </Label>
                          <Textarea
                            id={`notes-${project.id}`}
                            value={progressUpdate[project.id]?.notes || ""}
                            onChange={(e) =>
                              updateProgressData(
                                project.id,
                                "notes",
                                e.target.value
                              )
                            }
                            placeholder="Add progress notes..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium">Team Members:</p>
                        <p className="text-muted-foreground">
                          {project.assignedTechnicians?.join(", ") ||
                            "Not assigned"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Project Location:</p>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          Client Site - {project.client}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Attendance</CardTitle>
            <CardDescription>Mark your attendance for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Today's Attendance</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Present</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Check-in: 08:00 AM</p>
                <p>Status: On-site</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myProjects.filter(
                (p) =>
                  p.scheduledDate === new Date().toISOString().split("T")[0]
              ).length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No projects scheduled for today
                </p>
              ) : (
                myProjects
                  .filter(
                    (p) =>
                      p.scheduledDate === new Date().toISOString().split("T")[0]
                  )
                  .map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.client}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {project.status}
                      </Badge>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
