import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';

import { locales } from './i18n';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Let intl middleware handle the routing first
  const intlResponse = intlMiddleware(request);

  // If intl middleware wants to redirect, return that
  if (intlResponse && intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  // Continue with auth logic for localized paths
  let response = NextResponse.next({
    request,
  });

  // Check if Supabase is properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === 'https://placeholder.supabase.co'
  ) {
    // If Supabase is not configured, just return the response without auth checks
    console.warn(
      '⚠️ Supabase not configured in middleware, skipping auth checks',
    );
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const locale = pathname.split('/')[1];
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    // Admin route protection
    if (pathWithoutLocale.startsWith('/admin')) {
      if (!user) {
        // No user, redirect to login
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/login`;
        url.searchParams.set('redirectedFrom', request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }

      // Optional: Add role-based access control here
      // Example: Check if user has admin role
      // const { data: profile } = await supabase
      //   .from('profiles')
      //   .select('role')
      //   .eq('id', user.id)
      //   .single();
      //
      // if (profile?.role !== 'admin') {
      //   return NextResponse.redirect(new URL('/', request.url));
      // }
    }

    // Auth routes - redirect if already logged in
    if (pathWithoutLocale.startsWith('/login') && user) {
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }
  } catch (error) {
    console.error('Middleware auth error:', error);
    // If there's an auth error, continue without auth checks
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object instead of the supabaseResponse object

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
