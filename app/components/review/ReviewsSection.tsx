"use client";
import React, { useCallback, useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import toast from "react-hot-toast";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { reviewApi } from "@/lib/api";

interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  title?: string;
  comment?: string;
  isVerifiedPurchase: boolean;
  status: string;
  helpfulCount: number;
  adminReply?: string;
  createdAt: string;
  user?: { id: number; fullName: string };
  media?: Array<{ id: number; url: string; filename: string }>;
}

interface ReviewsSectionProps {
  productId: number;
  productName: string;
  isLoggedIn?: boolean;
  productRating?: number;
  productTotalReviews?: number;
  ratingDistribution?: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

type SortKey = "newest" | "rating_high" | "helpful";
const SORT_MAP: Record<SortKey, string> = {
  newest: "createdAt_desc",
  rating_high: "rating_desc",
  helpful: "helpfulCount_desc",
};

export default function ReviewsSection({
  productId,
  productName,
  isLoggedIn = false,
  productRating = 0,
  productTotalReviews = 0,
  ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (raw) {
        const parsed = JSON.parse(raw);
        setCurrentUserId(parsed?.id ?? null);
      }
    } catch {
      // ignore
    }
  }, []);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean> = {
        page: 1,
        limit: 10,
        sort: SORT_MAP[sortBy],
      };
      if (ratingFilter !== "all") {
        params.rating = ratingFilter;
      }
      const response = await reviewApi.listForProduct(productId, params);
      setReviews(response.data?.data?.items ?? []);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId, ratingFilter, sortBy]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleAddReview = async (data: {
    rating: number;
    title: string;
    comment: string;
    mediaIds?: number[];
  }) => {
    setIsSubmitting(true);
    try {
      await reviewApi.create({ productId, ...data });
      toast.success("Review submitted! It will be visible after approval.");
      setShowForm(false);
      loadReviews();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: number) => {
    if (!isLoggedIn) {
      toast.error("Please log in to vote");
      return;
    }
    try {
      await reviewApi.addHelpfulVote(reviewId);
      setReviews((prev) =>
        prev.map((r) => r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)
      );
    } catch {
      toast.error("Could not record your vote");
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm("Delete this review?")) return;
    try {
      await reviewApi.delete(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success("Review deleted");
    } catch {
      toast.error("Could not delete review");
    }
  };

  const renderStars = (count: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} className={i <= count ? "fill-[#facc15] text-[#facc15]" : "text-gray-300"} />
      ))}
    </div>
  );

  const hasStats = productTotalReviews > 0;

  return (
    <div className="space-y-12 py-12 border-t border-gray-100">
      <div className="text-center">
        <h2 className="text-3xl font-serif font-semibold text-gray-900 mb-3">Customer Reviews</h2>
        <p className="text-gray-500 font-medium text-sm">See what customers say about {productName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Stats sidebar */}
        <div className="space-y-6">
          {hasStats ? (
            <>
              <div className="bg-white rounded-3xl p-6 border border-gray-100 text-center space-y-3">
                <div className="text-4xl font-black text-gray-900">{productRating.toFixed(1)}</div>
                <div className="flex justify-center">{renderStars(Math.round(productRating))}</div>
                <div className="text-xs text-gray-500 font-bold">
                  Based on {productTotalReviews} {productTotalReviews === 1 ? "review" : "reviews"}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 space-y-3">
                <h4 className="font-bold text-gray-900 text-sm">Rating Breakdown</h4>
                {([5, 4, 3, 2, 1] as const).map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-600 w-6">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#facc15]"
                        style={{
                          width: `${productTotalReviews > 0 ? (ratingDistribution[star] / productTotalReviews) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">{ratingDistribution[star]}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 text-center space-y-2">
              <Star size={32} className="mx-auto text-gray-300" />
              <p className="text-sm font-bold text-gray-500">No ratings yet</p>
            </div>
          )}

          {isLoggedIn && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-[#facc15] text-black py-3 px-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-all"
            >
              + Write a Review
            </button>
          )}
        </div>

        {/* Reviews list */}
        <div className="lg:col-span-3 space-y-6">
          {showForm && (
            <div className="bg-white rounded-3xl border border-gray-100 p-8">
              <h3 className="font-bold text-lg text-gray-900 mb-6">Share Your Review</h3>
              <ReviewForm
                productId={productId}
                onSubmit={handleAddReview}
                onCancel={() => setShowForm(false)}
                isLoading={isSubmitting}
              />
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#facc15]"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4 Stars Only</option>
              <option value="3">3 Stars Only</option>
              <option value="2">2 Stars Only</option>
              <option value="1">1 Star Only</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#facc15]"
            >
              <option value="newest">Newest First</option>
              <option value="rating_high">Highest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm font-bold text-gray-500 uppercase tracking-widest">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-3">
              <MessageSquare className="mx-auto text-gray-300" size={48} />
              <h3 className="font-bold text-gray-900">No Reviews Yet</h3>
              <p className="text-sm text-gray-500">
                Be the first to share your experience with this product!
              </p>
              {isLoggedIn && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#facc15] text-black rounded-full font-bold text-sm uppercase hover:bg-black hover:text-white transition-all"
                >
                  Write a Review
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  rating={review.rating}
                  title={review.title}
                  comment={review.comment}
                  userName={review.user?.fullName ?? "Anonymous"}
                  isVerifiedPurchase={review.isVerifiedPurchase}
                  helpfulCount={review.helpfulCount}
                  createdAt={review.createdAt}
                  media={review.media}
                  adminReply={review.adminReply}
                  onHelpful={handleHelpful}
                  isOwner={currentUserId === review.userId}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
