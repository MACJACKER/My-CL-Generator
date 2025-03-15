import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // Get user data
    const userId = session.user.id;
    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });
    
    // Get cover letters
    const coverLetters = await db.collection("coverLetters")
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    // Return debug data
    return NextResponse.json({
      message: "Debug data retrieved successfully",
      user: {
        id: userId,
        email: user?.email,
        name: user?.name,
        resumeUrl: user?.resumeUrl,
        resumeFilename: user?.resumeFilename,
        resumeUploadedAt: user?.resumeUploadedAt,
        resumeText: user?.resumeText,
      },
      coverLetters: coverLetters.map(cl => ({
        id: cl._id.toString(),
        companyName: cl.companyName,
        jobTitle: cl.jobTitle,
        createdAt: cl.createdAt,
        templateStyle: cl.templateStyle,
        contentPreview: cl.content?.substring(0, 100) + "...",
      })),
      session: session,
    }, { status: 200 });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ 
      message: "Something went wrong", 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 