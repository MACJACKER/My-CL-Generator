import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function CoverLetterPage({ params }: { params: { id: string } }) {
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{coverLetter.companyName}</h1>
            <p className="text-muted-foreground">{coverLetter.jobTitle}</p>
          </div>

          <div className="flex space-x-4">
            <Link href={`/dashboard/cover-letter/${id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Link href={`/api/cover-letter/${id}/pdf`} target="_blank">
              <Button>Download PDF</Button>
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg border shadow-sm">
          <div className="font-serif whitespace-pre-wrap">{coverLetter.content}</div>
        </div>
        
        <div className="max-w-3xl mx-auto mt-8 flex justify-end">
          <Link href={`/dashboard/cover-letter/${id}/edit`}>
            <Button variant="outline" size="sm">
              Edit Cover Letter
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

