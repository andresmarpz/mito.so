"use client";

import { useState } from "react";
import { ImagePanel } from "./image-panel";

export interface ImageVersion {
  id: string;
  url: string;
  timestamp: number;
  name: string;
}

export function ImageEditor() {
  const [imageVersions, setImageVersions] = useState<ImageVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (imageUrl: string) => {
    const newVersion: ImageVersion = {
      id: Date.now().toString(),
      url: imageUrl,
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
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-hidden">
        <ImagePanel
          currentImage={currentImage}
          imageVersions={imageVersions}
          selectedVersionId={selectedVersionId}
          onImageUpload={handleImageUpload}
          onImageEdit={handleImageEdit}
          onVersionSelect={handleVersionSelect}
          onClearAll={handleClearAll}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
}
