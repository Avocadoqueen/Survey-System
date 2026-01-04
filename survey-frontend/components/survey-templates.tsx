"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Star, BookOpen, Coffee, Heart } from "lucide-react"

export interface SurveyTemplate {
  id: string
  name: string
  description: string
  category: string
  questions: number
  icon: React.ReactNode
  color: string
  previewQuestions: string[]
}

const templates: SurveyTemplate[] = [
  {
    id: "student-satisfaction",
    name: "Student Satisfaction",
    description: "Comprehensive survey to measure student satisfaction with university services",
    category: "Academic",
    questions: 12,
    icon: <Star className="h-5 w-5" />,
    color: "bg-blue-500",
    previewQuestions: [
      "How satisfied are you with the quality of education?",
      "Rate the campus facilities",
      "How would you rate the library services?",
    ],
  },
  {
    id: "course-evaluation",
    name: "Course Evaluation",
    description: "Evaluate teaching quality and course content effectiveness",
    category: "Academic",
    questions: 8,
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-green-500",
    previewQuestions: [
      "How clear were the course objectives?",
      "Rate the instructor's teaching effectiveness",
      "Was the workload appropriate?",
    ],
  },
  {
    id: "campus-services",
    name: "Campus Services",
    description: "Feedback on dining, transportation, and other campus services",
    category: "Services",
    questions: 10,
    icon: <Coffee className="h-5 w-5" />,
    color: "bg-orange-500",
    previewQuestions: [
      "How satisfied are you with dining options?",
      "Rate the campus transportation",
      "How would you improve campus services?",
    ],
  },
  {
    id: "event-feedback",
    name: "Event Feedback",
    description: "Collect feedback after university events and activities",
    category: "Events",
    questions: 6,
    icon: <Heart className="h-5 w-5" />,
    color: "bg-pink-500",
    previewQuestions: [
      "How would you rate the event overall?",
      "What did you like most about the event?",
      "Would you attend similar events?",
    ],
  },
  {
    id: "research-study",
    name: "Research Study",
    description: "Academic research survey template with various question types",
    category: "Research",
    questions: 15,
    icon: <FileText className="h-5 w-5" />,
    color: "bg-purple-500",
    previewQuestions: [
      "What is your field of study?",
      "Rate your agreement with the following statements",
      "Describe your research experience",
    ],
  },
  {
    id: "custom-blank",
    name: "Start from Scratch",
    description: "Create a completely custom survey with your own questions",
    category: "Custom",
    questions: 0,
    icon: <Users className="h-5 w-5" />,
    color: "bg-gray-500",
    previewQuestions: [],
  },
]

interface SurveyTemplatesProps {
  onSelectTemplate: (template: SurveyTemplate) => void
}

export function SurveyTemplates({ onSelectTemplate }: SurveyTemplatesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose a Template</h3>
        <p className="text-muted-foreground">Start with a pre-built template or create your own from scratch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${template.color} flex items-center justify-center text-white`}>
                  {template.icon}
                </div>
                <Badge variant="secondary">{template.category}</Badge>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="text-sm">{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {template.questions > 0 && (
                  <div className="text-sm text-muted-foreground">{template.questions} pre-built questions</div>
                )}

                {template.previewQuestions.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Sample Questions:
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {template.previewQuestions.slice(0, 2).map((question, index) => (
                        <li key={index} className="truncate">
                          • {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  onClick={() => onSelectTemplate(template)}
                  className="w-full mt-4"
                  variant={template.id === "custom-blank" ? "outline" : "default"}
                >
                  {template.id === "custom-blank" ? "Start from Scratch" : "Use Template"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
