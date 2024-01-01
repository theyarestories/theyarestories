import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

function getHomeLanguage(request: NextRequest): string {
  let preferredLanguage = "";

  const acceptLanguageHeader = request.headers.get("accept-language");
  if (acceptLanguageHeader) {
    preferredLanguage = acceptLanguageHeader.slice(0, 2); // country code
  }

  return preferredLanguage;
}

export function middleware(request: NextRequest) {
  let response = NextResponse.next();

  // Add query param "page" to all-stories page of non exists
  if (request.nextUrl.pathname.includes("all-stories")) {
    const pageParam = Number(request.nextUrl.searchParams.get("page"));
    if (isNaN(pageParam) || pageParam < 1) {
      response = NextResponse.redirect(
        new URL(`${request.nextUrl.pathname}?page=1`, request.url)
      );
    }
  }

  // get preferred language to pass it to frontend to customize the experience
  const homeLanguage = getHomeLanguage(request);
  response.cookies.set("home_language", homeLanguage);

  return response;
}
