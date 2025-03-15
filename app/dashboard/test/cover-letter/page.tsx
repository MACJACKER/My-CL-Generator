"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { redirect } from "next/navigation";

export default function TestCoverLetterPage() {
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "Chartmetric",
    jobTitle: "Data Analyst",
    jobDescription: "We are looking for a Data Analyst to join our team. The ideal candidate will have experience with data analysis, visualization, and SQL.",
    specialInstructions: ""
  });

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const runTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/test/cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate test cover letter");
      }
      
      setTestResult(data);
    } catch (error) {
      console.error("Test error:", error);
      setError(error instanceof Error ? error.message : "Failed to run test");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Cover Letter Generation Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Test Cover Letter Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={runTest} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input 
                  id="jobTitle" 
                  name="jobTitle" 
                  value={formData.jobTitle} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea 
                  id="jobDescription" 
                  name="jobDescription" 
                  value={formData.jobDescription} 
                  onChange={handleChange} 
                  rows={4} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea 
                  id="specialInstructions" 
                  name="specialInstructions" 
                  value={formData.specialInstructions} 
                  onChange={handleChange} 
                  rows={2} 
                />
              </div>
              
              <Button type="submit" disabled={loading}>
                {loading ? "Testing..." : "Run Test"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Resume Information</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p><strong>Name:</strong> {testResult.resumeInfo.name}</p>
                  <p><strong>Email:</strong> {testResult.resumeInfo.email}</p>
                  <p><strong>Skills:</strong> {testResult.resumeInfo.skills.join(", ")}</p>
                  <p><strong>Experience:</strong> {testResult.resumeInfo.experience}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Generated Cover Letter</h3>
                <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap font-serif">
                  {testResult.coverLetter}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">User Data</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p><strong>Has Resume:</strong> {testResult.user.hasResume ? "Yes" : "No"}</p>
                  {testResult.user.resumeFilename && (
                    <p><strong>Resume File:</strong> {testResult.user.resumeFilename}</p>
                  )}
                  {testResult.user.resumeUploadedAt && (
                    <p><strong>Uploaded:</strong> {new Date(testResult.user.resumeUploadedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
} 