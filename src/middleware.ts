import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Get allowed subdomains from environment variable or use defaults
  const allowedSubdomains = (process.env.ADMIN_SUBDOMAINS || 'cms,admin,back,portal').split(',');
  
  // Check if the current hostname starts with any of the allowed subdomains
  const isAdminSubdomain = allowedSubdomains.some(sub => hostname.startsWith(`${sub}.`));

  if (isAdminSubdomain) {
    // If accessing the root of the subdomain, rewrite to /admin/leads
    if (url.pathname === '/') {
      return NextResponse.rewrite(new URL('/admin/leads', request.url));
    }
    
    // Rewrite all other paths under the subdomain to prepend /admin
    // (e.g., cms.leads.com/login -> /admin/login)
    if (!url.pathname.startsWith('/admin')) {
      return NextResponse.rewrite(new URL(`/admin${url.pathname}`, request.url));
    }
  } else {
    // Optional: Block direct access to /admin on the main domain
    if (url.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all routes except static files and APIs
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
