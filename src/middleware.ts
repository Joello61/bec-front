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

const adminRoutes = ['/admin'];

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

  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // ==================== REDIRECTION SI PAS AUTHENTIFIÉ ====================
  if (isProtectedRoute && !hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && !hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && hasToken) {
    // TODO: Décoder le JWT pour vérifier ROLE_ADMIN
    // Pour l'instant on laisse passer, le backend bloquera si pas admin
  }

  // ==================== REDIRECTION SI DÉJÀ CONNECTÉ ====================
  if (isAuthRoute && hasToken) {
    // Ne pas rediriger depuis verify-email ou complete-profile
    if (pathname === '/auth/verify-email' || pathname === '/auth/complete-profile') {
      return NextResponse.next();
    }
    
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