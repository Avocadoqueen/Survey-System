"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, Users, Calendar, TrendingUp, FileText, Share2 } from "lucide-react"
import Link from "next/link"

// Mock survey results data
const mockSurveyResults = {
  id: "1",
  title: "Student Satisfaction Survey 2024",
  description: "Help us improve campus facilities and services by sharing your feedback.",
  creator: "Dr. Sarah Johnson",
  status: "active",
  createdAt: "2024-01-15",
  totalResponses: 245,
  questions: [
    {
      id: "1",
      type: "multiple-choice",
      question: "How would you rate the overall quality of education at Near East University?",
      responses: [
        { option: "Excellent", count: 89, percentage: 36.3 },
        { option: "Very Good", count: 98, percentage: 40.0 },
        { option: "Good", count: 45, percentage: 18.4 },
        { option: "Fair", count: 10, percentage: 4.1 },
        { option: "Poor", count: 3, percentage: 1.2 },
      ],
    },
    {
      id: "2",
      type: "rating",
      question: "How satisfied are you with the campus facilities?",
      averageRating: 4.2,
      responses: [
        { rating: "1", count: 5, percentage: 2.0 },
        { rating: "2", count: 12, percentage: 4.9 },
        { rating: "3", count: 34, percentage: 13.9 },
        { rating: "4", count: 98, percentage: 40.0 },
        { rating: "5", count: 96, percentage: 39.2 },
      ],
    },
    {
      id: "3",
      type: "multiple-choice",
      question: "Which campus facility do you use most frequently?",
      responses: [
        { option: "Library", count: 89, percentage: 36.3 },
        { option: "Computer Labs", count: 67, percentage: 27.3 },
        { option: "Cafeteria", count: 45, percentage: 18.4 },
        { option: "Sports Center", count: 23, percentage: 9.4 },
        { option: "Study Areas", count: 15, percentage: 6.1 },
        { option: "Other", count: 6, percentage: 2.4 },
      ],
    },
  ],
  textResponses: [
    {
      id: "4",
      question: "What improvements would you like to see on campus?",
      responses: [
        "More study spaces in the library",
        "Better Wi-Fi connectivity across campus",
        "Extended cafeteria hours",
        "More parking spaces",
        "Updated computer lab equipment",
        // ... more responses
      ],
    },
  ],
}

const COLORS = ["#9B1B30", "#C53030", "#E53E3E", "#FC8181", "#FEB2B2", "#FED7D7"]

export default function SurveyResultsPage({ params }: { params: { id: string } }) {
  const survey = mockSurveyResults

  const exportResults = (format: "csv" | "pdf") => {
    // In a real app, this would generate and download the file
    alert(`Exporting results as ${format.toUpperCase()}...`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{survey.title}</h1>
                <p className="text-muted-foreground mb-4">{survey.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {survey.totalResponses} responses
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Created {survey.createdAt}
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {survey.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  <Link href={`/surveys/${params.id}/qr`}>Share</Link>
                </Button>
                <Button variant="outline" onClick={() => exportResults("csv")} className="bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={() => exportResults("pdf")} className="bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{survey.totalResponses}</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">Above average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2m</div>
                <p className="text-xs text-muted-foreground">Per response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">Of invited participants</p>
              </CardContent>
            </Card>
          </div>

          {/* Results Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
              <TabsTrigger value="responses">Text Responses</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Question 1 - Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Education Quality Rating</CardTitle>
                    <CardDescription>{survey.questions[0].question}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={survey.questions[0].responses}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="option" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#9B1B30" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Question 3 - Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Most Used Facilities</CardTitle>
                    <CardDescription>{survey.questions[2].question}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={survey.questions[2].responses}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ payload }) => `${payload.option} (${payload.percentage}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {survey.questions[2].responses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Rating Question */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Campus Facilities Satisfaction</CardTitle>
                  <CardDescription>{survey.questions[1].question}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{survey.questions[1].averageRating}/5</span>
                      <span className="text-muted-foreground">Average Rating</span>
                    </div>
                    <div className="space-y-2">
                      {survey.questions[1].responses.map((response, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <span className="w-8 text-sm">{'rating' in response ? response.rating : ''} ⭐</span>
                          <Progress value={response.percentage} className="flex-1" />
                          <span className="text-sm text-muted-foreground w-16">
                            {response.count} ({response.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              {survey.questions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader>
                    <CardTitle>Question {index + 1}</CardTitle>
                    <CardDescription>{question.question}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {question.responses.map((response, responseIndex) => (
                        <div
                          key={responseIndex}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <span className="font-medium">
                            {question.type === "rating"
                              ? `${'rating' in response ? response.rating : ''} Star${'rating' in response && response.rating !== "1" ? "s" : ""}`
                              : 'option' in response ? response.option : ''}
                          </span>
                          <div className="flex items-center gap-4">
                            <Progress value={response.percentage} className="w-24" />
                            <span className="text-sm text-muted-foreground w-20">
                              {response.count} ({response.percentage}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="responses" className="space-y-6">
              {survey.textResponses.map((textQuestion) => (
                <Card key={textQuestion.id}>
                  <CardHeader>
                    <CardTitle>{textQuestion.question}</CardTitle>
                    <CardDescription>{textQuestion.responses.length} responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {textQuestion.responses.map((response, index) => (
                        <div key={index} className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-sm">{response}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
