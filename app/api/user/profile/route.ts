import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to update your profile" },
        { status: 401 }
      )
    }

    const { name, email, phone, address, bio } = await req.json()

    // Connect to MongoDB
    const { db } = await connectToDatabase()
    
    // Update user in database
    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          name,
          phone,
          address,
          bio,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
} 