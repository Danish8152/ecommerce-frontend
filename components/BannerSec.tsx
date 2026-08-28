"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { productApi } from "@/lib/api";
import { ApiProduct, mapApiProductToUiProduct, UiProduct } from "@/lib/productMapping";
import { mockProducts } from "@/lib/mockProducts";

const BannerSec = () => {
  const [product, setProduct] = useState<UiProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchLatestProduct = async () => {
      try {
        const response = await productApi.list({
          page: 1,
          limit: 1,
          status: "active",
          sort: "createdAt_desc",
        });
        const items = (response.data?.data?.items || []) as ApiProduct[];
        if (mounted && items.length > 0) {
          setProduct(mapApiProductToUiProduct(items[0]));
        }
      } catch (err) {
        console.error("Failed to fetch latest product for banner:", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    fetchLatestProduct();
    return () => {
      mounted = false;
    };
  }, []);

  // Fallback to mock product if API load is pending or failed
  const displayProduct = product || {
    id: mockProducts[1].id,
    name: mockProducts[1].name,
    price: mockProducts[1].price,
    status: mockProducts[1].status || "New",
    image: mockProducts[1].image,
    rating: mockProducts[1].rating,
    hasVariants: false,
    defaultVariantId: null,
  };

  const resolvedVariantId = displayProduct.hasVariants ? displayProduct.defaultVariantId : null;
  const productLink = resolvedVariantId
    ? `/product/${displayProduct.id}?variant=${resolvedVariantId}`
    : `/product/${displayProduct.id}`;

  return (
    <section className="relative w-full min-h-150 overflow-hidden flex flex-col lg:flex-row">
      {/* 1. Left Side: Lifestyle Branding */}
      <div className="relative w-full lg:w-1/2 h-100 lg:h-auto bg-white flex items-center justify-center p-10">
        <Image
          src="/Img/feature-watch.webp"
          alt="NibbleX Premium Collection"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* 2. Right Side: Background Image & Product Card */}
      <div className="relative w-full lg:w-1/2 h-150 flex items-center justify-center px-6 lg:px-20 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/Img/lifestyle4.png"
          alt="Banner Background"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/30 z-0" />

        {/* The Product Card (Matching ProductSec design) */}
        <Link href={productLink} className="relative z-10 w-full max-w-85 block">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -5 }}
            viewport={{ once: true }}
            className="group bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl border border-transparent hover:border-gray-100 transition-all w-full cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-square bg-[#f9f9f9] rounded-xl overflow-hidden mb-6 flex items-center justify-center">
              {displayProduct.status && (
                <span className="absolute top-3 left-3 bg-[#facc15] text-[12px] font-medium px-2 py-1 rounded uppercase z-10">
                  {displayProduct.status}
                </span>
              )}
              <Image
                src={displayProduct.image}
                alt={displayProduct.name}
                fill
                sizes="(min-width: 1024px) 340px, 90vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Price & Title */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-gray-400">From</span>
              <span className="text-sm font-black text-gray-900">₹{displayProduct.price}</span>
            </div>

            <h3 className="text-sm md:text-lg font-bold text-gray-800 mt-4 mb-2 h-10 line-clamp-2 px-2 leading-tight">
              {displayProduct.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                return (
                  <span key={i}>
                    {displayProduct.rating >= ratingValue ? (
                      <FaStar className="text-[#facc15] text-xs" />
                    ) : displayProduct.rating >= ratingValue - 0.5 ? (
                      <FaStarHalfAlt className="text-[#facc15] text-xs" />
                    ) : (
                      <FaRegStar className="text-gray-300 text-xs" />
                    )}
                  </span>
                );
              })}
              <span className="text-[10px] font-bold text-gray-400 ml-1">
                ({displayProduct.rating})
              </span>
            </div>

            {/* Action Button (Pill Style from ProductSec) */}
            <button className="w-full py-3 border-2 border-gray-900 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
              Choose options
            </button>
          </motion.div>
        </Link>
      </div>
    </section>
  );
};

export default BannerSec;
