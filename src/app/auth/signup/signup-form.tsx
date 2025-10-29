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
import { parseAsString, useQueryState } from "nuqs";
import { signupSchema, SignupSchema } from "~/schemas/auth.schemas";
import { toast } from "sonner";
import { BaseHttpError, isBaseHttpError } from "~/exceptions/base.exceptions";

type SignupFormProps = {
  signupAction: (
    signupValues: SignupSchema
  ) => Promise<BaseHttpError | undefined>;
};

export function SignupForm({ signupAction }: SignupFormProps) {
  const [email] = useQueryState("email", parseAsString.withDefault(""));

  const formRef = useRef<HTMLFormElement | null>(null);
  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email, password: "" },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const res = await signupAction(data);

    if (isBaseHttpError(res)) {
      toast.error(res.message, { duration: 5000 });
      // We only want to mark these fields as errored (so that they are highlighted in red)
      // We don't want to show the error message to the user, so we don't set the message.
      form.setError("email", { type: "value" });
      form.setError("password", { type: "value" });
    }
  });

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className="grid gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
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
