'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { checkApiHealth, extractResumeInfoML, analyzeJobML, generateCoverLetterML } from '@/lib/api-client';
import { ResumeInfo, JobAnalysis } from '@/lib/cover-letter-generator';

export default function MLTestPage() {
  const [isMLAvailable, setIsMLAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [activeTab, setActiveTab] = useState('extract');

  // Sample resume and job description for testing
  const sampleResume = `John Doe
john.doe@example.com | (555) 123-4567 | New York, NY

SUMMARY
Data Scientist with 5 years of experience in machine learning, statistical analysis, and data visualization.

SKILLS
Python, R, SQL, TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, Data Visualization, Machine Learning

EXPERIENCE
Senior Data Scientist | ABC Analytics | 2020 - Present
- Developed machine learning models for customer segmentation
- Created data pipelines using Python and SQL
- Presented findings to executive stakeholders

Data Analyst | XYZ Corp | 2018 - 2020
- Performed statistical analysis on large datasets
- Created dashboards using Tableau
- Collaborated with cross-functional teams

EDUCATION
Master of Science in Data Science | New York University | 2018
Bachelor of Science in Computer Science | Boston University | 2016`;

  const sampleJobDescription = `Data Scientist
DataTech Solutions

About the Role:
We are seeking an experienced Data Scientist to join our growing team. The ideal candidate will have strong skills in machine learning, statistical analysis, and data visualization.

Responsibilities:
- Develop and implement machine learning models
- Analyze large datasets to extract insights
- Create data visualizations and reports
- Collaborate with engineering and product teams
- Present findings to stakeholders

Requirements:
- 3+ years of experience in data science or related field
- Proficiency in Python, SQL, and data visualization tools
- Experience with machine learning frameworks (TensorFlow, PyTorch)
- Strong communication skills
- Bachelor's degree in Computer Science, Statistics, or related field`;

  useEffect(() => {
    async function checkBackendStatus() {
      try {
        const isAvailable = await checkApiHealth();
        setIsMLAvailable(isAvailable);
      } catch (err) {
        setIsMLAvailable(false);
        setError('Failed to check ML backend status');
      }
    }
    
    checkBackendStatus();
  }, []);

  const loadSampleData = () => {
    setResumeText(sampleResume);
    setJobDescription(sampleJobDescription);
    setCompanyName('DataTech Solutions');
    setJobTitle('Data Scientist');
  };

  const handleExtractResume = async () => {
    if (!resumeText) {
      setError('Please enter resume text');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await extractResumeInfoML(resumeText);
      if (result.error) {
        setError(result.error);
      } else if (result.resumeInfo) {
        setResumeInfo(result.resumeInfo);
        setActiveTab('analyze');
      }
    } catch (err) {
      setError('Failed to extract resume information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeJob = async () => {
    if (!jobDescription || !resumeInfo) {
      setError('Please enter job description and extract resume information first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await analyzeJobML(jobDescription, resumeInfo);
      if (result.error) {
        setError(result.error);
      } else if (result.jobAnalysis) {
        setJobAnalysis(result.jobAnalysis);
        setActiveTab('generate');
      }
    } catch (err) {
      setError('Failed to analyze job description');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!resumeText || !jobDescription || !companyName || !jobTitle) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateCoverLetterML(
        resumeText,
        {
          companyName,
          jobTitle,
          jobDescription
        },
        '',
        'professional'
      );
      
      if (result.error) {
        setError(result.error);
      } else {
        setCoverLetter(result.coverLetter);
        setActiveTab('result');
      }
    } catch (err) {
      setError('Failed to generate cover letter');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">ML Backend Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ML Backend Status</CardTitle>
          <CardDescription>Check if the ML backend is available</CardDescription>
        </CardHeader>
        <CardContent>
          {isMLAvailable === null ? (
            <p>Checking ML backend status...</p>
          ) : (
            <div className="flex items-center gap-2">
              <span>Status:</span>
              {isMLAvailable ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">Available</Badge>
              ) : (
                <Badge variant="destructive">Not Available</Badge>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => checkApiHealth().then(setIsMLAvailable)}>
            Refresh Status
          </Button>
        </CardFooter>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="extract">1. Extract Resume</TabsTrigger>
          <TabsTrigger value="analyze">2. Analyze Job</TabsTrigger>
          <TabsTrigger value="generate">3. Generate Letter</TabsTrigger>
          <TabsTrigger value="result">4. Result</TabsTrigger>
        </TabsList>
        
        <TabsContent value="extract">
          <Card>
            <CardHeader>
              <CardTitle>Extract Resume Information</CardTitle>
              <CardDescription>
                Enter your resume text or use the sample data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your resume text here..."
                className="min-h-[300px] mb-4"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <Button variant="outline" onClick={loadSampleData} className="mr-2">
                Load Sample Data
              </Button>
            </CardContent>
            <CardFooter>
              <Button onClick={handleExtractResume} disabled={isLoading || !isMLAvailable}>
                {isLoading ? 'Processing...' : 'Extract Information'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analyze">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Job Description</CardTitle>
              <CardDescription>
                Enter the job description to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-4">
                <div>
                  <label className="block mb-2">Company Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block mb-2">Job Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Job Title"
                  />
                </div>
              </div>
              <Textarea
                placeholder="Paste the job description here..."
                className="min-h-[200px] mb-4"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              
              {resumeInfo && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                  <h3 className="font-bold mb-2">Extracted Resume Information</h3>
                  <pre className="text-xs overflow-auto">{JSON.stringify(resumeInfo, null, 2)}</pre>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleAnalyzeJob} disabled={isLoading || !resumeInfo || !isMLAvailable}>
                {isLoading ? 'Processing...' : 'Analyze Job'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate Cover Letter</CardTitle>
              <CardDescription>
                Review the information and generate your cover letter
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resumeInfo && jobAnalysis && (
                <div className="grid gap-4">
                  <div className="p-4 border rounded bg-gray-50">
                    <h3 className="font-bold mb-2">Job Analysis</h3>
                    <pre className="text-xs overflow-auto">{JSON.stringify(jobAnalysis, null, 2)}</pre>
                  </div>
                  
                  <div className="p-4 border rounded bg-gray-50">
                    <h3 className="font-bold mb-2">Resume Information</h3>
                    <pre className="text-xs overflow-auto">{JSON.stringify(resumeInfo, null, 2)}</pre>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateCoverLetter} 
                disabled={isLoading || !resumeInfo || !jobAnalysis || !isMLAvailable}
              >
                {isLoading ? 'Generating...' : 'Generate Cover Letter'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="result">
          <Card>
            <CardHeader>
              <CardTitle>Generated Cover Letter</CardTitle>
              <CardDescription>
                Your ML-generated cover letter
              </CardDescription>
            </CardHeader>
            <CardContent>
              {coverLetter ? (
                <div className="p-6 border rounded bg-white whitespace-pre-wrap">
                  {coverLetter}
                </div>
              ) : (
                <p>No cover letter generated yet. Please complete the previous steps.</p>
              )}
            </CardContent>
            <CardFooter>
              {coverLetter && (
                <Button onClick={() => navigator.clipboard.writeText(coverLetter)}>
                  Copy to Clipboard
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {error && (
        <div className="mt-4 p-4 border border-red-300 rounded bg-red-50 text-red-800">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
} 