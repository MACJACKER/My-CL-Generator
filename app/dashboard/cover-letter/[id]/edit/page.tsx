import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import CoverLetterEditForm from "@/components/cover-letter-edit-form"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function CoverLetterEditPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const id = await params.id

  if (!session) {
    redirect("/login")
  }

  const { db } = await connectToDatabase()

  // Get cover letter
  const coverLetter = await db.collection("coverLetters").findOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  })

  if (!coverLetter) {
    redirect("/dashboard?error=Cover letter not found")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={session.user} />

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Cover Letter</h1>

        <div className="max-w-3xl mx-auto">
          <CoverLetterEditForm coverLetter={coverLetter} />
        </div>
      </main>
    </div>
  )
}

