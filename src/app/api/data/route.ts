import { NextResponse, NextRequest } from "next/server";
import { auth0, isAuth0Configured } from "@/lib/auth0";
import { deleteUserCloudData, getUserCloudData, saveUserCloudData } from "@/lib/mongo";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import { hasPermission } from "@/lib/roles";

export const runtime = 'nodejs';

async function getAuthorizedUser(session: any) {
  if (!session || !session.user || !session.user.email) return null;
  await dbConnect();
  return await User.findOne({ email: session.user.email.toLowerCase() });
}

// GET data

export async function GET() {

  if (!isAuth0Configured || !auth0 || !process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'Cloud sync unavailable: Auth0 or database not configured' },
      { status: 503 }
    );
  }

  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const dbUser = await getAuthorizedUser(session);
  if (!dbUser || !hasPermission(dbUser.role, 'READ')) {
    return NextResponse.json({ error: 'Access denied: Insufficient clearance' }, { status: 403 });
  }

  const userId = session.user.sub;
  const userData = await getUserCloudData(userId);

  return NextResponse.json(userData);
}

// POST data

export async function POST(request: NextRequest) {

  if (!isAuth0Configured || !auth0 || !process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'Cloud sync unavailable: Auth0 or database not configured' },
      { status: 503 }
    );
  }

  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const dbUser = await getAuthorizedUser(session);
  if (!dbUser || !hasPermission(dbUser.role, 'UPDATE')) {
    return NextResponse.json({ error: 'Access denied: Insufficient clearance to modify records' }, { status: 403 });
  }

  const MAX_BODY_SIZE = 1e6; // 1 MB
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
    return NextResponse.json({ error: 'Payload too massive for security clearance' }, { status: 413 });
  }

  const body = await request.json();

  await saveUserCloudData(body.accounts, body.balances, body.transactions || [], body.inventory || []);

  return NextResponse.json(
    { message: 'Dealership data synchronized successfully' },
    { status: 200 }
  );
}

export async function DELETE() {

  if (!isAuth0Configured || !auth0 || !process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'Cloud sync unavailable: Auth0 or database not configured' },
      { status: 503 }
    );
  }

  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const dbUser = await getAuthorizedUser(session);
  if (!dbUser || !hasPermission(dbUser.role, 'DELETE')) {
    return NextResponse.json({ error: 'Access denied: Insufficient clearance to wipe records' }, { status: 403 });
  }

  await deleteUserCloudData();

  return NextResponse.json(
    { message: 'Dealership data wiped from cloud vault' },
    { status: 200 }
  );
}