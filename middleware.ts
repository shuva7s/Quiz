import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import { Session } from "./lib/auth";

const publicRoutes: string[] = [];
const publicApiRoutes: string[] = ["/api/auth", "/api/quiz/generate"];
const authRoutes = ["/sign-in", "/sign-up"];
const passwordRoutes: string[] = [];

const adminRoutePatterns = [
  /^\/create$/,
  /^\/quiz\/[^\/]+\/edit$/,
  /^\/quiz\/[^\/]+\/participants$/,
];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  // console.log("Middleware", pathName);
  const isPublicRoute = publicRoutes.includes(pathName);
  const isPublicApiRoute = publicApiRoutes.find((route) =>
    pathName.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);

  const isAdminRoute = adminRoutePatterns.some((pattern) =>
    pattern.test(pathName)
  );

  if (isPublicRoute || isPasswordRoute || isPublicApiRoute) {
    return NextResponse.next();
  }

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (!session) {
    if (isAuthRoute || isPasswordRoute || isPublicApiRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute || isPasswordRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAdminRoute && session.user.role === "user") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
