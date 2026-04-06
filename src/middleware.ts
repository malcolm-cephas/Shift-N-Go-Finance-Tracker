import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  if (auth0) {
    return await (auth0 as NonNullable<typeof auth0>).middleware(request);
  }
}

export const config = {
  matcher: ["/auth/:path*"],
};