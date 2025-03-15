"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { redirect } from "next/navigation";

export default function ResumeTestPage() {
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/resume/test");
      const data = await response.json();
      
      setTestResult(data);
    } catch (error) {
      console.error("Test error:", error);
      setError("Failed to run test. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const viewResume = () => {
    if (testResult?.resume?.accessUrl) {
      window.open(testResult.resume.accessUrl, "_blank");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Resume Functionality Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Resume Upload and Viewing</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runTest} disabled={loading}>
            {loading ? "Running Test..." : "Run Test"}
          </Button>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {testResult && (
            <div className="mt-4 space-y-4">
              <h3 className="text-lg font-semibold">Test Results:</h3>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>Status:</strong> {testResult.message}</p>
                
                {testResult.resume && (
                  <>
                    <p><strong>Resume Filename:</strong> {testResult.resume.filename}</p>
                    <p><strong>Resume URL:</strong> {testResult.resume.url}</p>
                    <p><strong>File Exists:</strong> {testResult.resume.fileExists ? "Yes" : "No"}</p>
                    <p><strong>Uploaded At:</strong> {new Date(testResult.resume.uploadedAt).toLocaleString()}</p>
                    
                    <div className="mt-2">
                      <Button onClick={viewResume} disabled={!testResult.resume.fileExists}>
                        View Resume
                      </Button>
                    </div>
                  </>
                )}
                
                <div className="mt-4">
                  <h4 className="font-medium">Raw Response:</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-60">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Resume Page
        </Button>
      </div>
    </div>
  )
} 