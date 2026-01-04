"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Lock, Edit, Trash2, QrCode, BarChart3, Calendar, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock user data
const mockUser = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@neu.edu.tr",
  studentId: "20240001",
  joinDate: "2024-01-10",
  avatar: "",
}

// Mock created surveys
const mockCreatedSurveys = [
  {
    id: "4",
    title: "Research Study on Learning Methods",
    description: "A comprehensive study on different learning methodologies and their effectiveness.",
    responses: 67,
    status: "active" as const,
    createdAt: "2024-01-10",
  },
  {
    id: "5",
    title: "Library Usage Survey",
    description: "Understanding how students use library resources and what improvements they would like to see.",
    responses: 23,
    status: "draft" as const,
    createdAt: "2024-01-22",
  },
  {
    id: "6",
    title: "Campus Transportation Survey",
    description: "Feedback on campus shuttle services and transportation needs.",
    responses: 156,
    status: "closed" as const,
    createdAt: "2024-01-05",
  },
]

// Mock completed surveys
const mockCompletedSurveys = [
  {
    id: "1",
    title: "Student Satisfaction Survey 2024",
    creator: "Dr. Sarah Johnson",
    completedAt: "2024-01-20",
    status: "completed" as const,
  },
  {
    id: "2",
    title: "Course Evaluation - Computer Science",
    creator: "Prof. Michael Chen",
    completedAt: "2024-01-18",
    status: "completed" as const,
  },
  {
    id: "3",
    title: "Campus Dining Preferences",
    creator: "Campus Services",
    completedAt: "2024-01-15",
    status: "completed" as const,
  },
]

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [isEditing, setIsEditing] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setIsEditing(false)
    alert("Profile updated successfully!")
  }

  const handleDeleteSurvey = (surveyId: string, title: string) => {
    // In a real app, this would delete from the backend
    alert(`Survey "${title}" has been deleted.`)
  }

  const handleChangePassword = () => {
    // In a real app, this would open a password change modal
    alert("Password change functionality would be implemented here")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Account Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and view your survey activity.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">ID: {user.studentId}</p>
                    <Separator className="my-4" />
                    <div className="w-full space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Member since:</span>
                        <span>{user.joinDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Surveys created:</span>
                        <span>{mockCreatedSurveys.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Surveys completed:</span>
                        <span>{mockCompletedSurveys.length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile Settings</TabsTrigger>
                  <TabsTrigger value="created">My Surveys</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Personal Information
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                          className="bg-transparent"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {isEditing ? "Cancel" : "Edit"}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={user.firstName}
                            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={user.lastName}
                            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student/Staff ID</Label>
                        <Input id="studentId" value={user.studentId} disabled />
                        <p className="text-xs text-muted-foreground">Contact support to change your ID</p>
                      </div>

                      {isEditing && (
                        <div className="flex gap-2">
                          <Button onClick={handleSaveProfile}>Save Changes</Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent">
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>Manage your account security settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" onClick={handleChangePassword} className="bg-transparent">
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="created" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">My Created Surveys</h2>
                    <Button>
                      <Link href="/surveys/create">Create New Survey</Link>
                    </Button>
                  </div>

                  {mockCreatedSurveys.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No surveys created yet</h3>
                        <p className="text-muted-foreground text-center mb-4">
                          Create your first survey to start collecting responses.
                        </p>
                        <Button>
                          <Link href="/surveys/create">Create Survey</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {mockCreatedSurveys.map((survey) => (
                        <Card key={survey.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold">{survey.title}</h3>
                                  <Badge className={getStatusColor(survey.status)} variant="secondary">
                                    {survey.status}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground mb-4">{survey.description}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {survey.responses} responses
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Created {survey.createdAt}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button variant="outline" size="sm" className="bg-transparent">
                                  <QrCode className="h-4 w-4 mr-2" />
                                  <Link href={`/surveys/${survey.id}/qr`}>QR Code</Link>
                                </Button>
                                <Button variant="outline" size="sm" className="bg-transparent">
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  <Link href={`/surveys/${survey.id}/results`}>Results</Link>
                                </Button>
                                <Button variant="outline" size="sm" className="bg-transparent">
                                  <Edit className="h-4 w-4 mr-2" />
                                  <Link href={`/surveys/${survey.id}/edit`}>Edit</Link>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive hover:text-destructive bg-transparent"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Survey</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{survey.title}"? This action cannot be undone
                                        and all responses will be lost.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteSurvey(survey.id, survey.title)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="completed" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Completed Surveys</h2>
                    <p className="text-muted-foreground">{mockCompletedSurveys.length} surveys completed</p>
                  </div>

                  {mockCompletedSurveys.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No surveys completed yet</h3>
                        <p className="text-muted-foreground text-center mb-4">
                          Start participating in surveys to see your completion history here.
                        </p>
                        <Button>
                          <Link href="/dashboard">Browse Surveys</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {mockCompletedSurveys.map((survey) => (
                        <Card key={survey.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold">{survey.title}</h3>
                                  <Badge className={getStatusColor(survey.status)} variant="secondary">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    {survey.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>Created by {survey.creator}</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Completed {survey.completedAt}
                                  </span>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Link href={`/surveys/${survey.id}/take`}>View Survey</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
