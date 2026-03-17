import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Admin — always allow, no protection
  if (pathname.startsWith('/admin')) {
    return supabaseResponse;
  }

  // Dashboard — must be logged in AND have completed onboarding
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user has completed onboarding (has a profile with school_name)
    const { data: profile } = await supabase
      .from('profiles')
      .select('school_name')
      .eq('user_id', user.id)
      .single();

    if (!profile?.school_name) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    return supabaseResponse;
  }

  // Onboarding — must be logged in; if already has profile, go to dashboard
  if (pathname === '/onboarding') {
    if (!user) {
      return NextResponse.redirect(new URL('/enroll', request.url));
    }

    // If user already completed onboarding, send to dashboard
    const { data: profile } = await supabase
      .from('profiles')
      .select('school_name')
      .eq('user_id', user.id)
      .single();

    if (profile?.school_name) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return supabaseResponse;
  }

  // Auth pages — redirect to dashboard if already logged in
  if (pathname === '/login' || pathname === '/register') {
    if (user) {
      // Check if user needs onboarding first
      const { data: profile } = await supabase
        .from('profiles')
        .select('school_name')
        .eq('user_id', user.id)
        .single();

      if (!profile?.school_name) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register', '/onboarding'],
};
