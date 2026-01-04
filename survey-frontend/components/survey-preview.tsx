"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Question } from "./question-builder"

interface SurveyPreviewProps {
  title: string
  description: string
  questions: Question[]
}

export function SurveyPreview({ title, description, questions }: SurveyPreviewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title || "Untitled Survey"}</CardTitle>
          {description && <p className="text-muted-foreground">{description}</p>}
        </CardHeader>
      </Card>

      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Question {index + 1}
              {question.required && <span className="text-destructive">*</span>}
            </CardTitle>
            <p className="text-foreground">{question.question}</p>
          </CardHeader>
          <CardContent>
            {question.type === "multiple-choice" && (
              <RadioGroup disabled>
                {question.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                    <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "short-answer" && <Input placeholder="Your answer..." disabled />}

            {question.type === "long-answer" && <Textarea placeholder="Your detailed answer..." rows={4} disabled />}

            {question.type === "rating" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
                <RadioGroup disabled className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex flex-col items-center space-y-1">
                      <RadioGroupItem value={rating.toString()} id={`${question.id}-${rating}`} />
                      <Label htmlFor={`${question.id}-${rating}`} className="text-xs">
                        {rating}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="pt-6">
          <Button className="w-full" disabled>
            Submit Survey
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
