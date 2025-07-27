"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, BarChart3, TrendingUp, AlertTriangle } from "lucide-react"
import { useProject } from "@/components/project-context"

export function ManagerDashboard() {
  const { projects, updateProject } = useProject()
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")

  const pendingReview = projects.filter((p) => p.status === "registered")
  const approvedProjects = projects.filter(
    (p) => p.status === "approved" || p.status === "scheduled" || p.status === "in-progress",
  )
  const completedReports = projects.filter((p) => p.status === "completed")

  const handleApprove = (projectId: string) => {
    updateProject(projectId, {
      status: "approved",
      reviewNotes,
    })
    setSelectedProject(null)
    setReviewNotes("")
  }

  const handleReject = (projectId: string) => {
    updateProject(projectId, {
      status: "rejected",
      reviewNotes,
    })
    setSelectedProject(null)
    setReviewNotes("")
  }

  const handleFinalStatus = (projectId: string, status: "done" | "cancelled" | "pending") => {
    updateProject(projectId, { status })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "scheduled":
        return "bg-purple-100 text-purple-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      case "done":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="text-muted-foreground">Review projects and manage operational decisions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReview.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Final Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReports.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.length > 0
                ? Math.round((projects.filter((p) => p.status === "done").length / projects.length) * 100)
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Review Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Review</CardTitle>
          <CardDescription>Review registered projects and decide approval status</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingReview.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No projects pending review</p>
          ) : (
            <div className="space-y-4">
              {pendingReview.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">Client: {project.client}</p>
                      <p className="text-sm">{project.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Registered: {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setSelectedProject(project.id)} size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>

                  {selectedProject === project.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reviewNotes">Review Notes</Label>
                        <Textarea
                          id="reviewNotes"
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Add your review comments..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleApprove(project.id)} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(project.id)}
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
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

      {/* Final Status Review */}
      <Card>
        <CardHeader>
          <CardTitle>Final Project Status Review</CardTitle>
          <CardDescription>Review completed project reports and set final status</CardDescription>
        </CardHeader>
        <CardContent>
          {completedReports.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No completed reports to review</p>
          ) : (
            <div className="space-y-4">
              {completedReports.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">Client: {project.client}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Progress:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{project.progress || 0}%</span>
                      </div>
                      {project.report && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Project Report:</p>
                          <p className="text-sm text-muted-foreground">{project.report}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleFinalStatus(project.id, "done")}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Done
                      </Button>
                      <Button onClick={() => handleFinalStatus(project.id, "pending")} size="sm" variant="outline">
                        Mark Pending
                      </Button>
                      <Button
                        onClick={() => handleFinalStatus(project.id, "cancelled")}
                        size="sm"
                        variant="destructive"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects Overview</CardTitle>
          <CardDescription>Complete overview of all projects and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                  {project.assignedTechnicians && (
                    <p className="text-xs text-muted-foreground">
                      Technicians: {project.assignedTechnicians.join(", ")}
                    </p>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                  {project.progress !== undefined && (
                    <p className="text-xs text-muted-foreground">Progress: {project.progress}%</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
