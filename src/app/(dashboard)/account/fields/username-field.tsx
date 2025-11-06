"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Match } from "effect";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { updateUserAction } from "~/app/(dashboard)/account/actions";
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
import { isBaseHttpError } from "~/exceptions/base.exceptions";

const formSchema = z.object({
  username: z.string().min(1).max(32).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export interface UsernameFieldProps {
  userId: string;
  currentUsername?: string;
}

export default function UsernameField({
  userId,
  currentUsername,
}: UsernameFieldProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUsername ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const exit = await updateUserAction({
      id: userId,
      username: data.username,
    });

    Match.value(exit).pipe(
      Match.when(isBaseHttpError, (error) => {
        toast.error(error.message, { duration: 5000 });
      }),
      Match.orElse(() => {
        toast.success("Username updated successfully.");
      })
    );
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Username</CardTitle>
            <CardDescription>
              Please enter a username you are comfortable with.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="username"
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
