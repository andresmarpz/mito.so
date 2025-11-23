"use client";

import { useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { toast } from "sonner";
import { Spinner } from "~/components/ui/spinner";
import { authClient } from "~/lib/auth/auth.client";
import { useRouter } from "next/navigation";

const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

type OtpSchema = z.infer<typeof otpSchema>;

export function OtpForm() {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<OtpSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = form.handleSubmit(async (data) => {
    const { data: session, error } = await authClient.signIn.emailOtp({
      email: "andresmarpz@gmail.com",
      otp: data.otp,
    });

    console.log(session);

    if (error) {
      toast.error(error.message || "An unknown error occurred.", {
        duration: 5000,
      });
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
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  ref={inputRef}
                  onComplete={() => formRef.current?.requestSubmit()}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Spinner /> : "Verify"}
        </Button>
      </form>
    </Form>
  );
}
