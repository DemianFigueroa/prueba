import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { serialize } from 'cookie';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET missing');
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Encode secret for Edge compatibility
    const secret = new TextEncoder().encode(jwtSecret);

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, passwordHash: true }
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Create JWT using jose
    const token = await new SignJWT({ sub: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);

    const cookie = serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 3600,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'production' ? 'your-production-domain.com' : undefined,
    });

    return NextResponse.json(
      { message: 'ok' },
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
          'Access-Control-Allow-Origin': req.headers.get('origin') || '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
