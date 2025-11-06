"use client";

import { useSearchParams } from "next/navigation";
import { Spinner } from "~/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const error = searchParams.get("error");

  // Show error state if error param exists or email is missing
  const hasError = !!error || !email;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          {hasError ? (
            <div className="space-y-4">
              <CardTitle className="text-sm pb-1">
                Verification Error
              </CardTitle>
              <CardDescription className="space-y-2">
                {error ? (
                  <p>{error}</p>
                ) : (
                  <p>
                    Something unexpected happened and the email is not present.
                  </p>
                )}
                <p>Try verifying your email again or sign up again.</p>
              </CardDescription>
            </div>
          ) : (
            <>
              <div>
                <CardTitle className="text-sm pb-1">Check your inbox</CardTitle>
                <CardDescription>
                  We sent a confirmation link to{" "}
                  <span className="font-medium text-neutral-100">{email}</span>.
                  <br />
                  Please click the link to verify the email ownership and activate
                  your account.
                </CardDescription>
              </div>
              <div className="text-center space-y-2 py-4">
                <AwaitingVerification />
                <p className="text-xs text-muted-foreground">
                  This page will automatically update once verified.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

const AwaitingVerification = () => {
  return (
    <p className="font-medium flex items-center justify-center gap-2 text-lg">
      <Spinner className="size-4 text-neutral-400" />
      <span
        className="inline-block bg-clip-text text-transparent bg-[length:200%_100%]"
        style={{
          backgroundImage:
            "linear-gradient(110deg, #a3a3a3 30%, #fafafa 50%, #a3a3a3 70%)",
          animation: "shimmer 3.5s linear infinite",
        }}
      >
        Awaiting verification...
      </span>
    </p>
  );
};
