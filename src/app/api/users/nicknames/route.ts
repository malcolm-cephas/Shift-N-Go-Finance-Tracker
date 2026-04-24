import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { auth0 } from '@/lib/auth0';

export async function GET() {
  try {
    if (!auth0) {
        // If Auth0 is not configured, we still want to allow nickname retrieval in offline mode
        // But usually, in offline mode, we might not have a DB. 
        // Let's check session if possible.
    }
    
    const session = await auth0?.getSession();
    if (!session && process.env.AUTH0_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    // Only return email and name for privacy
    const users = await User.find(
      { role: { $in: ['ADMIN', 'MANAGER', 'INVESTOR'] } },
      'email name'
    );
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to fetch nicknames:', error);
    return NextResponse.json({ error: 'Failed to fetch nicknames' }, { status: 500 });
  }
}
