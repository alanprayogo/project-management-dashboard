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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useProject } from "@/components/project-context";
import { ClientDate } from '../../components/ui/client-date'


export function AdminDashboard() {
  const { projects, updateProject } = useProject();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState({
    priority: "",
    budget: "",
    deadline: "",
    requirements: "",
  });

  const draftProjects = projects.filter((p) => p.status === "draft");
  const registeredProjects = projects.filter((p) => p.status === "registered");
  const allProjects = projects;

  const handleRegister = (projectId: string) => {
    updateProject(projectId, {
      status: "registered",
      ...registrationData,
    });
    setSelectedProject(null);
    setRegistrationData({
      priority: "",
      budget: "",
      deadline: "",
      requirements: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "registered":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
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
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage project registrations and system administration
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Registration
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registeredProjects.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                projects.filter(
                  (p) => p.status === "in-progress" || p.status === "scheduled"
                ).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allProjects.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Project Registration */}
      <Card>
        <CardHeader>
          <CardTitle>Project Registration</CardTitle>
          <CardDescription>
            Review and formally register new project submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {draftProjects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No projects pending registration
            </p>
          ) : (
            <div className="space-y-4">
              {draftProjects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Client: {project.client}
                      </p>
                      <p className="text-sm">{project.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Submitted:{" "}
                        <ClientDate date={project.createdAt} format="medium" />
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedProject(project.id)}
                      size="sm"
                    >
                      Register Project
                    </Button>
                  </div>

                  {selectedProject === project.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <h4 className="font-medium">
                        Project Registration Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority Level</Label>
                          <Select
                            value={registrationData.priority}
                            onValueChange={(value) =>
                              setRegistrationData((prev) => ({
                                ...prev,
                                priority: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget">Budget Estimate</Label>
                          <Input
                            id="budget"
                            value={registrationData.budget}
                            onChange={(e) =>
                              setRegistrationData((prev) => ({
                                ...prev,
                                budget: e.target.value,
                              }))
                            }
                            placeholder="$0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deadline">Target Deadline</Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={registrationData.deadline}
                            onChange={(e) =>
                              setRegistrationData((prev) => ({
                                ...prev,
                                deadline: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="requirements">
                          Additional Requirements
                        </Label>
                        <Textarea
                          id="requirements"
                          value={registrationData.requirements}
                          onChange={(e) =>
                            setRegistrationData((prev) => ({
                              ...prev,
                              requirements: e.target.value,
                            }))
                          }
                          placeholder="Add any additional requirements or notes"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleRegister(project.id)}>
                          Register Project
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedProject(null)}
                        >
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

      {/* All Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects Overview</CardTitle>
          <CardDescription>
            Complete list of all projects in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.client}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created:{" "}
                    <ClientDate date={project.createdAt} format="short" />
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </Badge>
                  {project.assignedTechnicians && (
                    <p className="text-xs text-muted-foreground">
                      Technicians: {project.assignedTechnicians.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
