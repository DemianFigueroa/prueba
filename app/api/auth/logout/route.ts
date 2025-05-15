import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const cookie = serialize('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0, // Set to 0 to expire immediately
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return NextResponse.json(
    { message: 'Logged out' },
    {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
      },
    }
  );
}
