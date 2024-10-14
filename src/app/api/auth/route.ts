import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const users = [
  { id: 1, email: 'ahmad@example.com', password: 'ahmadpass', role: 'admin' },
  { id: 2, email: 'maryam@example.com', password: 'maryampass', role: 'user' },
  { id: 3, email: 'shahin@example.com', password: 'shahinpass', role: 'user' },
];

const JWT_SECRET = 'your_secret_key'; 

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = users.find((user) => user.email === email && user.password === password);

  if (user) {
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '1h', 
    });

    return NextResponse.json({ token });
  } else {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
}

export async function GET() {
  return NextResponse.json({ users });
}