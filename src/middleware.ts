import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const client = auth0;
  if (client) {
    return await client.middleware(request);
  }
}

export const config = {
  matcher: ["/auth/:path*"],
};