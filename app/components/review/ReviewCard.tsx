"use client";
import React from "react";
import { Star, Heart, MessageSquare, Trash2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

interface ReviewCardProps {
  id: number;
  rating: number;
  title?: string;
  comment?: string;
  userName: string;
  userImage?: string;
  isVerifiedPurchase?: boolean;
  helpfulCount?: number;
  createdAt: string;
  media?: Array<{ url: string; filename: string }>;
  adminReply?: string;
  onHelpful?: (id: number) => void;
  onUnhelpful?: (id: number) => void;
  onDelete?: (id: number) => void;
  isOwner?: boolean;
  isAdmin?: boolean;
}

export default function ReviewCard({
  id,
  rating,
  title,
  comment,
  userName,
  userImage,
  isVerifiedPurchase,
  helpfulCount = 0,
  createdAt,
  media = [],
  adminReply,
  onHelpful,
  onUnhelpful,
  onDelete,
  isOwner,
  isAdmin,
}: ReviewCardProps) {
  const renderStars = (count: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < count ? "fill-[#facc15] text-[#facc15]" : "text-gray-200"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          {userImage ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
              <Image src={userImage} alt={userName} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{userName}</span>
              {isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  ✓ Verified Purchase
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">{format(new Date(createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>
        {(isOwner || isAdmin) && (
          <button
            onClick={() => onDelete?.(id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Rating & Title */}
      <div className="space-y-2">
        {renderStars(rating)}
        {title && <h4 className="font-bold text-gray-900">{title}</h4>}
      </div>

      {/* Comment */}
      {comment && <p className="text-sm text-gray-600 leading-relaxed">{comment}</p>}

      {/* Media Gallery */}
      {media.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {media.map((img, idx) => (
            <div
              key={idx}
              className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
            >
              <Image
                src={img.url}
                alt={img.filename}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ))}
        </div>
      )}

      {/* Admin Reply */}
      {adminReply && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200 space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-yellow-700" />
            <span className="text-xs font-bold text-yellow-700">Store Response</span>
          </div>
          <p className="text-sm text-yellow-900">{adminReply}</p>
        </div>
      )}

      {/* Helpful Counter */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onHelpful?.(id)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Heart size={14} />
          <span>{helpfulCount > 0 ? helpfulCount : "Helpful"}</span>
        </button>
      </div>
    </div>
  );
}
