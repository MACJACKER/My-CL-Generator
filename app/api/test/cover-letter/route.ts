import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Mock function to simulate LLM processing of resume text
function extractResumeInfo(resumeText: string) {
  // In a real implementation, this would use an LLM to extract information
  // For now, we'll return mock data
  return {
    name: "Abhinav Borad",
    email: "abhinavborad7@gmail.com",
    phone: "+1 (123) 456-7890",
    address: "123 Main St, City, State",
    skills: ["Data Analysis", "Python", "SQL", "Machine Learning", "Visualization"],
    experience: "5 years of experience in data analysis and visualization",
    education: "Bachelor's in Computer Science",
    achievements: [
      "Developed and implemented data analysis pipelines that increased efficiency by 30%",
      "Created interactive dashboards that improved decision-making processes for executive teams",
      "Collaborated with cross-functional teams to deliver data-driven solutions for complex business problems"
    ]
  };
}

// Mock function to generate a cover letter using resume data and job details
function generateTestCoverLetter(resumeInfo: any, jobDetails: any) {
  const { name, email, phone, skills, experience } = resumeInfo;
  const { companyName, jobTitle, jobDescription, specialInstructions } = jobDetails;
  
  // Handle special instructions
  let specialInstructionsText = "";
  if (specialInstructions && specialInstructions.toLowerCase() !== "none" && specialInstructions.trim() !== "") {
    specialInstructionsText = `\nAdditionally, ${specialInstructions}\n`;
  }
  
  return `
${name}
${email} | ${phone}
${new Date().toLocaleDateString()}

Hiring Manager
${companyName}
[Company Address]

Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle} position listed at ${companyName}. With a robust background in ${skills.slice(0, 3).join(", ")} and ${experience}, I am excited about the opportunity to contribute to your team.

Throughout my career, I have demonstrated a keen ability to analyze complex data sets, develop insightful visualizations, and communicate findings to stakeholders. My experience has honed my skills in ${skills.join(", ")}, making me well-suited for the ${jobTitle} role at ${companyName}.

I am particularly impressed by ${companyName}'s commitment to innovation and excellence in the industry. My background in ${skills[0]} positions me uniquely to contribute to your projects, and I am eager to bring my expertise in this area to your esteemed company.
${specialInstructionsText}
I am looking forward to the opportunity to discuss how my background, skills, and enthusiasms align with the goals of ${companyName}. I am available at your convenience for an interview and can be reached directly at ${phone} or ${email}.

Thank you for considering my application. I am excited about the possibility of contributing to ${companyName} and am very interested in discussing the ways in which I can assist in fulfilling the visionary goals of your team.

Warmest regards,

${name}
  `.trim();
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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

    const { companyName, jobTitle, jobDescription, specialInstructions } = requestData;

    // Validate input
    if (!companyName || !jobTitle) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Get user's resume data from database
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user has a resume
    const hasResume = !!user.resumeUrl;
    const resumeText = user.resumeText || `Content of ${user.resumeFilename || "resume"}`;
    
    // Extract resume information
    const resumeInfo = extractResumeInfo(resumeText);
    
    // Generate test cover letter
    const coverLetter = generateTestCoverLetter(
      resumeInfo,
      {
        companyName,
        jobTitle,
        jobDescription,
        specialInstructions
      }
    );

    // Return test data
    return NextResponse.json({
      message: "Test cover letter generated successfully",
      user: {
        id: session.user.id,
        email: user.email,
        name: user.name,
        hasResume: hasResume,
        resumeUrl: user.resumeUrl,
        resumeFilename: user.resumeFilename,
        resumeUploadedAt: user.resumeUploadedAt,
      },
      resumeInfo: resumeInfo,
      coverLetter: coverLetter,
      testData: {
        companyName,
        jobTitle,
        jobDescription,
        specialInstructions
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Test cover letter error:", error);
    return NextResponse.json({ 
      message: "Something went wrong", 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 