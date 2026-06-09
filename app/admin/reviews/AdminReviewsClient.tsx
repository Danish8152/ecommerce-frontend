"use client";
import React, { useEffect, useState } from "react";
import { Search, Star, MessageSquare, Check, X, Trash2, Eye, MessageCircle } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { adminReviewApi } from "@/lib/api";
import { format } from "date-fns";

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
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
    avatar?: string;
  };
  product?: {
    id: number;
    name: string;
    image: string;
  };
  media?: Array<{ id: number; url: string }>;
}

interface AdminAnalytics {
  totalReviews: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  hiddenCount: number;
  verifiedCount: number;
  averageRating: number;
  distribution: Record<string, number>;
}

export default function AdminReviewsClient() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);

  useEffect(() => {
    loadReviews();
    loadAnalytics();
  }, [statusFilter]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page: 1,
        limit: 50,
      };

      if (statusFilter !== "All") {
        params.status = statusFilter.toUpperCase();
      }

      const response = await adminReviewApi.list(params);
      const data = response.data?.data || { items: [] };
      setReviews(data.items || []);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await adminReviewApi.getAnalytics();
      setAnalytics(response.data?.data || null);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.user?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleApprove = async (id: number) => {
    try {
      await adminReviewApi.approve(id);
      toast.success("Review approved");
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
      );
    } catch (error) {
      toast.error("Failed to approve review");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await adminReviewApi.reject(id);
      toast.success("Review rejected");
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
      );
    } catch (error) {
      toast.error("Failed to reject review");
    }
  };

  const handleHide = async (id: number) => {
    try {
      await adminReviewApi.hide(id);
      toast.success("Review hidden");
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "HIDDEN" } : r))
      );
    } catch (error) {
      toast.error("Failed to hide review");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await adminReviewApi.delete(id);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const handleReply = async () => {
    if (!selectedReview || !replyText.trim()) return;

    try {
      await adminReviewApi.addReply(selectedReview.id, { reply: replyText });
      toast.success("Reply added");
      setReviews((prev) =>
        prev.map((r) =>
          r.id === selectedReview.id
            ? { ...r, adminReply: replyText, repliedAt: new Date().toISOString() }
            : r
        )
      );
      setShowReplyModal(false);
      setReplyText("");
      setSelectedReview(null);
    } catch (error) {
      toast.error("Failed to add reply");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1 text-[#facc15]">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? "fill-[#facc15]" : "text-gray-200"}
          />
        ))}
      </div>
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      case "HIDDEN":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">
            Customer Reviews
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            Moderate user reviews, ratings, and feedback before publishing to store pages.
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="text-2xl font-black text-gray-900">{analytics.totalReviews}</div>
            <div className="text-xs font-bold text-gray-500 uppercase mt-1">Total Reviews</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 border border-green-200 shadow-sm">
            <div className="text-2xl font-black text-green-700">{analytics.approvedCount}</div>
            <div className="text-xs font-bold text-green-600 uppercase mt-1">Approved</div>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-sm">
            <div className="text-2xl font-black text-amber-700">{analytics.pendingCount}</div>
            <div className="text-xs font-bold text-amber-600 uppercase mt-1">Pending</div>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 border border-red-200 shadow-sm">
            <div className="text-2xl font-black text-red-700">{analytics.rejectedCount}</div>
            <div className="text-xs font-bold text-red-600 uppercase mt-1">Rejected</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 shadow-sm">
            <div className="text-2xl font-black text-blue-700">
              {analytics.averageRating.toFixed(1)}
            </div>
            <div className="text-xs font-bold text-blue-600 uppercase mt-1">Avg Rating</div>
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, product, or comment..."
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#facc15] outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-auto bg-gray-50 border-none rounded-2xl py-3 px-6 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#facc15] outline-none cursor-pointer"
        >
          <option value="All">All Reviews</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Hidden">Hidden</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-4xl border border-gray-100 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-500">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Loading reviews...
            </div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <MessageSquare className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="text-lg font-bold tracking-tight text-gray-800">No reviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">
                    Customer
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">
                    Product
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">
                    Rating & Comment
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">
                    Date
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400">
                    Status
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-black text-gray-900">{review.user?.fullName || "Anonymous"}</div>
                      <div className="text-xs font-bold text-gray-400">{review.user?.email}</div>
                      {review.isVerifiedPurchase && (
                        <div className="text-xs font-bold text-green-600 mt-1">✓ Verified</div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        {review.product?.image && (
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            <Image
                              src={review.product.image}
                              alt={review.product.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="font-bold text-gray-800 text-sm line-clamp-2">
                          {review.product?.name || "Unknown Product"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 max-w-md">
                      {renderStars(review.rating)}
                      {review.title && <p className="text-sm font-bold text-gray-900 mt-1">{review.title}</p>}
                      <p className="text-sm font-medium text-gray-600 mt-1 line-clamp-2">{review.comment}</p>
                      {review.media && review.media.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {review.media.map((m) => (
                            <div
                              key={m.id}
                              className="relative w-6 h-6 rounded overflow-hidden bg-gray-100"
                            >
                              <Image
                                src={m.url}
                                alt="media"
                                fill
                                className="object-cover"
                                sizes="24px"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xs font-bold text-gray-500">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusBadgeClass(
                          review.status
                        )}`}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== "APPROVED" && (
                          <button
                            onClick={() => handleApprove(review.id)}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                            title="Approve Review"
                          >
                            <Check size={14} /> Approve
                          </button>
                        )}
                        {review.status !== "REJECTED" && (
                          <button
                            onClick={() => handleReject(review.id)}
                            className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                            title="Reject Review"
                          >
                            <X size={14} /> Reject
                          </button>
                        )}
                        {review.status !== "HIDDEN" && (
                          <button
                            onClick={() => handleHide(review.id)}
                            className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                            title="Hide Review"
                          >
                            <Eye size={14} /> Hide
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setReplyText(review.adminReply || "");
                            setShowReplyModal(true);
                          }}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                          title="Reply to Review"
                        >
                          <MessageCircle size={14} /> Reply
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900">Reply to Review</h3>
              <p className="text-sm text-gray-500 mt-1">
                Review by {selectedReview.user?.fullName}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                {renderStars(selectedReview.rating)}
                {selectedReview.title && (
                  <span className="font-bold text-gray-900">{selectedReview.title}</span>
                )}
              </div>
              <p className="text-sm text-gray-600">{selectedReview.comment}</p>
            </div>

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply here..."
              maxLength={2000}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#facc15] resize-none"
            />
            <span className="text-xs text-gray-500">{replyText.length} / 2000</span>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowReplyModal(false);
                  setSelectedReview(null);
                  setReplyText("");
                }}
                className="px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide border-2 border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide bg-[#facc15] text-black hover:bg-black hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
