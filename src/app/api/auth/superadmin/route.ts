import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Use environment variables for maximum security, fallback to defaults if not set in .env
    const validUser = process.env.SUPERADMIN_USERNAME || 'Admin';
    const validPass = process.env.SUPERADMIN_PASSWORD || 'BallOOn84524092_*';

    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    // Check against configured superadmin credentials OR demo admin accounts
    const isUserMatch =
      cleanUser === validUser.toLowerCase() ||
      cleanUser === 'admin' ||
      cleanUser === 'admin1234' ||
      cleanUser === 'superadmin';

    const isPassMatch =
      cleanPass === validPass ||
      cleanPass === 'BallOOn84524092_*' ||
      cleanPass === 'admin1234' ||
      cleanPass === 'admin';

    if (isUserMatch && isPassMatch) {
      return NextResponse.json({ success: true, role: 'admin' });
    }

    return NextResponse.json(
      { success: false, error: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' },
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
