"use cache";

import { Suspense } from "react";
import { signinAction } from "~/app/auth/signin/actions";
import { SignInForm } from "~/app/auth/signin/signin-form";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default async function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Suspense>
            <SignInForm signinAction={signinAction} />
          </Suspense>
          <Separator className="my-6" />
          <Button className="w-full" type="button" variant="secondary">
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">
            Google sign-in coming soon.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
