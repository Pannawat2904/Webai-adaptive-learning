import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Use environment variables for maximum security, fallback to defaults if not set in .env
    const validUser = process.env.SUPERADMIN_USERNAME || 'Admin';
    const validPass = process.env.SUPERADMIN_PASSWORD || 'BallOOn84524092_*';

    // The credentials are checked securely on the server-side
    // This code is NEVER sent to the browser
    if (username === validUser && password === validPass) {
      return NextResponse.json({ success: true, role: 'admin' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid super admin credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Superadmin auth error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
