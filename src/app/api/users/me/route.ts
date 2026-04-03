import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  try {
    if (!auth0) return NextResponse.json({ role: 'UNAUTHORIZED' });
    const session = await auth0.getSession();
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ role: 'UNAUTHORIZED' });
    }

    const email = session.user.email.toLowerCase();

    await dbConnect();
    const userCount = await User.countDocuments();
    const dbUser = await User.findOne({ email });

    // BOOTSTRAP MODE: If no users exist, allow the user to see a "Claim" button
    if (userCount === 0 && session.user) {
      return NextResponse.json({ role: 'UNAUTHORIZED', canClaim: true, email });
    }
    
    if (dbUser) {
      return NextResponse.json({ role: dbUser.role, email, name: dbUser.name });
    }

    return NextResponse.json({ role: 'UNAUTHORIZED', email, canClaim: false });
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json({ role: 'UNAUTHORIZED' }, { status: 500 });
  }
}
