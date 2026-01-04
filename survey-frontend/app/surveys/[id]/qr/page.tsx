"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Download, Share2, QrCode } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// Mock survey data
const mockSurvey = {
  id: "1",
  title: "Student Satisfaction Survey 2024",
  description: "Help us improve campus facilities and services by sharing your feedback.",
  creator: "Dr. Sarah Johnson",
}

export default function SurveyQRPage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false)
  const survey = mockSurvey
  const surveyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/surveys/${params.id}/take`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadQR = () => {
    // In a real app, this would generate and download a QR code image
    alert("QR code download functionality would be implemented here")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Share Survey</h1>
            <p className="text-muted-foreground">Share your survey with participants using QR codes or direct links.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Survey Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Survey Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Title</Label>
                    <p className="text-foreground">{survey.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-muted-foreground">{survey.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Creator</Label>
                    <p className="text-muted-foreground">{survey.creator}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Survey Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="survey-url">Direct Link</Label>
                    <div className="flex gap-2">
                      <Input id="survey-url" value={surveyUrl} readOnly className="font-mono text-sm" />
                      <Button variant="outline" onClick={copyToClipboard} className="bg-transparent">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    {copied && <p className="text-sm text-green-600">Link copied to clipboard!</p>}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Link
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href={`/surveys/${params.id}/take`}>Preview Survey</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* QR Code */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* QR Code Placeholder */}
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">QR Code for Survey</p>
                      <p className="text-sm text-muted-foreground mt-2">Scan to access the survey instantly</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button onClick={downloadQR} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download QR Code
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">Download as PNG for printing or sharing</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-medium">For Classroom Use:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Display QR code on projector screen</li>
                      <li>• Print and distribute handouts</li>
                      <li>• Share link via email or LMS</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">For Campus Events:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Post QR codes on bulletin boards</li>
                      <li>• Include in event materials</li>
                      <li>• Share on social media</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
