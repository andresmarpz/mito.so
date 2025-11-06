import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

export interface FieldCardSkeletonProps {
  title: string;
  description: string;
  footerText: string;
}

export function FieldCardSkeleton({
  title,
  description,
  footerText,
}: FieldCardSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="max-w-[300px]">
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div>{footerText}</div>
        <Button disabled className="w-auto min-w-fit">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
