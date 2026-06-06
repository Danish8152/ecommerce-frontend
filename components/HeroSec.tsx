"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { heroBannerApi } from "@/lib/api";

type HeroSlide = {
  id: number | string;
  title: string;
  subtitle?: string | null;
  link?: string | null;
  image: string;
  isActive?: boolean;
};

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "fallback-1",
    title: "ADVENTURE AWAITS YOU.",
    subtitle: "Experience the peak of quality with our new seasonal collection.",
    link: "/shop",
    image: "/Img/hero.webp",
  },
  {
    id: "fallback-2",
    title: "EXPLORE NEW ARRIVALS.",
    subtitle: "Premium products curated just for you. Discover the best deals.",
    link: "/shop",
    image: "/Img/banner2.webp",
  },
];

const resolveImageSrc = (value: string) => {
  if (!value) {
    return "/Img/hero.webp";
  }

  if (value.startsWith("http")) {
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return `/${value}`;
};

const HeroSec = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSlides = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await heroBannerApi.listPublic();
        const items = (response.data?.data || []) as HeroSlide[];

        if (!mounted) {
          return;
        }

        if (Array.isArray(items) && items.length > 0) {
          setSlides(items);
          setCurrentIndex(0);
        } else {
          setSlides(FALLBACK_SLIDES);
        }
      } catch {
        if (mounted) {
          setSlides(FALLBACK_SLIDES);
          setLoadError("Unable to load hero banners right now.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadSlides();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, slides.length]);

  const activeSlide = useMemo(() => {
    return slides[currentIndex] || null;
  }, [currentIndex, slides]);

  const hasTextContent = useMemo(() => {
    if (!activeSlide) {
      return false;
    }
    const title = (activeSlide.title || "").trim();
    const subtitle = (activeSlide.subtitle || "").trim();
    const link = (activeSlide.link || "").trim();
    return Boolean(title || subtitle || link);
  }, [activeSlide]);

  const nextSlide = () => {
    if (slides.length === 0) {
      return;
    }

    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) {
      return;
    }

    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.x < -80) {
      nextSlide();
    } else if (info.offset.x > 80) {
      prevSlide();
    }
  };

  if (isLoading || !activeSlide) {
    return (
      <section className="relative min-h-screen w-full overflow-hidden flex items-center bg-[#1a1a1a]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-800 border-t-[#facc15] rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      {/* Background slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.01 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={resolveImageSrc(activeSlide.image)}
              alt={activeSlide.title || "Hero banner"}
              fill
              sizes="100vw"
              priority={currentIndex === 0}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Overlay for text readability — reduced for image-only slides */}
      <div className={`absolute inset-0 z-10 ${hasTextContent ? "bg-black/30" : "bg-black/10"}`} />

      {/* Content Container — only rendered when slide has text content */}
      {hasTextContent ? (
        <div className="relative z-20 container mx-auto min-h-screen px-6 sm:px-12">
          <div className="flex min-h-screen flex-col items-center justify-center text-center text-white pb-28 sm:pb-32 lg:pb-36">
            <AnimatePresence mode="wait">
              <motion.div
                key={`hero-copy-${activeSlide.id}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                {activeSlide.title ? (
                  <>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full mb-6 w-fit shadow-lg">
                      <Clock size={16} className="text-[#facc15]" />
                      <span className="text-xs font-black uppercase tracking-tighter">
                        Limited Time Offer
                      </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-semibold mb-6 drop-shadow-2xl">
                      {activeSlide.title}
                    </h1>
                  </>
                ) : null}

                {activeSlide.subtitle ? (
                  <p className="text-sm sm:text-lg font-medium mb-8 text-gray-100 max-w-xl">
                    {activeSlide.subtitle}
                  </p>
                ) : null}

                {activeSlide.link?.trim() ? (
                  <Link href={activeSlide.link.trim()} className="flex justify-center gap-4">
                    <button className="bg-[#facc15] text-black px-10 py-5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-colors shadow-2xl group">
                      Shop Now
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </Link>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : null}

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="absolute inset-x-0 bottom-6 z-30 flex flex-col items-center gap-4 px-6 sm:bottom-8 sm:gap-6"
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={prevSlide}
            className="h-9 w-9 p-2 border border-white/40 bg-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={`hero-dot-${slide.id}`}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? "w-10 bg-[#facc15]"
                    : "w-2 bg-white/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={nextSlide}
            className="h-9 w-9 p-2 border border-[#facc15] bg-[#facc15] text-black rounded-full hover:bg-white transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {loadError && !isLoading ? (
          <p className="text-xs font-bold uppercase tracking-widest text-red-200">
            {loadError}
          </p>
        ) : null}
      </motion.div>
    </section>
  );
};

export default HeroSec;
