import { login, signup } from "~/app/auth/login/actions";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                spellCheck="false"
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                aria-autocomplete="none"
                required
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" type="submit" formAction={login}>
                Log in
              </Button>
              <Button
                className="flex-1"
                type="submit"
                variant="outline"
                formAction={signup}
              >
                Sign up
              </Button>
            </div>
          </form>
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
