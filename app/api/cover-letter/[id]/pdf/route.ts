import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Mock function to generate PDF
async function generatePDF(content: string): Promise<Buffer> {
  // This is a placeholder. In a real application, you would use a library like PDFKit
  const textEncoder = new TextEncoder();
  return Buffer.from(textEncoder.encode("PDF Content: " + content));
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const id = await params.id // Properly await the dynamic parameter

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Verify ownership
    const coverLetter = await db.collection("coverLetters").findOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    })

    if (!coverLetter) {
      return NextResponse.json({ message: "Cover letter not found" }, { status: 404 })
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(coverLetter.content)

    // Return PDF as stream
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cover-letter-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

