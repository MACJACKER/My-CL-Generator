import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow access to uploaded files in the public/uploads directory
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/uploads/:path*',
  ],
} 