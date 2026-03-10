import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_COOKIE = "admin";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const cookie = request.cookies.get(ADMIN_COOKIE);
    if (!cookie || cookie.value !== "1") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
