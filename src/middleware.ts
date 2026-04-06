import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  // If Auth0 isn't initialized, just pass through
  if (!auth0) {
    return NextResponse.next();
  }

  // Use Auth0 SDK middleware for session handling
  return await auth0.middleware(request);
}

export const config = {
  matcher: ["/auth/:path*"],
};
