"use client";
import { useState } from "react";
import ChatSidebar from "~/components/dashboard/chat-sidebar";
import { ImagePanel } from "~/components/dashboard/image-panel";
import ImageUploader from "~/components/dashboard/image-uploader";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export interface ImageVersion {
  id: string;
  url: string;
  timestamp: number;
  name: string;
}

export default function DashboardPageClient() {
  const [imageVersions, setImageVersions] = useState<ImageVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (imageUrl: File) => {
    const newVersion: ImageVersion = {
      id: Date.now().toString(),
      url: URL.createObjectURL(imageUrl), // TODO: use a better URL
      timestamp: Date.now(),
      name: `Image ${imageVersions.length + 1}`,
    };

    setImageVersions((prev) => [...prev, newVersion]);
    setSelectedVersionId(newVersion.id);
  };

  const handleImageEdit = (editedImageUrl: string) => {
    const newVersion: ImageVersion = {
      id: Date.now().toString(),
      url: editedImageUrl,
      timestamp: Date.now(),
      name: `Edit ${imageVersions.length + 1}`,
    };

    setImageVersions((prev) => [...prev, newVersion]);
    setSelectedVersionId(newVersion.id);
  };

  const handleVersionSelect = (versionId: string) => {
    setSelectedVersionId(versionId);
  };

  const handleClearAll = () => {
    setImageVersions([]);
    setSelectedVersionId(null);
  };

  const currentImage = imageVersions.find((v) => v.id === selectedVersionId);
  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset>
        <main className="p-2 flex flex-col flex-1">
          <div className="pb-2">
            <SidebarTrigger className="size-10" />
          </div>
          <Separator />

          {/* <ImagePanel
            currentImage={currentImage}
            imageVersions={imageVersions}
            selectedVersionId={selectedVersionId}
            onImageUpload={handleImageUpload}
            onImageEdit={handleImageEdit}
            onVersionSelect={handleVersionSelect}
            onClearAll={handleClearAll}
            isProcessing={isProcessing}
          /> */}
          <ImageUploader onUpload={handleImageUpload} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
