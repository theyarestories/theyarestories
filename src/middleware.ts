import { NextRequest, NextResponse } from "next/server";
import { ServerApiResponse } from "./interfaces/server/ServerApiResponse";
import { DBUser } from "./interfaces/database/DBUser";
import isStringPositiveInteger from "./helpers/number/isStringPositiveInteger";

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

async function getUser(req: NextRequest): Promise<DBUser | null> {
  // 1. Check if token exists
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return null;
  }

  // 2. Check if token is valid
  try {
    const userByTokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/me`,
      { headers: { Cookie: `token=${token}` } }
    );
    const data: ServerApiResponse<DBUser> = await userByTokenResponse.json();
    return data.data || null;
  } catch (error) {
    return null;
  }
}

async function isAdmin(user: DBUser): Promise<boolean> {
  return ["admin", "publisher"].some((role) => user.role === role);
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
  let response = NextResponse.next();
  const user = await getUser(request);
  const page = request.nextUrl.pathname.slice(1);

  switch (page) {
    // add query param "page" to all-stories page of non exists
    case "all-stories": {
      const pageParam = request.nextUrl.searchParams.get("page");
      if (!pageParam || !isStringPositiveInteger(pageParam)) {
        response = NextResponse.redirect(
          new URL(`${request.nextUrl.pathname}?page=1`, request.url)
        );
      }
      break;
    }

    // limit allow access to admin pages
    case "admin": {
      if (!user) {
        response = NextResponse.redirect(new URL(`/signin`, request.url));
      } else if (!isAdmin(user)) {
        response = NextResponse.redirect(new URL(`/`, request.url));
      }
      break;
    }

    // Redirect signed in users to home page
    case "signin": {
    }

    case "signup": {
      if (user) {
        response = NextResponse.redirect(new URL(`/`, request.url));
      }
      break;
    }
  }

  // get preferred language to pass it to frontend to customize the experience
  const homeLanguage = getHomeLanguage(request);
  response.cookies.set("home_language", homeLanguage);

  return response;
}
