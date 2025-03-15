import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Check if user exists in database
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if user has a resume
    if (!user.resumeUrl) {
      return NextResponse.json({ 
        message: "No resume found for this user",
        user: {
          id: userId,
          email: user.email,
          name: user.name,
        }
      }, { status: 404 });
    }

    // Check if the resume file exists
    const resumePath = path.join(process.cwd(), 'public', user.resumeUrl);
    let fileExists = false;
    
    try {
      await fs.access(resumePath);
      fileExists = true;
    } catch (error) {
      console.error('Resume file not found:', resumePath);
    }

    // Return the user's resume information
    return NextResponse.json({
      message: "Resume found",
      resume: {
        url: user.resumeUrl,
        filename: user.resumeFilename,
        uploadedAt: user.resumeUploadedAt,
        fileExists: fileExists,
        accessUrl: `/api/static${user.resumeUrl.replace('/uploads', '')}`,
      },
      user: {
        id: userId,
        email: user.email,
        name: user.name,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Resume test error:", error);
    return NextResponse.json({ 
      message: "Something went wrong", 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 