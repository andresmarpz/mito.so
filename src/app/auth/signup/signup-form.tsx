"use client";

import { useCallback, useRef } from "react";
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
import { parseAsString, useQueryState } from "nuqs";
import { signupSchema, SignupSchema } from "~/schemas/auth.schemas";

type SignupFormProps = {
  signupAction: (formData: FormData) => Promise<void> | void;
};

export function SignupForm({ signupAction }: SignupFormProps) {
  const [email] = useQueryState("email", parseAsString.withDefault(""));

  const formRef = useRef<HTMLFormElement | null>(null);
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email, password: "" },
  });

  const normalizeValues = useCallback(() => {
    const email = form.getValues("email");
    const trimmedEmail = email.trim();

    if (trimmedEmail !== email) {
      form.setValue("email", trimmedEmail, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [form]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      normalizeValues();
      const isValid = await form.trigger();

      if (!isValid) {
        return;
      }

      formRef.current?.submit();
    },
    [form, normalizeValues]
  );

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={signupAction}
        className="grid gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
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
                  autoComplete="email"
                  autoCapitalize="none"
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
                <Input {...field} type="password" autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Sign up
        </Button>
      </form>
    </Form>
  );
}
