import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

// Encode the JWT secret for Edge compatibility
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/login',
  '/api/signup'
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip middleware for public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    // Get the token from cookies
    const token = req.cookies.get('token')?.value;

    if (!token) {
      throw new Error('No token found');
    }

    // Verify the JWT using jose
    await jwtVerify(token, JWT_SECRET);

    // If valid, continue to the requested page
    return NextResponse.next();
  } catch (error) {
    // Redirect to login page if authentication fails
    const loginUrl = new URL('/api/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    // Match all paths except public ones and static files
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|signup).*)'
  ],
};
