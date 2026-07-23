// Cloudinary upload helper (client-side)
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "nxt_products"
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url as string;
}

export async function uploadMultipleToCloudinary(files: File[]): Promise<string[]> {
  const uploads = files.map((file) => uploadToCloudinary(file));
  return Promise.all(uploads);
}

export function getCloudinaryPublicId(url: string): string {
  // Extract public_id from Cloudinary URL
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return "";
  // Skip version if present (v1234567)
  const afterUpload = parts.slice(uploadIndex + 1);
  const withoutVersion = afterUpload[0]?.startsWith("v")
    ? afterUpload.slice(1)
    : afterUpload;
  const filename = withoutVersion.join("/");
  // Remove extension
  return filename.replace(/\.[^/.]+$/, "");
}
