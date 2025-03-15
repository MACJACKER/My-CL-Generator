import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const { db } = await connectToDatabase()

  // Check if user has a resume
  const user = await db.collection("users").findOne({
    _id: new ObjectId(session.user.id),
  })

  const hasResume = user?.resumeUrl ? true : false

  // Get recent cover letters
  const recentCoverLetters = await db
    .collection("coverLetters")
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={session.user} />

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {!hasResume && (
          <div className="bg-muted p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-2">Upload Your Resume</h2>
            <p className="mb-4">Upload your resume to get started with generating cover letters.</p>
            <Link href="/dashboard/resume">
              <Button>Upload Resume</Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link href="/dashboard/generate">
                <Button className="w-full justify-start" size="lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M12 18v-6" />
                    <path d="M9 15h6" />
                  </svg>
                  Create New Cover Letter
                </Button>
              </Link>

              <Link href="/dashboard/resume">
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {hasResume ? "Update Resume" : "Upload Resume"}
                </Button>
              </Link>

              <Link href="/dashboard/history">
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  View History
                </Button>
              </Link>

              <Link href="/dashboard/ml-test">
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Test ML Backend
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Cover Letters</h2>
            {recentCoverLetters.length > 0 ? (
              <div className="space-y-4">
                {recentCoverLetters.map((letter) => (
                  <div key={letter._id.toString()} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{letter.companyName}</h3>
                        <p className="text-sm text-muted-foreground">{letter.jobTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(letter.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={`/dashboard/cover-letter/${letter._id.toString()}`}>
                        <Button variant="ghost" size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-4">You haven't created any cover letters yet.</p>
                <Link href="/dashboard/generate">
                  <Button>Create Your First Cover Letter</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

