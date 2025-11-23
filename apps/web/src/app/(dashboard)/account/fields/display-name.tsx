"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { authClient } from "~/lib/auth/auth.client";

const formSchema = z.object({
  fullName: z.string().min(1).max(32).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export interface DisplayNameFieldProps {
  userId: string;
  currentDisplayName?: string;
}

export default function DisplayNameField({
  currentDisplayName,
}: DisplayNameFieldProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: currentDisplayName ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { error } = await authClient.updateUser({
      name: data.fullName,
    });

    if (error) {
      toast.error(error.message || "An unknown error occurred.", {
        duration: 5000,
      });
    } else {
      toast.success("Display name updated successfully.");
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Display Name</CardTitle>
            <CardDescription>
              Please enter your full name, or a display name you are comfortable
              with.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="max-w-[300px]"
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      maxLength={32}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <div>Please use 32 characters at maximum.</div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-auto min-w-fit transition-all duration-300 ease-in-out"
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Spinner /> Saving
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
