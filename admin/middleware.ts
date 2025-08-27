import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic mobile detection via User-Agent
function isMobile(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return /android|iphone|ipad|ipod|iemobile|blackberry|bb10|mini|mobi|mobile|tablet|opera mini|opera mobi|fennec/.test(
    ua
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get('user-agent');

  // Allow the mobile-blocked page itself and Next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname === '/mobile-blocked'
  ) {
    return NextResponse.next();
  }

  if (isMobile(ua)) {
    const url = request.nextUrl.clone();
    url.pathname = '/mobile-blocked';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all pages
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
