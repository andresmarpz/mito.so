import { LinkSimple } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";

interface BookmarkForm {
  url: string;
}

export default function Dashboard() {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookmarkForm>();

  if (!session) return null;

  function onSubmit(data: BookmarkForm) {
    console.log("Bookmark saved:", data.url);
    reset();
  }

  return (
    <div className="mx-auto max-w-md px-6 py-12 sm:py-24">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900">Save a link</h1>
          <p className="text-sm text-zinc-500">Paste a URL to bookmark it for later.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Field data-invalid={!!errors.url}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkSimple className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  placeholder="https://example.com"
                  className="pl-8"
                  {...register("url", {
                    required: "Please enter a URL.",
                    pattern: {
                      value: /^https?:\/\/.+\..+/,
                      message: "Enter a valid URL starting with http(s)://",
                    },
                  })}
                />
              </div>
              <Button type="submit">Save</Button>
            </div>
            <FieldError errors={[errors.url]} />
          </Field>
        </form>
      </div>
    </div>
  );
}
