"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CoverLetterFormProps {
  resumeUrl: string
}

export default function CoverLetterForm({ resumeUrl }: CoverLetterFormProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [coverLetterId, setCoverLetterId] = useState<string | null>(null)
  const [templateStyle, setTemplateStyle] = useState("professional")
  const [activeTab, setActiveTab] = useState("generate")
  const previewTabTriggerRef = useRef<HTMLButtonElement>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsGenerating(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const companyName = formData.get("companyName") as string
    const jobTitle = formData.get("jobTitle") as string
    const jobDescription = formData.get("jobDescription") as string
    const specialInstructions = formData.get("specialInstructions") as string

    try {
      console.log("Submitting form data:", {
        companyName,
        jobTitle,
        jobDescription,
        specialInstructions,
        resumeUrl,
        templateStyle,
      });

      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          jobTitle,
          jobDescription,
          specialInstructions,
          resumeUrl,
          templateStyle,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to generate cover letter")
      }

      const data = await response.json()
      console.log("Cover letter generated successfully:", data);
      setCoverLetter(data.coverLetter)
      setCoverLetterId(data.id)
      
      // Switch to preview tab
      setActiveTab("preview")
    } catch (error: any) {
      console.error("Error generating cover letter:", error);
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSave() {
    if (!coverLetter || !coverLetterId) return

    setIsEditing(true)

    try {
      const response = await fetch(`/api/cover-letter/${coverLetterId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: coverLetter,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to save cover letter")
      }

      router.push(`/dashboard/cover-letter/${coverLetterId}`)
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsEditing(false)
    }
  }

  async function handleDownload() {
    if (!coverLetter || !coverLetterId) return

    try {
      const response = await fetch(`/api/cover-letter/${coverLetterId}/pdf`, {
        method: "GET",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to download cover letter")
      }

      // Create a blob from the PDF Stream
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "cover-letter.pdf"
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error: any) {
      setError(error.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="generate">Generate</TabsTrigger>
        <TabsTrigger 
          value="preview" 
          disabled={!coverLetter}
          ref={previewTabTriggerRef}
        >
          Preview
        </TabsTrigger>
      </TabsList>

      <TabsContent value="generate">
        <Card>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" name="jobTitle" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={6}
                  placeholder="Paste the job description here..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  rows={3}
                  placeholder="Any specific points you want to highlight or style preferences..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateStyle">Template Style</Label>
                <Select value={templateStyle} onValueChange={setTemplateStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="traditional">Traditional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate Cover Letter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preview">
        <Card>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="border rounded-lg p-6">
                <Textarea
                  value={coverLetter || ""}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={20}
                  className="w-full font-serif"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={handleDownload}>
                  Download as PDF
                </Button>
                <Button onClick={handleSave} disabled={isEditing}>
                  {isEditing ? "Saving..." : "Save & Continue"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

