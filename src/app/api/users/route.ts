import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth0 } from '@/lib/auth0';

// HELPER: To verify if the requester is an ADMIN
async function verifyAdmin() {
  if (!auth0) return false;
  const session = await auth0.getSession();
  if (!session || !session.user || !session.user.email) return false;

  await dbConnect();
  const user = await User.findOne({ email: session.user.email.toLowerCase() });
  
  // Also check if they are in the "Bootstrap" list from .env
  const bootstrapAdmins = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
  
  return user?.role === 'ADMIN' || bootstrapAdmins.includes(session.user.email.toLowerCase());
}

export async function GET() {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const users = await User.find({}).sort({ addedAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, role, name, bootstrap } = await request.json();
    
    await dbConnect();
    const userCount = await User.countDocuments();
    
    // If the DB is empty, the first person can claim ADMIN status
    if (userCount === 0 && bootstrap === true) {
      const firstUser = await User.create({ email: email.toLowerCase(), role: 'ADMIN', name });
      return NextResponse.json(firstUser);
    }

    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    // UPSERT: Create or update
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role, name },
      { upsert: true, new: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to manage user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { email } = await request.json();
    await dbConnect();
    await User.deleteOne({ email: email.toLowerCase() });

    return NextResponse.json({ message: 'User removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove user' }, { status: 500 });
  }
}
