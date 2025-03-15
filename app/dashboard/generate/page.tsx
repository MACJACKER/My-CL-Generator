import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import CoverLetterForm from "@/components/cover-letter-form"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function GeneratePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const { db } = await connectToDatabase()

  // Check if user has a resume
  const user = await db.collection("users").findOne({
    _id: new ObjectId(session.user.id),
  })

  if (!user?.resumeUrl) {
    redirect("/dashboard/resume?message=Please upload your resume first")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={session.user} />

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Generate Cover Letter</h1>

        <div className="max-w-3xl mx-auto">
          <CoverLetterForm resumeUrl={user.resumeUrl} />
        </div>
      </main>
    </div>
  )
}

