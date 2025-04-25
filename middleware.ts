// middleware.ts This file is used to protect routes in a Next.js application using Clerk for authentication. It defines which routes are public and which should be protected, and applies middleware accordingly.

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes are public and should not be protected
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing",
]);

export default clerkMiddleware(async (auth, req): Promise<void> => {
  // Protect all routes except the public ones
  if (!isPublicRoute(req)) {
    await auth.protect(); // Protect the route if it's not public
  }
});

// Config to match routes for middleware application
export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always apply middleware for API routes
    "/(api|trpc)(.*)",
  ],
};
