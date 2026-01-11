import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export interface CloudinaryUploadResult {
  public_id: string;
  url: string;
}

export const uploadFile = async (
  file: string,
  folder: string
): Promise<CloudinaryUploadResult> => {
  try {
    const result: UploadApiResponse | UploadApiErrorResponse =
      await cloudinary.uploader.upload(file, {
        folder,
        resource_type: "auto",
      });

    // ✅ check if result is success or error
    if ("public_id" in result) {
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } else {
      // result is UploadApiErrorResponse
      throw new Error(
        (result as UploadApiErrorResponse).message || "Cloudinary upload failed"
      );
    }
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw error;
  }
};

export const deleteFile = async (publicId: string): Promise<boolean> => {
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok";
  } catch (error) {
    console.error("❌ Cloudinary delete error:", error);
    return false;
  }
};
