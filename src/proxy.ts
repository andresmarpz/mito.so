import { Effect } from "effect";
import { NextFetchEvent, NextResponse, type NextRequest } from "next/server";
import { effectRuntime } from "~/effect/live-runtime";
import { updateSession } from "~/utils/supabase/middleware";

export async function proxy(
  request: NextRequest,
  _event: NextFetchEvent
): Promise<NextResponse> {
  return effectRuntime.runPromise(
    Effect.gen(function* () {
      const response = yield* Effect.promise(() => updateSession(request));

      switch (request.nextUrl.pathname) {
        case "/auth/signin":
        case "/auth/signup":
          // Fetch user here, check if logged-in and redirect to home if so

          break;
        default:
          break;
      }

      return yield* Effect.succeed(response);
    })
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
