import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);

  const url = request.nextUrl.clone();
  
  // Intercept Supabase Auth redirect to root if it has a code (usually from email)
  if (url.pathname === '/' && url.searchParams.has('code')) {
    const code = url.searchParams.get('code');
    // We assume if they land on root with a code, it's likely a password reset or magic link
    // We'll redirect to the callback with next=/reset-password just to be safe.
    url.pathname = '/api/auth/callback';
    url.searchParams.set('next', '/reset-password');
    return NextResponse.redirect(url);
  }
  
  // Protect specific routes
  const isProtectedRoute = 
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/vault') ||
    url.pathname.startsWith('/settings') ||
    url.pathname.startsWith('/profile') ||
    url.pathname.startsWith('/api/private');

  if (!user && isProtectedRoute) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Check MFA (AAL2) requirement for protected routes
  if (user && isProtectedRoute) {
    const { data: aal, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (!aalError && aal) {
      if (aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
        url.pathname = '/mfa-verify';
        url.searchParams.set('next', request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  // Redirect auth pages to dashboard if already logged in
  if (user && (
    url.pathname === '/login' ||
    url.pathname === '/register' ||
    url.pathname === '/forgot-password' ||
    url.pathname === '/verify-email' ||
    url.pathname === '/check-email'
  )) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
