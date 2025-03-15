import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { connectToDatabase } from "@/lib/mongodb"

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const { db } = await connectToDatabase()

  // Get all cover letters
  const coverLetters = await db
    .collection("coverLetters")
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={session.user} />

      <main className="flex-1 container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Cover Letter History</h1>

          <Link href="/dashboard/generate">
            <Button>
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
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Create New
            </Button>
          </Link>
        </div>

        {coverLetters.length > 0 ? (
          <div className="space-y-4">
            {coverLetters.map((letter) => (
              <div key={letter._id.toString()} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{letter.companyName}</h3>
                    <p className="text-sm text-muted-foreground">{letter.jobTitle}</p>
                    <div className="flex space-x-4 text-xs text-muted-foreground mt-1">
                      <p>Created: {new Date(letter.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(letter.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/cover-letter/${letter._id.toString()}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/cover-letter/${letter._id.toString()}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/dashboard/cover-letter/${letter._id.toString()}/edit`}>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        Delete
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No cover letters yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't created any cover letters yet. Get started by creating your first one.
            </p>
            <Link href="/dashboard/generate">
              <Button>Create Your First Cover Letter</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

