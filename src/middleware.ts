import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/dashboard',
  '/dashboard/explore',
  '/dashboard/mes-voyages',
  '/dashboard/mes-demandes',
  '/dashboard/messages',
  '/dashboard/notifications',
  '/dashboard/favoris',
  '/dashboard/profile',
  '/dashboard/settings',
];

const authRoutes = [
  '/auth/login',
  '/auth/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('bagage_token')?.value;
  const hasToken = !!token;

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard/explore';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};