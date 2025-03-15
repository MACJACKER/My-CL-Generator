/**
 * API Client for ML Cover Letter Generator
 * This module provides functions to interact with the ML-powered backend API
 */

import { ResumeInfo, JobAnalysis } from './cover-letter-generator';

// Get the API URL from environment variables or use a default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const USE_ML_BACKEND = process.env.NEXT_PUBLIC_USE_ML_BACKEND === 'true';

/**
 * Check if the ML backend API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  if (!USE_ML_BACKEND) return false;
  
  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}

/**
 * Generate a cover letter using the ML backend
 */
export async function generateCoverLetterML(
  resumeText: string,
  jobInfo: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
  },
  specialInstructions?: string,
  templateStyle = "professional"
): Promise<{ coverLetter: string; error?: string }> {
  if (!USE_ML_BACKEND) {
    return { 
      error: 'ML backend is not enabled',
      coverLetter: '' 
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/api/generate-cover-letter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeText,
        jobInfo,
        specialInstructions,
        templateStyle
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || 'Failed to generate cover letter',
        coverLetter: ''
      };
    }
    
    const data = await response.json();
    return { coverLetter: data.coverLetter };
  } catch (error) {
    console.error('Cover letter generation error:', error);
    return { 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      coverLetter: '' 
    };
  }
}

/**
 * Extract resume information using the ML backend
 */
export async function extractResumeInfoML(
  resumeText: string
): Promise<{ resumeInfo: ResumeInfo | null; error?: string }> {
  if (!USE_ML_BACKEND) {
    return { 
      error: 'ML backend is not enabled',
      resumeInfo: null 
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/api/extract-resume-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || 'Failed to extract resume information',
        resumeInfo: null
      };
    }
    
    const data = await response.json();
    return { resumeInfo: data.resumeInfo };
  } catch (error) {
    console.error('Resume extraction error:', error);
    return { 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      resumeInfo: null 
    };
  }
}

/**
 * Analyze job description using the ML backend
 */
export async function analyzeJobML(
  jobDescription: string,
  resumeInfo: ResumeInfo
): Promise<{ jobAnalysis: JobAnalysis | null; error?: string }> {
  if (!USE_ML_BACKEND) {
    return { 
      error: 'ML backend is not enabled',
      jobAnalysis: null 
    };
  }
  
  try {
    const response = await fetch(`${API_URL}/api/analyze-job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        jobDescription,
        resumeInfo
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || 'Failed to analyze job description',
        jobAnalysis: null
      };
    }
    
    const data = await response.json();
    return { jobAnalysis: data.jobAnalysis };
  } catch (error) {
    console.error('Job analysis error:', error);
    return { 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      jobAnalysis: null 
    };
  }
} 