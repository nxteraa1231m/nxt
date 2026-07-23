"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (fileArray.length === 0) return;

      setUploading(true);
      try {
        const urls = await Promise.all(
          fileArray.map((file) => uploadToCloudinary(file))
        );
        onChange([...images, ...urls]);
        toast.success(`${urls.length} image(s) uploaded`);
      } catch {
        toast.error("Upload failed. Check your Cloudinary config.");
      } finally {
        setUploading(false);
      }
    },
    [images, onChange]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          dragOver
            ? "border-black bg-gray-50"
            : "border-gray-200 hover:border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => document.getElementById("image-input")?.click()}
      >
        <input
          id="image-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-gray-400" size={24} />
            <p className="text-sm text-gray-400">Uploading to Cloudinary...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="text-gray-400" size={24} />
            <p className="text-sm font-medium">
              Drop images here or{" "}
              <span className="text-black underline">browse</span>
            </p>
            <p className="text-xs text-gray-400">
              PNG, JPG, WEBP — transparent background preferred
            </p>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div
              key={url}
              className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"
            >
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                className="object-contain p-2 bg-gray-50"
                style={{ mixBlendMode: "multiply" }}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-full">
                  Main
                </span>
              )}
            </div>
          ))}

          {/* Add More Button */}
          <button
            type="button"
            onClick={() => document.getElementById("image-input")?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
          >
            <Plus size={20} className="text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
}
