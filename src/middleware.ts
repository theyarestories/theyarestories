import { NextRequest, NextResponse } from "next/server";
import { ServerApiResponse } from "./interfaces/server/ServerApiResponse";
import { DBUser } from "./interfaces/database/DBUser";

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

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  // 1. Check if token exists
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return false;
  }

  // 2. Check if token is valid
  try {
    const userByTokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/me`,
      { headers: { Cookie: `token=${token}` } }
    );
    const data: ServerApiResponse<DBUser> = await userByTokenResponse.json();
    if (data.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}

function getHomeLanguage(request: NextRequest): string {
  let preferredLanguage = "";

  const acceptLanguageHeader = request.headers.get("accept-language");
  if (acceptLanguageHeader) {
    preferredLanguage = acceptLanguageHeader.slice(0, 2); // country code
  }

  return preferredLanguage;
}

export async function middleware(request: NextRequest) {
  await isAuthenticated(request);
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

  // Allow access to admin pages only to authenticated users

  return response;
}
