import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { extractResumeInfo, analyzeJob, generateCoverLetter } from "@/lib/cover-letter-generator"
import { checkApiHealth, generateCoverLetterML, extractResumeInfoML, analyzeJobML } from "@/lib/api-client"

// Check if ML backend should be used
const USE_ML_BACKEND = process.env.NEXT_PUBLIC_USE_ML_BACKEND === 'true';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Parse JSON with error handling
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      console.error("JSON parsing error:", error);
      return NextResponse.json({ 
        message: "Invalid JSON in request body", 
        error: error instanceof Error ? error.message : String(error) 
      }, { status: 400 });
    }

    const { companyName, jobTitle, jobDescription, specialInstructions, resumeUrl, templateStyle } = requestData;

    // Validate input
    if (!companyName || !jobTitle || !jobDescription || !resumeUrl) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get user's resume data from database
    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id),
    })

    if (!user || !user.resumeUrl) {
      return NextResponse.json({ message: "No resume found for this user" }, { status: 400 })
    }

    // Use the resume text from the database, or a placeholder if not available
    const resumeText = user.resumeText || `Content of ${user.resumeFilename || "resume"}`;

    console.log("Generating cover letter with the following data:");
    console.log("- User ID:", session.user.id);
    console.log("- Resume URL:", resumeUrl);
    console.log("- Company:", companyName);
    console.log("- Job Title:", jobTitle);
    console.log("- Template Style:", templateStyle);
    console.log("- Special Instructions:", specialInstructions || "None");
    console.log("- Using ML Backend:", USE_ML_BACKEND);

    let coverLetter = "";
    let resumeInfo;
    let jobAnalysis;

    // Check if ML backend is available and should be used
    const isMLBackendAvailable = USE_ML_BACKEND && await checkApiHealth();
    
    if (isMLBackendAvailable) {
      console.log("Using ML backend for cover letter generation");
      
      // Try to use ML backend for the entire process
      try {
        const result = await generateCoverLetterML(
          resumeText,
          {
            companyName,
            jobTitle,
            jobDescription
          },
          specialInstructions,
          templateStyle || "professional"
        );
        
        if (result.error) {
          console.warn("ML backend error:", result.error);
          console.log("Falling back to local generation");
        } else {
          coverLetter = result.coverLetter;
        }
      } catch (error) {
        console.error("Error using ML backend:", error);
        console.log("Falling back to local generation");
      }
    }
    
    // If ML backend failed or is not available, use local generation
    if (!coverLetter) {
      console.log("Using local generation for cover letter");
      
      // Try to use ML backend for resume extraction if available
      if (isMLBackendAvailable) {
        const extractResult = await extractResumeInfoML(resumeText);
        if (!extractResult.error && extractResult.resumeInfo) {
          resumeInfo = extractResult.resumeInfo;
        } else {
          resumeInfo = await extractResumeInfo(resumeText, session.user);
        }
      } else {
        resumeInfo = await extractResumeInfo(resumeText, session.user);
      }
      
      console.log("Extracted resume info:", resumeInfo);
      
      // Try to use ML backend for job analysis if available
      if (isMLBackendAvailable && resumeInfo) {
        const analysisResult = await analyzeJobML(jobDescription, resumeInfo);
        if (!analysisResult.error && analysisResult.jobAnalysis) {
          jobAnalysis = analysisResult.jobAnalysis;
        } else {
          jobAnalysis = analyzeJob(jobDescription, resumeInfo);
        }
      } else {
        jobAnalysis = analyzeJob(jobDescription, resumeInfo);
      }
      
      console.log("Job analysis:", jobAnalysis);
      
      // Generate cover letter using local function
      coverLetter = generateCoverLetter(
        resumeInfo,
        {
          companyName,
          jobTitle,
          jobDescription
        },
        jobAnalysis,
        specialInstructions,
        templateStyle || "professional"
      );
    }

    // Save to database
    const result = await db.collection("coverLetters").insertOne({
      userId: session.user.id,
      companyName,
      jobTitle,
      jobDescription,
      specialInstructions,
      templateStyle: templateStyle || "professional",
      content: coverLetter,
      createdAt: new Date(),
      updatedAt: new Date(),
      generatedWithML: isMLBackendAvailable
    })

    return NextResponse.json(
      {
        message: "Cover letter generated successfully",
        coverLetter,
        id: result.insertedId.toString(),
        usedMLBackend: isMLBackendAvailable
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Cover letter generation error:", error)
    return NextResponse.json({ 
      message: "Something went wrong", 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
} 