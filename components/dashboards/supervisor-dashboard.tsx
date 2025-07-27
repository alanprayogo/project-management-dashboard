"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Users, CheckCircle, Clock, FileText, Upload } from "lucide-react"
import { useProject } from "@/components/project-context"

const availableTechnicians = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown", "Lisa Davis"]

export function SupervisorDashboard() {
  const { projects, updateProject } = useProject()
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [schedulingData, setSchedulingData] = useState({
    scheduledDate: "",
    assignedTechnicians: [] as string[],
  })
  const [reportData, setReportData] = useState("")

  const approvedProjects = projects.filter((p) => p.status === "approved")
  const scheduledProjects = projects.filter((p) => p.status === "scheduled")
  const inProgressProjects = projects.filter((p) => p.status === "in-progress")

  const handleSchedule = (projectId: string) => {
    updateProject(projectId, {
      status: "scheduled",
      scheduledDate: schedulingData.scheduledDate,
      assignedTechnicians: schedulingData.assignedTechnicians,
    })
    setSelectedProject(null)
    setSchedulingData({ scheduledDate: "", assignedTechnicians: [] })
  }

  const handleTechnicianToggle = (technician: string) => {
    setSchedulingData((prev) => ({
      ...prev,
      assignedTechnicians: prev.assignedTechnicians.includes(technician)
        ? prev.assignedTechnicians.filter((t) => t !== technician)
        : [...prev.assignedTechnicians, technician],
    }))
  }

  const handleValidateProgress = (projectId: string) => {
    updateProject(projectId, {
      status: "completed",
      report: reportData,
    })
    setReportData("")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-purple-100 text-purple-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
        <p className="text-muted-foreground">Schedule projects, assign technicians, and validate progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready to Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Technicians</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableTechnicians.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Project Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle>Project Scheduling</CardTitle>
          <CardDescription>Schedule approved projects and assign technicians</CardDescription>
        </CardHeader>
        <CardContent>
          {approvedProjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No approved projects ready for scheduling</p>
          ) : (
            <div className="space-y-4">
              {approvedProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">Client: {project.client}</p>
                      <p className="text-sm">{project.description}</p>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </Badge>
                    </div>
                    <Button onClick={() => setSelectedProject(project.id)} size="sm">
                      Schedule Project
                    </Button>
                  </div>

                  {selectedProject === project.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <h4 className="font-medium">Project Scheduling</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="scheduledDate">Scheduled Date</Label>
                          <Input
                            id="scheduledDate"
                            type="date"
                            value={schedulingData.scheduledDate}
                            onChange={(e) => setSchedulingData((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Assign Technicians</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {availableTechnicians.map((technician) => (
                              <div key={technician} className="flex items-center space-x-2">
                                <Checkbox
                                  id={technician}
                                  checked={schedulingData.assignedTechnicians.includes(technician)}
                                  onCheckedChange={() => handleTechnicianToggle(technician)}
                                />
                                <Label htmlFor={technician} className="text-sm">
                                  {technician}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSchedule(project.id)}
                          disabled={!schedulingData.scheduledDate || schedulingData.assignedTechnicians.length === 0}
                        >
                          Schedule Project
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedProject(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Validation</CardTitle>
          <CardDescription>Review and validate technician progress reports</CardDescription>
        </CardHeader>
        <CardContent>
          {inProgressProjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No projects in progress to validate</p>
          ) : (
            <div className="space-y-4">
              {inProgressProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">Client: {project.client}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Progress:</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${project.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{project.progress || 0}%</span>
                        </div>
                        {project.assignedTechnicians && (
                          <p className="text-sm text-muted-foreground">
                            Technicians: {project.assignedTechnicians.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`report-${project.id}`}>Project Report</Label>
                      <Textarea
                        id={`report-${project.id}`}
                        value={reportData}
                        onChange={(e) => setReportData(e.target.value)}
                        placeholder="Enter project completion report and validation notes..."
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleValidateProgress(project.id)}
                        className="flex items-center gap-2"
                        disabled={!reportData.trim()}
                      >
                        <FileText className="h-4 w-4" />
                        Validate & Submit Report
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                        <Upload className="h-4 w-4" />
                        Upload Files
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Projects</CardTitle>
          <CardDescription>Overview of all scheduled projects and their assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {scheduledProjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No scheduled projects</p>
          ) : (
            <div className="space-y-4">
              {scheduledProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                    <p className="text-xs text-muted-foreground">
                      Scheduled:{" "}
                      {project.scheduledDate ? new Date(project.scheduledDate).toLocaleDateString() : "Not set"}
                    </p>
                    {project.assignedTechnicians && (
                      <p className="text-xs text-muted-foreground">
                        Technicians: {project.assignedTechnicians.join(", ")}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
