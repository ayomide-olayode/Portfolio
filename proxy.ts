import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all admin routes except login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // Check for Firebase auth token in cookie
    const authCookie = request.cookies.get('__session')

    if (!authCookie) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}