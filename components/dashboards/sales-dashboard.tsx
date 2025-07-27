"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Clock, CheckCircle } from "lucide-react"
import { useProject } from "@/components/project-context"
import { ClientDate } from '../../components/ui/client-date'


export function SalesDashboard() {
  const { projects, addProject } = useProject()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    description: "",
  })

  const myProjects = projects.filter((p) => p.createdBy === "sales")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addProject({
      ...formData,
      status: "draft",
      createdBy: "sales",
    })
    setFormData({ title: "", client: "", description: "" })
    setShowForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Dashboard</h1>
          <p className="text-muted-foreground">Submit new project proposals and track submissions</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myProjects.filter((p) => p.status === "draft" || p.status === "registered").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                myProjects.filter(
                  (p) => p.status === "approved" || p.status === "scheduled" || p.status === "in-progress",
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Project Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Project Submission</CardTitle>
            <CardDescription>Submit a new project proposal for review</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter project title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value }))}
                    placeholder="Enter client name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the project requirements and scope"
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Submit Project</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>My Project Submissions</CardTitle>
          <CardDescription>Track the status of your submitted projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myProjects.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No projects submitted yet</p>
            ) : (
              myProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      <div>
                        Submitted: <ClientDate date={project.createdAt} format="short" />
                      </div>
                      <div>
                        <ClientDate date={project.createdAt} format="relative" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
