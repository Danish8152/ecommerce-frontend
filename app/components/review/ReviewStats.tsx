"use client";
import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { adminReviewApi } from "@/lib/api";

interface Stats {
  totalReviews: number;
  approvedCount: number;
  pendingCount: number;
  averageRating: number;
}

export default function ReviewStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await adminReviewApi.getAnalytics();
        const data = response.data?.data;
        setStats({
          totalReviews: data?.totalReviews || 0,
          approvedCount: data?.approvedCount || 0,
          pendingCount: data?.pendingCount || 0,
          averageRating: data?.averageRating || 0,
        });
      } catch (error) {
        console.error("Failed to load review stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading || !stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <div className="text-xl font-black text-blue-700">{stats.totalReviews}</div>
        <div className="text-xs font-bold text-blue-600 uppercase mt-1">Total Reviews</div>
      </div>
      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
        <div className="text-xl font-black text-green-700">{stats.approvedCount}</div>
        <div className="text-xs font-bold text-green-600 uppercase mt-1">Approved</div>
      </div>
      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
        <div className="text-xl font-black text-amber-700">{stats.pendingCount}</div>
        <div className="text-xs font-bold text-amber-600 uppercase mt-1">Pending</div>
      </div>
      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200 flex items-center gap-2">
        <div className="flex flex-col">
          <div className="text-xl font-black text-yellow-700">{stats.averageRating.toFixed(1)}</div>
          <div className="text-xs font-bold text-yellow-600 uppercase">Avg Rating</div>
        </div>
        <Star size={16} className="fill-[#facc15] text-[#facc15]" />
      </div>
    </div>
  );
}
