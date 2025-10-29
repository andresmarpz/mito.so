import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface ImageUploaderProps {
  onUpload: (file: File) => unknown;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles[0]);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: false,
    maxFiles: 1,
    minSize: 1024, // 1 KB
    maxSize: 1024 * 1024 * 5, // 5 MB
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "h-full flex flex-1 justify-center items-center",
        isDragActive && "border-primary"
      )}
    >
      <CardHeader className="">
        <CardTitle>Upload Image</CardTitle>
      </CardHeader>
      <CardContent>
        <input {...getInputProps()} />
        <CardDescription>
          Drag and drop an image here, or click to select a file
        </CardDescription>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
