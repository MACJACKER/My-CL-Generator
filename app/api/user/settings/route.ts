import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "You must be logged in to update settings" },
        { status: 401 }
      )
    }

    const { defaultTemplate, emailNotifications, darkMode, autoSave } = await req.json()

    // Connect to MongoDB
    const { db } = await connectToDatabase()
    
    // Update user settings in database
    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          settings: {
            defaultTemplate,
            emailNotifications,
            darkMode,
            autoSave
          },
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
      { message: "Settings updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
} 