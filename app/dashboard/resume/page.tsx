import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import DashboardHeader from "@/components/dashboard-header"
import ResumeUploadForm from "@/components/resume-upload-form"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export default async function ResumePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  let resumeData = null;
  let error = null;

  try {
    const { db } = await connectToDatabase()

    // Get user's resume if it exists
    const user = await db.collection("users").findOne({
      _id: new ObjectId(session.user.id),
    })

    if (user?.resumeUrl) {
      resumeData = {
        url: user.resumeUrl,
        filename: user.resumeFilename || "Resume",
        uploadedAt: user.resumeUploadedAt || new Date(),
      }
    }
  } catch (err) {
    console.error("Error fetching resume data:", err)
    error = "Failed to load resume data. Please try again later."
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      <DashboardHeader user={session.user} />

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-800">Resume Management</h1>

        {error && (
          <div className="max-w-2xl mx-auto mb-6 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
            <div className="font-semibold">Error</div>
            <div>{error}</div>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <ResumeUploadForm existingResume={resumeData} />
        </div>

        <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-lg border-2 border-blue-100 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-800">Resume Tips</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Keep your resume concise and focused on relevant experience.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Use bullet points to highlight achievements and responsibilities.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Quantify your achievements with numbers when possible.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Tailor your resume to each job application for better results.</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

