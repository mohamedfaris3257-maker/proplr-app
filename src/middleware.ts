import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = [
  '/login', '/auth/callback', '/register',
  '/api/newsletter', '/api/register',
];

// Marketing pages accessible without auth
const PUBLIC_PREFIXES = [
  '/', '/about', '/programs', '/foundation', '/impact',
  '/blog', '/showcase', '/summer-camp', '/partners',
  '/mentorship', '/faq', '/careers', '/pricing', '/compass',
  '/start-a-club',
  '/admin',  // Admin routes are public for now (no auth protection)
];
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

  // Allow public routes and marketing pages
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isPublicPrefix = PUBLIC_PREFIXES.some((p) =>
    p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(p + '/')
  );

  if (isPublicRoute || isPublicPrefix) {
    // Redirect logged-in users away from /login and /register → /dashboard
    if (user && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
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
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
