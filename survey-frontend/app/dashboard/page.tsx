"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SurveyCard } from "@/components/survey-card"
import { Search, Plus, BarChart3, Users, FileText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Mock data - in a real app, this would come from an API
const mockSurveys = [
  {
    id: "1",
    title: "Student Satisfaction Survey 2024",
    description:
      "Help us improve campus facilities and services by sharing your feedback about your university experience.",
    creator: "Dr. Sarah Johnson",
    responses: 245,
    status: "active" as const,
    createdAt: "2024-01-15",
    isOwner: false,
  },
  {
    id: "2",
    title: "Course Evaluation - Computer Science",
    description: "Evaluate the quality of teaching and course content for the Computer Science program.",
    creator: "Prof. Michael Chen",
    responses: 89,
    status: "active" as const,
    createdAt: "2024-01-20",
    isOwner: false,
  },
  {
    id: "3",
    title: "Campus Dining Preferences",
    description: "Share your thoughts on campus dining options and help us plan new menu items.",
    creator: "Campus Services",
    responses: 156,
    status: "active" as const,
    createdAt: "2024-01-18",
    isOwner: false,
  },
]

const mockMySurveys = [
  {
    id: "4",
    title: "Research Study on Learning Methods",
    description:
      "A comprehensive study on different learning methodologies and their effectiveness among university students.",
    creator: "You",
    responses: 67,
    status: "active" as const,
    createdAt: "2024-01-10",
    isOwner: true,
  },
  {
    id: "5",
    title: "Library Usage Survey",
    description: "Understanding how students use library resources and what improvements they would like to see.",
    creator: "You",
    responses: 23,
    status: "draft" as const,
    createdAt: "2024-01-22",
    isOwner: true,
  },
]

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSurveys = mockSurveys.filter(
    (survey) =>
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.creator.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredMySurveys = mockMySurveys.filter((survey) =>
    survey.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Manage your surveys and discover new ones to participate in.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Surveys</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockSurveys.length}</div>
                <p className="text-xs text-muted-foreground">Ready to take</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Surveys</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockMySurveys.length}</div>
                <p className="text-xs text-muted-foreground">Created by you</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">90</div>
                <p className="text-xs text-muted-foreground">Across your surveys</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Surveys taken</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Create */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search surveys by title or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <Link href="/surveys/create">Create New Survey</Link>
            </Button>
          </div>

          {/* Survey Tabs */}
          <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available">Available Surveys</TabsTrigger>
              <TabsTrigger value="my-surveys">My Surveys</TabsTrigger>
            </TabsList>

            <TabsContent value="available" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Available Surveys</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredSurveys.length} survey{filteredSurveys.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {filteredSurveys.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No surveys found</h3>
                    <p className="text-muted-foreground text-center">
                      {searchTerm
                        ? "Try adjusting your search terms."
                        : "Check back later for new surveys to participate in."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSurveys.map((survey) => (
                    <SurveyCard key={survey.id} {...survey} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-surveys" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Surveys</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredMySurveys.length} survey{filteredMySurveys.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {filteredMySurveys.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No surveys created yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Create your first survey to start collecting responses.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      <Link href="/surveys/create">Create Survey</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMySurveys.map((survey) => (
                    <SurveyCard key={survey.id} {...survey} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
