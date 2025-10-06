import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { CampaignImage } from "../types/campaign";

interface ImageUploadProps {
  images: CampaignImage[];
  onImagesChange: (images: CampaignImage[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxFiles = 10,
  maxFileSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `File type ${
          file.type
        } is not supported. Please use ${acceptedTypes.join(", ")}.`;
      }

      if (file.size > maxFileSize * 1024 * 1024) {
        return `File size must be less than ${maxFileSize}MB.`;
      }

      return null;
    },
    [acceptedTypes, maxFileSize]
  );

  const processFiles = useCallback(
    (files: FileList) => {
      const newImages: CampaignImage[] = [];
      const errors: string[] = [];

      if (images.length + files.length > maxFiles) {
        setError(
          `Cannot upload more than ${maxFiles} images. You currently have ${images.length} images.`
        );
        return;
      }

      Array.from(files).forEach((file) => {
        const validationError = validateFile(file);

        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
          return;
        }

        const imageId = generateId();
        const url = URL.createObjectURL(file);

        const campaignImage: CampaignImage = {
          id: imageId,
          file,
          url,
          name: file.name,
          size: file.size,
          type: file.type,
        };

        newImages.push(campaignImage);
      });

      if (errors.length > 0) {
        setError(errors.join("; "));
      } else {
        setError(null);
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    },
    [images, onImagesChange, maxFiles, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(files);
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeImage = (imageId: string) => {
    const imageToRemove = images.find((img) => img.id === imageId);
    if (imageToRemove?.url) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    const updatedImages = images.filter((img) => img.id !== imageId);
    onImagesChange(updatedImages);
    setError(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-zinc-300">
          Campaign Images
        </label>
        <span className="text-xs text-zinc-500">
          {images.length}/{maxFiles} images • Max {maxFileSize}MB each
        </span>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${
            isDragging
              ? "border-yellow-400 bg-yellow-400/10"
              : "border-zinc-600 hover:border-zinc-500 bg-zinc-800/50"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-2">
          <Upload className="h-8 w-8 text-zinc-400 mx-auto" />
          <div>
            <p className="text-zinc-300 font-medium">
              {isDragging
                ? "Drop images here"
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-zinc-500 text-sm">
              PNG, JPG, GIF, WebP up to {maxFileSize}MB
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start space-x-2 p-3 bg-red-900/20 border border-red-700 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-zinc-800 border border-zinc-600">
                {image.url ? (
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-zinc-500" />
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>

              {/* File info */}
              <div className="mt-1 text-xs text-zinc-400 truncate">
                <p className="truncate">{image.name}</p>
                <p>{formatFileSize(image.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
