"use client";

import { useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSerializer, parseAsString } from "nuqs";
import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { Spinner } from "~/components/ui/spinner";
import { signinSchema, SigninSchema } from "~/schemas/auth.schemas";
import { BaseHttpError, isBaseHttpError } from "~/exceptions/base.exceptions";
import { signinAction } from "~/app/auth/signin/actions";

type SignInFormProps = {
  signinAction: typeof signinAction;
};

export function SignInForm({ signinAction }: SignInFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();
  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  });

  const serializeAuthParams = useMemo(
    () =>
      createSerializer({
        email: parseAsString,
      }),
    []
  );

  const handleSignupRedirect = useCallback(() => {
    const { email } = form.getValues();

    const trimmedEmail = email.trim();
    if (trimmedEmail !== email) {
      form.setValue("email", trimmedEmail, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }

    const sanitizedEmail = trimmedEmail.length > 0 ? trimmedEmail : null;

    const target = serializeAuthParams("/auth/signup", {
      email: sanitizedEmail,
    });

    router.push(target);
  }, [form, router, serializeAuthParams]);

  const handleSubmit = form.handleSubmit(async (data) => {
    const res = await signinAction(data);

    if (isBaseHttpError(res)) {
      toast.error(res.message, { duration: 5000 });
      form.setError("email", { type: "value" });
      form.setError("password", { type: "value" });
    } else {
      toast.success("Signed in successfully.");
      router.push("/");
    }
  });

  return (
    <Form {...form}>
      <form ref={formRef} className="grid gap-4" onSubmit={handleSubmit}>
        {form.formState.errors.root?.message && (
          <FormItem>
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
          </FormItem>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  inputMode="email"
                  spellCheck="false"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button
            className="flex-1 basis-1/2"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Spinner /> : "Log in"}
          </Button>
          <Button
            className="flex-1 basis-1/2"
            type="button"
            variant="outline"
            onClick={handleSignupRedirect}
            disabled={form.formState.isSubmitting}
          >
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  );
}
