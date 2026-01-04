"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Create",
    description:
      "Design your survey with our intuitive builder. Add questions, customize options, and set preferences.",
    icon: "📝",
  },
  {
    number: 2,
    title: "Share",
    description: "Share your survey with participants using QR codes, direct links, or email invitations.",
    icon: "📤",
  },
  {
    number: 3,
    title: "Analyze",
    description: "View real-time results with charts, graphs, and detailed analytics to make informed decisions.",
    icon: "📊",
  },
]

export function AnimatedSteps() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 3000) // Change step every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length)
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)
  }

  return (
    <div className="relative">
      {/* Desktop View - All Steps Visible with Highlight */}
      <div className="hidden md:grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Card
            key={index}
            className={`text-center transition-all duration-500 ${
              index === currentStep
                ? "ring-2 ring-primary shadow-lg scale-105 bg-primary/5"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <CardHeader>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${
                  index === currentStep ? "bg-primary text-primary-foreground shadow-lg" : "bg-primary/10"
                }`}
              >
                <span className="text-2xl">{step.icon}</span>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-500 ${
                  index === currentStep ? "bg-primary text-primary-foreground" : "bg-primary/10"
                }`}
              >
                <span
                  className={`text-sm font-bold ${index === currentStep ? "text-primary-foreground" : "text-primary"}`}
                >
                  {step.number}
                </span>
              </div>
              <CardTitle className={`transition-colors duration-500 ${index === currentStep ? "text-primary" : ""}`}>
                {step.title}
              </CardTitle>
              <CardDescription className="text-pretty">{step.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Mobile View - Carousel */}
      <div className="md:hidden relative">
        <Card className="text-center bg-primary/5 ring-2 ring-primary shadow-lg">
          <CardHeader>
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">{steps[currentStep].icon}</span>
            </div>
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-sm font-bold">{steps[currentStep].number}</span>
            </div>
            <CardTitle className="text-primary">{steps[currentStep].title}</CardTitle>
            <CardDescription className="text-pretty">{steps[currentStep].description}</CardDescription>
          </CardHeader>
        </Card>

        {/* Navigation Buttons */}
        <button
          onClick={prevStep}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextStep}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? "bg-primary w-6" : "bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
