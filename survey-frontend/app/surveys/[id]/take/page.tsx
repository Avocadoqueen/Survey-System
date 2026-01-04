"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Mock survey data - in a real app, this would come from an API
const mockSurvey = {
  id: "1",
  title: "Student Satisfaction Survey 2024",
  description:
    "Help us improve campus facilities and services by sharing your feedback about your university experience. Your responses are anonymous and will be used to enhance the quality of education and services at Near East University.",
  creator: "Dr. Sarah Johnson",
  questions: [
    {
      id: "1",
      type: "multiple-choice" as const,
      question: "How would you rate the overall quality of education at Near East University?",
      required: true,
      options: ["Excellent", "Very Good", "Good", "Fair", "Poor"],
    },
    {
      id: "2",
      type: "rating" as const,
      question: "How satisfied are you with the campus facilities (library, labs, cafeteria, etc.)?",
      required: true,
    },
    {
      id: "3",
      type: "multiple-choice" as const,
      question: "Which campus facility do you use most frequently?",
      required: false,
      options: ["Library", "Computer Labs", "Cafeteria", "Sports Center", "Study Areas", "Other"],
    },
    {
      id: "4",
      type: "long-answer" as const,
      question: "What improvements would you like to see on campus? Please provide specific suggestions.",
      required: false,
    },
    {
      id: "5",
      type: "short-answer" as const,
      question: "What is your major/field of study?",
      required: true,
    },
  ],
}

export default function TakeSurveyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const survey = mockSurvey // In a real app, fetch based on params.id
  const progress = ((currentQuestion + 1) / survey.questions.length) * 100

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const canProceed = () => {
    const question = survey.questions[currentQuestion]
    if (question.required) {
      return answers[question.id]?.trim() !== "" && answers[question.id] !== undefined
    }
    return true
  }

  const nextQuestion = () => {
    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitSurvey = () => {
    // Check if all required questions are answered
    const unansweredRequired = survey.questions.filter(
      (q) => q.required && (!answers[q.id] || answers[q.id].trim() === ""),
    )

    if (unansweredRequired.length > 0) {
      alert("Please answer all required questions before submitting.")
      return
    }

    // In a real app, this would submit to the backend
    console.log("Submitting survey:", { surveyId: params.id, answers })
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your response has been submitted successfully. We appreciate your participation in this survey.
              </p>
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const question = survey.questions[currentQuestion]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Survey Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{survey.title}</h1>
            <p className="text-muted-foreground">{survey.description}</p>
            <p className="text-sm text-muted-foreground mt-2">Created by {survey.creator}</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {survey.questions.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                Question {currentQuestion + 1}
                {question.required && <span className="text-destructive">*</span>}
              </CardTitle>
              <p className="text-foreground text-lg">{question.question}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {question.type === "multiple-choice" && (
                <RadioGroup
                  value={answers[question.id] || ""}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                >
                  {question.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                      <Label htmlFor={`${question.id}-${index}`} className="text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === "short-answer" && (
                <Input
                  placeholder="Enter your answer..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="text-base"
                />
              )}

              {question.type === "long-answer" && (
                <Textarea
                  placeholder="Enter your detailed answer..."
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  rows={6}
                  className="text-base"
                />
              )}

              {question.type === "rating" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Very Dissatisfied</span>
                    <span>Very Satisfied</span>
                  </div>
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) => handleAnswer(question.id, value)}
                    className="flex justify-between"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex flex-col items-center space-y-2">
                        <RadioGroupItem value={rating.toString()} id={`${question.id}-${rating}`} />
                        <Label htmlFor={`${question.id}-${rating}`} className="text-sm">
                          {rating}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {question.required && <p className="text-sm text-muted-foreground">* This question is required</p>}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentQuestion === survey.questions.length - 1 ? (
                <Button onClick={submitSurvey} disabled={!canProceed()} size="lg">
                  Submit Survey
                </Button>
              ) : (
                <Button onClick={nextQuestion} disabled={!canProceed()}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Skip option for non-required questions */}
          {!question.required && !canProceed() && currentQuestion < survey.questions.length - 1 && (
            <div className="text-center mt-4">
              <Button variant="ghost" onClick={nextQuestion} className="text-muted-foreground">
                Skip this question
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
