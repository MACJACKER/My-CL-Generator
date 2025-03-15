import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white shadow-sm">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-blue-700">Cover Letter Generator</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-blue-600 to-indigo-700 text-white">
          <div className="container text-center space-y-6 relative z-10">
            <h2 className="text-4xl font-bold tracking-tight">Create Professional Cover Letters in Minutes</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Our AI-powered tool helps you generate personalized cover letters tailored to specific job descriptions
              and companies.
            </p>
            <Link href="/register">
              <Button size="lg" className="mt-6 bg-white text-blue-700 hover:bg-blue-50">
                Get Started
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-blue-100 bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-800">Upload Once</h3>
                <p className="text-gray-600">Upload your resume once and use it for multiple cover letters.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-blue-100 bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    <path d="M12 8v1" />
                    <path d="M12 15v1" />
                    <path d="M16 12h-1" />
                    <path d="M9 12H8" />
                    <path d="M15.7 9.7l-.7.7" />
                    <path d="M9.7 9.7l-.7-.7" />
                    <path d="M15.7 14.3l-.7-.7" />
                    <path d="M9.7 14.3l-.7.7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-800">AI-Powered</h3>
                <p className="text-gray-600">
                  Our NLP technology creates tailored cover letters based on job descriptions.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-blue-100 bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-blue-800">Easy Export</h3>
                <p className="text-gray-600">Download your cover letter as a PDF with a single click.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-gray-800 text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Cover Letter Generator</h3>
              <p className="text-gray-300">
                Create professional cover letters in minutes with our AI-powered tool.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-300 hover:text-white">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-300">
                Have questions? Email us at <a href="mailto:support@coverlettergen.com" className="text-blue-300 hover:underline">support@coverlettergen.com</a>
              </p>
            </div>
          </div>
          <div className="text-center text-sm text-gray-400 border-t border-gray-700 pt-8">
            &copy; {new Date().getFullYear()} Cover Letter Generator. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

