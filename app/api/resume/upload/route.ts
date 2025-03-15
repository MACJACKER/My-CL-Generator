import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { writeFile } from "fs/promises"
import path from "path"
import { mkdir } from "fs/promises"

// Function to store the file in the uploads directory
async function storeFile(file: File, userId: string): Promise<{ filePath: string, fileUrl: string }> {
  // Create a unique filename
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  const uniqueId = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  
  const fileName = `resume_${uniqueId}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })
  
  // Create user directory if it doesn't exist
  const userDir = path.join(uploadsDir, userId)
  await mkdir(userDir, { recursive: true })
  
  // Save the file
  const filePath = path.join(userDir, fileName)
  const fileBuffer = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(fileBuffer))
  
  // Return the file path and URL
  const fileUrl = `/uploads/${userId}/${fileName}`
  return { filePath, fileUrl }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const resumeFile = formData.get("resume") as File | null
    const userId = session.user.id

    if (!resumeFile) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 })
    }

    console.log("Resume upload request:", {
      userId,
      fileName: resumeFile.name,
      fileSize: resumeFile.size,
      fileType: resumeFile.type
    })

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ]
    
    // Some browsers might not provide the correct MIME type, so we also check the file extension
    const fileExtension = resumeFile.name.split('.').pop()?.toLowerCase()
    const allowedExtensions = ['pdf', 'docx', 'doc']
    
    if (!allowedTypes.includes(resumeFile.type) && !allowedExtensions.includes(fileExtension || '')) {
      return NextResponse.json({ 
        message: "Invalid file type. Please upload a PDF or Word document.",
        details: { fileType: resumeFile.type, extension: fileExtension }
      }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (resumeFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        message: "File too large. Maximum size is 5MB.",
        details: { fileSize: resumeFile.size }
      }, { status: 400 })
    }

    // Store file
    const { filePath, fileUrl } = await storeFile(resumeFile, userId)
    console.log("File stored successfully:", { filePath, fileUrl })

    // Extract text from resume (in a real app, you would use a library like pdf-parse or mammoth)
    // For now, we'll just use the filename as a placeholder
    const resumeText = `Content of ${resumeFile.name}`

    // Update user record in database
    const { db } = await connectToDatabase()
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          resumeUrl: fileUrl,
          resumeFilename: resumeFile.name,
          resumeUploadedAt: new Date(),
          resumeText: resumeText,
        },
      },
    )

    return NextResponse.json({ 
      message: "Resume uploaded successfully", 
      url: fileUrl,
      filename: resumeFile.name
    }, { status: 200 })
  } catch (error: any) {
    console.error("Resume upload error:", error)
    return NextResponse.json({ 
      message: "Something went wrong", 
      error: error.message 
    }, { status: 500 })
  }
}

