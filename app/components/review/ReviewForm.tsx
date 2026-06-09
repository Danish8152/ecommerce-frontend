"use client";
import React, { useState } from "react";
import { Star, Upload, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId: number;
  onSubmit: (data: {
    rating: number;
    title: string;
    comment: string;
    mediaIds?: number[];
  }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function ReviewForm({
  productId,
  onSubmit,
  onCancel,
  isLoading = false,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [uploadedMedias, setUploadedMedias] = useState<
    Array<{ id: number; url: string; filename: string }>
  >([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    setIsUploadingMedia(true);
    try {
      const { reviewApi } = await import("@/lib/api");
      const response = await reviewApi.uploadMedia(files[0]);
      const mediaData = response.data?.data;

      if (!mediaData) throw new Error("No data in response");

      setUploadedMedias((prev) => [
        ...prev,
        {
          id: mediaData.id,
          url: mediaData.url,
          filename: mediaData.filename,
        },
      ]);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleRemoveMedia = (id: number) => {
    setUploadedMedias((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      await onSubmit({
        rating,
        title: title || "No title",
        comment,
        mediaIds: uploadedMedias.map((m) => m.id),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div className="space-y-3">
        <label className="block font-bold text-gray-900">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={
                  star <= (hoverRating || rating)
                    ? "fill-[#facc15] text-[#facc15]"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-bold text-gray-600">
              {rating} / 5 stars
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          Review Title (Optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Excellent product!"
          maxLength={160}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#facc15]"
        />
        <span className="text-xs text-gray-500">{title.length} / 160</span>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          maxLength={5000}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#facc15] resize-none"
        />
        <span className="text-xs text-gray-500">{comment.length} / 5000</span>
      </div>

      {/* Media Upload */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-gray-900">
          Add Images (Optional, max 5)
        </label>
        {uploadedMedias.length < 5 && (
          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#facc15] hover:bg-yellow-50 transition-colors">
            <Upload size={18} className="text-gray-500" />
            <span className="text-sm font-bold text-gray-700">
              Click to upload image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleMediaUpload}
              disabled={isUploadingMedia}
              className="hidden"
            />
          </label>
        )}

        {uploadedMedias.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {uploadedMedias.map((media) => (
              <div
                key={media.id}
                className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group"
              >
                <Image
                  src={media.url}
                  alt={media.filename}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(media.id)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        <span className="text-xs text-gray-500">
          {uploadedMedias.length} / 5 images
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading || isUploadingMedia}
          className="flex-1 bg-[#facc15] text-black py-3 px-6 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide border-2 border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
