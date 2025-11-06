import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { supabaseService } from "~/services";
import { Cause, Exit } from "effect";
import { isBaseHttpError } from "~/exceptions/base.exceptions";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType;
  const next = searchParams.get("next") ?? "/";

  const url = request.nextUrl.clone();
  url.pathname = "/auth/confirm-email";

  if (!token_hash || !type) {
    url.searchParams.set(
      "error",
      "Invalid verify email inputs. Missing required parameters: token_hash, type"
    );

    return NextResponse.redirect(url);
  }

  const exit = await supabaseService.verifyEmail({ token_hash, type, next });

  if (Exit.isSuccess(exit)) {
    revalidatePath("/", "layout");

    url.pathname = next ?? "/";
  } else if (Exit.isFailure(exit)) {
    const cause = Cause.squash(exit.cause);
    if (isBaseHttpError(cause)) {
      url.searchParams.set("error", cause.message);
    } else {
      url.searchParams.set(
        "error",
        cause?.toString() ??
          "An unknown error occurred during email verification."
      );
    }
  }

  return NextResponse.redirect(url);
}
