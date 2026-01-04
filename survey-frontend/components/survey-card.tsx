"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface SurveyCardProps {
  id: string
  title: string
  description: string
  creator: string
  responses: number
  status: "active" | "draft" | "closed"
  createdAt: string
  isOwner?: boolean
}

export function SurveyCard({
  id,
  title,
  description,
  creator,
  responses,
  status,
  createdAt,
  isOwner = false,
}: SurveyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-3">{description}</CardDescription>
          </div>
          <Badge className={getStatusColor(status)} variant="secondary">
            {status}
          </Badge>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>Created by: {creator}</p>
          <p>Responses: {responses}</p>
          <p>Created: {createdAt}</p>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row gap-2">
          {isOwner ? (
            <>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Link href={`/surveys/${id}/edit`}>Edit</Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Link href={`/surveys/${id}/results`}>Results</Link>
              </Button>
              <Button size="sm" className="flex-1">
                <Link href={`/surveys/${id}/qr`}>QR Code</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Link href={`/surveys/${id}/qr`}>QR Code</Link>
              </Button>
              <Button size="sm" className="flex-1">
                <Link href={`/surveys/${id}/take`}>Take Survey</Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
