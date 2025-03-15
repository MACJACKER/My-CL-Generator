import { DefaultSession } from "next-auth"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    phone?: string | null
    address?: string | null
    bio?: string | null
    settings?: {
      defaultTemplate?: string
      emailNotifications?: boolean
      darkMode?: boolean
      autoSave?: boolean
    }
  }

  interface Session {
    user: User
  }
} 