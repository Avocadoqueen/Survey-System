"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, GripVertical, ImageIcon, Settings } from "lucide-react"
import { useState } from "react"
import Image from "next/image";


export interface Question {
  id: string
  type:
    | "multiple-choice"
    | "short-answer"
    | "long-answer"
    | "rating"
    | "yes-no"
    | "dropdown"
    | "checkbox"
    | "date"
    | "number"
  question: string
  required: boolean
  options?: string[]
  theme?: "default" | "modern" | "minimal" | "colorful"
  hasImage?: boolean
  imageUrl?: string
}

interface QuestionBuilderProps {
  question: Question
  onUpdate: (question: Question) => void
  onDelete: () => void
  index: number
}

const questionTypes = [
  { value: "multiple-choice", label: "Multiple Choice", description: "Single selection from options" },
  { value: "checkbox", label: "Checkboxes", description: "Multiple selections allowed" },
  { value: "short-answer", label: "Short Answer", description: "Brief text response" },
  { value: "long-answer", label: "Long Answer", description: "Detailed text response" },
  { value: "rating", label: "Rating Scale", description: "1-5 or 1-10 scale" },
  { value: "yes-no", label: "Yes/No", description: "Simple binary choice" },
  { value: "dropdown", label: "Dropdown", description: "Select from dropdown menu" },
  { value: "date", label: "Date", description: "Date picker" },
  { value: "number", label: "Number", description: "Numeric input" },
]

const themes = [
  { value: "default", label: "Default", color: "bg-gray-100" },
  { value: "modern", label: "Modern", color: "bg-blue-100" },
  { value: "minimal", label: "Minimal", color: "bg-green-100" },
  { value: "colorful", label: "Colorful", color: "bg-purple-100" },
]

export function QuestionBuilder({ question, onUpdate, onDelete, index }: QuestionBuilderProps) {
  const [options, setOptions] = useState(question.options || [""])
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateQuestion = (field: keyof Question, value: any) => {
    onUpdate({ ...question, [field]: value })
  }

  const addOption = () => {
    const newOptions = [...options, ""]
    setOptions(newOptions)
    updateQuestion("options", newOptions)
  }

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...options]
    newOptions[optionIndex] = value
    setOptions(newOptions)
    updateQuestion("options", newOptions)
  }

  const removeOption = (optionIndex: number) => {
    const newOptions = options.filter((_, i) => i !== optionIndex)
    setOptions(newOptions)
    updateQuestion("options", newOptions)
  }

  const addImage = () => {
    updateQuestion("hasImage", true)
    updateQuestion("imageUrl", "/survey-question-illustration.png")
  }

  const removeImage = () => {
    updateQuestion("hasImage", false)
    updateQuestion("imageUrl", "")
  }

  const getThemeClass = (theme: string) => {
    switch (theme) {
      case "modern":
        return "border-blue-200 bg-blue-50/50"
      case "minimal":
        return "border-green-200 bg-green-50/50"
      case "colorful":
        return "border-purple-200 bg-purple-50/50"
      default:
        return ""
    }
  }

  return (
    <Card className={`${getThemeClass(question.theme || "default")}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
          {question.theme && question.theme !== "default" && (
            <Badge variant="secondary" className="text-xs">
              {themes.find((t) => t.value === question.theme)?.label}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-muted-foreground"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>Question Type</Label>
            <Select value={question.type} onValueChange={(value) => updateQuestion("type", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => updateQuestion("required", e.target.checked)}
                className="rounded border-border"
              />
              <span className="text-sm">Required</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`question-text-${question.id}`}>Question Text</Label>
          <Textarea
            id={`question-text-${question.id}`}
            placeholder="Enter your question here..."
            value={question.question}
            onChange={(e) => updateQuestion("question", e.target.value)}
            rows={2}
          />
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-medium text-sm">Advanced Options</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={question.theme || "default"} onValueChange={(value) => updateQuestion("theme", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${theme.color}`}></div>
                          {theme.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Add Image</Label>
                <div className="flex gap-2">
                  {!question.hasImage ? (
                    <Button variant="outline" size="sm" onClick={addImage} className="bg-transparent">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Add Image
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={removeImage} className="bg-transparent">
                      Remove Image
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {question.hasImage && question.imageUrl && (
              <div className="space-y-2">
                <Label>Question Image</Label>
                <Image
                  src={question.imageUrl || "/placeholder.svg"}
                  alt="Question illustration"
                  className="w-full max-w-md h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        )}

        {/* Question-specific options */}
        {(question.type === "multiple-choice" || question.type === "checkbox" || question.type === "dropdown") && (
          <div className="space-y-2">
            <Label>Answer Options</Label>
            <div className="space-y-2">
              {options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-2">
                  <Input
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => updateOption(optionIndex, e.target.value)}
                  />
                  {options.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(optionIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addOption} className="w-full bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        )}

        {question.type === "rating" && (
          <div className="space-y-2">
            <Label>Rating Scale (1-5)</Label>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>1 - Poor</span>
              <div className="flex-1 border-t border-dashed"></div>
              <span>5 - Excellent</span>
            </div>
          </div>
        )}

        {question.type === "yes-no" && (
          <div className="text-sm text-muted-foreground">
            This question will display Yes/No options for respondents.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
