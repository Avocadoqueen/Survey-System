"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuestionBuilder, type Question } from "@/components/question-builder"
import { SurveyPreview } from "@/components/survey-preview"
import { SurveyTemplates, type SurveyTemplate } from "@/components/survey-templates"
import { Plus, Save, Eye, CopySlash as Publish, Palette, Wand2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateSurveyPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeTab, setActiveTab] = useState("templates")
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null)

  const handleTemplateSelect = (template: SurveyTemplate) => {
    setSelectedTemplate(template)
    setTitle(template.name)
    setDescription(template.description)

    // Add template questions based on template type
    if (template.id !== "custom-blank") {
      const templateQuestions = generateTemplateQuestions(template)
      setQuestions(templateQuestions)
    }

    setActiveTab("builder")
  }

  const generateTemplateQuestions = (template: SurveyTemplate): Question[] => {
    const baseQuestions: Question[] = []

    switch (template.id) {
      case "student-satisfaction":
        return [
          {
            id: "1",
            type: "rating",
            question: "How satisfied are you with the overall quality of education?",
            required: true,
            theme: "modern",
          },
          {
            id: "2",
            type: "multiple-choice",
            question: "Which campus facilities do you use most frequently?",
            required: true,
            options: ["Library", "Cafeteria", "Sports Center", "Computer Labs", "Study Areas"],
            theme: "modern",
          },
          {
            id: "3",
            type: "long-answer",
            question: "What improvements would you suggest for campus services?",
            required: false,
            theme: "modern",
          },
        ]

      case "course-evaluation":
        return [
          {
            id: "1",
            type: "rating",
            question: "How clear were the course objectives?",
            required: true,
            theme: "minimal",
          },
          {
            id: "2",
            type: "rating",
            question: "Rate the instructor's teaching effectiveness",
            required: true,
            theme: "minimal",
          },
          {
            id: "3",
            type: "yes-no",
            question: "Was the workload appropriate for this course?",
            required: true,
            theme: "minimal",
          },
        ]

      default:
        return []
    }
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "multiple-choice",
      question: "",
      required: false,
      options: [""],
      theme: "default",
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions]
    newQuestions[index] = updatedQuestion
    setQuestions(newQuestions)
  }

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const saveDraft = () => {
    // In a real app, this would save to the backend
    console.log("Saving draft:", { title, description, questions })
    alert("Survey saved as draft!")
  }

  const publishSurvey = () => {
    if (!title.trim()) {
      alert("Please enter a survey title")
      return
    }
    if (questions.length === 0) {
      alert("Please add at least one question")
      return
    }

    // In a real app, this would publish to the backend
    console.log("Publishing survey:", { title, description, questions })
    alert("Survey published successfully!")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Survey</h1>
            <p className="text-muted-foreground">
              Build your survey by choosing a template or starting from scratch with advanced design options.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="templates">
                <Wand2 className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="builder">
                <Palette className="h-4 w-4 mr-2" />
                Survey Builder
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-6">
              <SurveyTemplates onSelectTemplate={handleTemplateSelect} />
            </TabsContent>

            <TabsContent value="builder" className="space-y-6">
              {/* Survey Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Survey Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Survey Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter survey title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this survey is about..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Questions</h2>
                  <Button onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                {questions.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start building your survey by adding your first question or selecting a template.
                        </p>
                        <Button onClick={addQuestion}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Question
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <QuestionBuilder
                        key={question.id}
                        question={question}
                        onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                        onDelete={() => deleteQuestion(index)}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button variant="outline" onClick={saveDraft} className="flex-1 bg-transparent">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("preview")} className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Survey
                </Button>
                <Button onClick={publishSurvey} className="flex-1">
                  <Publish className="h-4 w-4 mr-2" />
                  Publish Survey
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Survey Preview</h2>
                <Button variant="outline" onClick={() => setActiveTab("builder")}>
                  Back to Builder
                </Button>
              </div>

              <SurveyPreview title={title} description={description} questions={questions} />

              <div className="flex justify-center pt-6 border-t">
                <Button onClick={publishSurvey} size="lg">
                  <Publish className="h-4 w-4 mr-2" />
                  Publish Survey
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
