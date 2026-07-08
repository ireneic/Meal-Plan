import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/subscribe(.*)",
  "/api/checkout(.*)",
  "/api/stripe-webhook(.*)",
  "/api/check-subscription(.*)",
]);

const isMealPlanRoute = createRouteMatcher(["/mealplan(.*)"]);
const isProfileRoute = createRouteMatcher(["/profile(.*)"]);
const isSignUpRoute = createRouteMatcher(["/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname, origin } = req.nextUrl;

  if (pathname === "/api/check-subscription") {
    return NextResponse.next();
  }

  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-up", origin));
  }

  if (isSignUpRoute(req) && userId) {
    return NextResponse.redirect(new URL("/mealplan", origin));
  }

  if ((isMealPlanRoute(req) || isProfileRoute(req)) && userId) {
    try {
      const checkSubRes = await fetch(
        `${origin}/api/check-subscription?userId=${userId}`,
        {
          method: "GET",
          headers: {
            cookie: req.headers.get("cookie") || "",
          },
        }
      );

      if (checkSubRes.ok) {
        const data = await checkSubRes.json();
        if (!data.subscriptionActive) {
          return NextResponse.redirect(new URL("/subscribe", origin));
        }
      } else {
        return NextResponse.redirect(new URL("/subscribe", origin));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/subscribe", origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};