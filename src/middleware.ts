import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/auth/callback'];
const ONBOARDING_ROUTE = '/onboarding';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Allow public routes
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    // Redirect logged-in users away from /login
    if (user && pathname === '/login') {
      return NextResponse.redirect(new URL('/feed', request.url));
    }
    return supabaseResponse;
  }

  // Not authenticated → redirect to login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check if user has a profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('type')
    .eq('user_id', user.id)
    .single();

  // No profile → go to onboarding (unless already there)
  if (!profile && pathname !== ONBOARDING_ROUTE) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // Has profile → don't let them go back to onboarding
  if (profile && pathname === ONBOARDING_ROUTE) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  // Admin guard
  if (pathname.startsWith('/admin') && profile?.type !== 'admin') {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
