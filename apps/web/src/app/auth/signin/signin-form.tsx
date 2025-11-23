"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { authClient } from "~/lib/auth/auth.client";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement | null>(null);
  const form = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: data.email,
      type: "sign-in",
    });

    if (error) {
      toast.error(error.message || "An unknown error occurred.", {
        duration: 5000,
      });
    } else {
      toast.success("Check your email for a magic link to sign in.");
      router.push("/auth/otp");
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
        <div className="flex gap-2">
          <Button
            className="flex-1 basis-1/2"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Spinner /> : "Send magic link"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
