"use client";

import type React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  ImageIcon,
  Loader2,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import type { ImageVersion } from "./image-editor";

interface ImagePanelProps {
  currentImage: ImageVersion | undefined;
  imageVersions: ImageVersion[];
  selectedVersionId: string | null;
  onImageUpload: (imageUrl: string) => void;
  onImageEdit: (editedImageUrl: string) => void;
  onVersionSelect: (versionId: string) => void;
  onClearAll: () => void;
  isProcessing: boolean;
}

export function ImagePanel({
  currentImage,
  imageVersions,
  selectedVersionId,
  onImageUpload,
  onImageEdit,
  onVersionSelect,
  onClearAll,
  isProcessing,
}: ImagePanelProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [isVersionHistoryCollapsed, setIsVersionHistoryCollapsed] =
    useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onImageUpload(result);
          setZoom(1);
          setUndoStack([]);
          setRedoStack([]);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageUpload]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive: dropzoneActive,
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageUpload(result);
        setZoom(1);
        setUndoStack([]);
        setRedoStack([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!currentImage) return;

    const link = document.createElement("a");
    link.href = currentImage.url;
    link.download = `${currentImage.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (imageVersions.length > 0) {
      onVersionSelect(imageVersions[0].id);
      setZoom(1);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0 && selectedVersionId) {
      const previousVersionId = undoStack[undoStack.length - 1];
      setRedoStack((prev) => [...prev, selectedVersionId]);
      setUndoStack((prev) => prev.slice(0, -1));
      onVersionSelect(previousVersionId);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextVersionId = redoStack[redoStack.length - 1];
      if (selectedVersionId) {
        setUndoStack((prev) => [...prev, selectedVersionId]);
      }
      setRedoStack((prev) => prev.slice(0, -1));
      onVersionSelect(nextVersionId);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.25));
  };

  const handleVersionClick = (versionId: string) => {
    if (selectedVersionId && selectedVersionId !== versionId) {
      setUndoStack((prev) => [...prev, selectedVersionId]);
      setRedoStack([]); // Clear redo stack when making new selection
    }
    onVersionSelect(versionId);
  };

  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 flex flex-col">
        {currentImage && (
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">
                  {currentImage.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(currentImage.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Version{" "}
                {imageVersions.findIndex((v) => v.id === selectedVersionId) + 1}{" "}
                of {imageVersions.length}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 p-6 overflow-hidden">
          {currentImage ? (
            <Card className="h-full relative overflow-hidden bg-card border-border">
              {isProcessing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="flex items-center gap-3 text-foreground">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-lg font-medium">
                      Processing image...
                    </span>
                  </div>
                </div>
              )}
              <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                <img
                  src={currentImage.url || "/placeholder.svg"}
                  alt={currentImage.name}
                  className="max-w-none transition-transform duration-200"
                  style={{
                    transform: `scale(${zoom})`,
                    imageRendering: zoom > 1 ? "pixelated" : "high-quality",
                  }}
                />
              </div>

              <div className="absolute top-4 right-4 bg-secondary rounded-lg border border-border overflow-hidden">
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.25}
                    className="rounded-none border-r border-border"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <div className="px-3 py-2 text-sm font-mono bg-secondary min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="rounded-none border-l border-border"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card
              {...getRootProps()}
              className={cn(
                "h-full flex flex-col items-center justify-center border-2 border-dashed cursor-pointer transition-all duration-200 bg-card hover:bg-accent/50",
                (isDragActive || dropzoneActive) &&
                  "border-primary bg-primary/10",
                "border-border hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4 text-center max-w-md">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Upload your image
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop an image here, or click to select a file
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PNG, JPG, JPEG, GIF, and WebP formats
                  </p>
                </div>
                <Button variant="outline" className="mt-2 bg-transparent">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />
              <Button variant="outline" asChild>
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New
                </label>
              </Button>
            </div>

            {currentImage && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleUndo}
                  disabled={isProcessing || undoStack.length === 0}
                >
                  <Undo className="w-4 h-4 mr-2" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRedo}
                  disabled={isProcessing || redoStack.length === 0}
                >
                  <Redo className="w-4 h-4 mr-2" />
                  Redo
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isProcessing}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={isProcessing}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={onClearAll}
                  disabled={isProcessing}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {imageVersions.length > 0 && (
        <div
          className={cn(
            "border-l border-border bg-card flex flex-col",
            isVersionHistoryCollapsed ? "w-12" : "w-48"
          )}
        >
          <div className="p-3 border-b border-border flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setIsVersionHistoryCollapsed(!isVersionHistoryCollapsed)
              }
              className="w-full justify-center"
            >
              {isVersionHistoryCollapsed ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>

          {!isVersionHistoryCollapsed && (
            <ScrollArea className="flex-1 p-2">
              <div className="space-y-1">
                {imageVersions.map((version) => (
                  <Card
                    key={version.id}
                    className={cn(
                      "p-1.5 cursor-pointer transition-all hover:bg-accent/50",
                      selectedVersionId === version.id &&
                        "ring-2 ring-blue-500 ring-dashed bg-accent"
                    )}
                    onClick={() => handleVersionClick(version.id)}
                  >
                    <div className="aspect-square rounded overflow-hidden bg-muted">
                      <img
                        src={version.url || "/placeholder.svg"}
                        alt={version.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}
    </div>
  );
}
