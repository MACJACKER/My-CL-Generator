"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "next-auth/react"

interface ResumeData {
  url: string
  filename: string
  uploadedAt: Date
}

interface ResumeUploadFormProps {
  existingResume: ResumeData | null
}

export default function ResumeUploadForm({ existingResume }: ResumeUploadFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!file) {
      setError("Please select a file to upload")
      return
    }

    if (!session?.user?.id) {
      setError("You must be logged in to upload a resume")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append("resume", file)
    formData.append("userId", session.user.id)

    try {
      console.log("Uploading resume:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2) + "MB")
      
      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error("Resume upload failed:", data)
        throw new Error(data.message || "Failed to upload resume")
      }

      console.log("Resume upload successful:", data)
      setSuccess("Resume uploaded successfully")
      router.refresh()
    } catch (error: any) {
      console.error("Resume upload error:", error)
      setError(error.message || "Something went wrong. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="border-2 border-blue-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-2xl text-blue-800">Resume Upload</CardTitle>
        <CardDescription>Upload your resume to use for generating cover letters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {existingResume && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium mb-2 text-blue-800">Current Resume</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700">{existingResume.filename}</p>
                <p className="text-xs text-gray-500">
                  Uploaded on {new Date(existingResume.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <a
                href={existingResume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  // Use the API route to view the file
                  window.open(`/api/static${existingResume.url.replace('/uploads', '')}`, '_blank');
                }}
              >
                View
              </a>
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
            <div className="font-semibold">Error</div>
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded border border-green-200">
            <div className="font-semibold">Success</div>
            <div>{success}</div>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume" className="text-gray-700">Upload Resume (PDF, DOCX)</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-500">Max file size: 5MB. Supported formats: PDF, DOCX, DOC</p>
          </div>

          <Button 
            type="submit" 
            disabled={isUploading || !file}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUploading ? "Uploading..." : existingResume ? "Update Resume" : "Upload Resume"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

