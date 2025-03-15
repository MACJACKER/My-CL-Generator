import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ message: "Content is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Verify ownership
    const coverLetter = await db.collection("coverLetters").findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id,
    })

    if (!coverLetter) {
      return NextResponse.json({ message: "Cover letter not found" }, { status: 404 })
    }

    // Update cover letter
    await db.collection("coverLetters").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          content,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Cover letter updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Cover letter update error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    // Verify ownership
    const coverLetter = await db.collection("coverLetters").findOne({
      _id: new ObjectId(params.id),
      userId: session.user.id,
    })

    if (!coverLetter) {
      return NextResponse.json({ message: "Cover letter not found" }, { status: 404 })
    }

    return NextResponse.json(coverLetter, { status: 200 })
  } catch (error) {
    console.error("Cover letter fetch error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const id = await params.id

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

    // Delete the cover letter
    await db.collection("coverLetters").deleteOne({
      _id: new ObjectId(id),
      userId: session.user.id,
    })

    return NextResponse.json({ message: "Cover letter deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Cover letter deletion error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

