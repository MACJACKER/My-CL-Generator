"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Basic validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      console.log("Attempting to register:", { name, email })
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      console.log("Registration successful, attempting to sign in")
      
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        console.error("Sign in after registration failed:", result.error)
        throw new Error("Registration successful but sign in failed. Please try logging in.")
      }

      router.refresh()
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || "Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2 border-blue-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-2xl text-blue-800">Sign Up</CardTitle>
        <CardDescription>Enter your details to create your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Name</Label>
            <Input 
              id="name" 
              name="name" 
              required 
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              minLength={6}
              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
              {error}
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

