import { useState, useEffect, useRef } from "react";
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { useQuery } from "@tanstack/react-query";
import { getHighestEarnersWeek } from "../../api/dashboard";
import { highestEarnersWeekKey } from "../../api/queryKeys";

export default function TopEarnersList() {
  const { data, isLoading } = useQuery({
    queryKey: highestEarnersWeekKey(),
    queryFn: getHighestEarnersWeek,
  });

  // Define types for API response items and processed items
  type RawEarner = {
    name: string;
    user_id: string | number;
    rank: number;
    profile_image?: string | null;
  };

  type ProcessedEarner = {
    name: string;
    id: string; // formatted ID string
    rank: number;
    color: string;
    img: string;
  };

  const [currentPage, setCurrentPage] = useState(0);
  const desktopSliderRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Touch handling for mobile
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  // Process data if available
  const allEarners: ProcessedEarner[] =
    data?.top_earners?.map((earner: RawEarner): ProcessedEarner => ({
      name: earner.name,
      id: `ID: ${earner.user_id}`,
      rank: earner.rank,
      color:
        earner.rank === 1 ? "bg-lime-500" : earner.rank === 2 ? "bg-lime-400" : "bg-lime-300",
      img: earner.profile_image || "/Images/user_01.png",
    })) || [];

  const itemsPerPage = 3;
  const earnersPages: ProcessedEarner[][] = [];
  for (let i = 0; i < allEarners.length; i += itemsPerPage) {
    earnersPages.push(allEarners.slice(i, i + itemsPerPage));
  }

  const totalPages = earnersPages.length;
  console.log("earnersPages", earnersPages);

  // GSAP animation for desktop sliding
  const animateSlide = (newPage: number, direction: "left" | "right") => {
    if (!desktopSliderRef.current) return;

    const slides = desktopSliderRef.current.children;
    const currentSlide = slides[currentPage] as HTMLElement;
    const nextSlide = slides[newPage] as HTMLElement;

    if (!currentSlide || !nextSlide) return;

    const slideWidth = desktopSliderRef.current.offsetWidth;
    const offset = direction === "left" ? -slideWidth : slideWidth;

    // Set initial positions
    gsap.set(nextSlide, { x: offset, opacity: 0 });
    gsap.set(currentSlide, { x: 0, opacity: 1 });

    // Animate current slide out
    gsap.to(currentSlide, {
      x: direction === "left" ? -offset : offset,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });

    // Animate next slide in
    gsap.to(nextSlide, {
      x: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(currentSlide, { x: 0, opacity: 0 });
        gsap.set(nextSlide, { x: 0, opacity: 1 });
      },
    });
  };

  const goToPage = (page: number, direction: "left" | "right" = "left") => {
    if (page < 0 || page >= totalPages) return;

    animateSlide(page, direction);
    setCurrentPage(page);
    resetAutoPlay();
  };

  const nextPage = () => {
    const next = (currentPage + 1) % totalPages;
    goToPage(next, "left");
  };

  const prevPage = () => {
    const prev = currentPage === 0 ? totalPages - 1 : currentPage - 1;
    goToPage(prev, "right");
  };

  const resetAutoPlay = () => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    // Auto-advance every 5 seconds on desktop only
    if (typeof window !== "undefined" && window.innerWidth >= 768 && totalPages > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        const next = (currentPage + 1) % totalPages;
        goToPage(next, "left");
      }, 5000);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      resetAutoPlay();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize slides on mount when data changes
  useEffect(() => {
    if (!desktopSliderRef.current || earnersPages.length === 0) return;
    const slides = desktopSliderRef.current.children;
    Array.from(slides).forEach((slide, index) => {
      if (index === currentPage) {
        gsap.set(slide as HTMLElement, { x: 0, opacity: 1 });
      } else {
        gsap.set(slide as HTMLElement, { x: 0, opacity: 0 });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earnersPages.length]);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;

    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe left
    } else if (isRightSwipe) {
      // Swipe right
    }
  };

  if (isLoading) {
    return (
      <div className="md:col-span-3 bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-4 h-4 rounded bg-gray-200"></div>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between items-center px-2 gap-x-2 min-h-[200px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="rounded-full bg-gray-200 w-28 h-28 mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded mt-1"></div>
              <div className="h-3 w-16 bg-gray-200 rounded mt-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If API explicitly returns null top_1 -> show blurred list + centered message
  if (data?.top_1 === null) {
    const responseMessage = (data && (data.message || data.msg)) || "Current week not published yet";

    return (
      <div className="md:col-span-3 bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={16} className="text-lime-500" />
          <h3 className="font-semibold text-gray-700">Highest Earners of the Week <span className="text-gray-300">|</span> {data?.period_end}</h3>
        </div>

        {/* Underlying placeholders (desktop) */}
        <div className="hidden md:block relative">
          <div className="relative overflow-hidden" style={{ minHeight: "200px" }}>
            <div className="absolute inset-0 flex justify-between items-center px-2 gap-x-2">
              {[1,2,3].map((i)=> (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className="relative mb-2">
                    <img src="/Images/placeholder-image.png" alt="placeholder" className="rounded-full object-cover border border-white shadow-md w-28 h-28" />
                    <div className={`absolute bottom-1 right-1 w-fit h-fit px-1 py-0.5 bg-lime-300 text-white text-xs font-semibold flex items-center justify-center rounded-full border-2 border-white`}>-</div>
                  </div>
                  <p className="text-sm font-bold text-gray-800 mt-1 line-clamp-1">N/A</p>
                  <p className="text-[10px] text-gray-500">ID: -</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile placeholders */}
        <div className="md:hidden overflow-x-auto no-scrollbar">
          <div className="flex gap-4" style={{ width: "max-content" }}>
            <div className="flex gap-4 px-2" style={{ minWidth: "calc(100vw - 3rem)" }}>
              {[1,2].map((i)=> (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className="relative mb-2">
                    <img src="/Images/placeholder-image.png" alt="placeholder" className="rounded-full object-cover border border-white shadow-md w-20 h-20" />
                    <div className={`absolute bottom-1 right-1 w-fit h-fit px-1 py-0.5 bg-lime-300 text-white text-xs font-semibold flex items-center justify-center rounded-full border-2 border-white`}>-</div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mt-1 text-center">N/A</p>
                  <p className="text-[10px] text-gray-500">ID: -</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-area blur overlay */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-20 pointer-events-none"></div>

        {/* Centered non-blurred message */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto bg-white/95 px-6 py-4 rounded-xl shadow-lg z-30">
            <p className="text-gray-900 font-semibold text-lg md:text-xl">{responseMessage}</p>
            <p className="text-gray-700 text-sm mt-2 opacity-80">Check back soon for this week's top earners</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:col-span-3 bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={16} className="text-lime-500" />
        <h3 className="font-semibold text-gray-700">
          Highest Earners of the Week <span className="text-gray-300">|</span> {data.period_end}
        </h3>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block relative">
        <div
          ref={desktopSliderRef}
          className="relative overflow-hidden"
          style={{ minHeight: "200px" }}
        >
          {earnersPages.map((pageEarners, pageIndex) => (
            <div
              key={pageIndex}
              className={`absolute inset-0 flex justify-between items-center px-2 gap-x-2 ${
                // Only make visible initially if it's the current page
                // GSAP will handle the rest
                pageIndex === currentPage ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                  {pageEarners.map((earner: ProcessedEarner) => (
                    <div key={earner.id} className="flex flex-col items-center flex-1">
                  <div className="relative mb-2">
                    <img
                      src={earner.img}
                      alt={earner.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/Images/placeholder-image.png";
                      }}
                      className="rounded-full object-cover border border-white shadow-md w-28 h-28"
                    />
                    <div
                      className={`absolute bottom-1 right-1 w-fit h-fit px-1 py-0.5 ${earner.color} text-white text-xs font-semibold flex items-center justify-center rounded-full border-2 border-white`}
                    >
                      {earner.rank === 1
                        ? "1st"
                        : earner.rank === 2
                          ? "2nd"
                          : earner.rank === 3
                            ? "3rd"
                            : `${earner.rank}th`}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-800 mt-1 line-clamp-1">
                    {earner.name}
                  </p>
                  <p className="text-[10px] text-gray-500">{earner.id}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bullet Indicators */}
        <div className="flex justify-center gap-1 mt-6">
          {earnersPages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index, index > currentPage ? "left" : "right")}
              className={`w-2 h-2 rounded-full transition-all p-0 border-0 focus:outline-none ${index === currentPage
                ? "bg-lime-500 w-6"
                : "bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevPage}
          className="absolute left-2 bottom-0 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg grid justify-center items-center hover:bg-lime-50 transition-colors border border-gray-200 hover:border-lime-500 z-10 focus:outline-none"
        >
          <ChevronLeft size={20} className="text-gray-800 z-20" />
        </button>
        <button
          onClick={nextPage}
          className="absolute focus:outline-none right-2 bottom-0 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg grid justify-center items-center hover:bg-lime-50 transition-colors border border-gray-200 hover:border-lime-500 z-10"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Mobile View - 2 users per card with horizontal scroll */}
      <div
        className="md:hidden overflow-x-auto no-scrollbar"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex gap-4" style={{ width: "max-content" }}>
          {Array.from({ length: Math.ceil(allEarners.length / 2) }).map(
            (_, pairIndex) => (
              <div
                key={pairIndex}
                className="flex gap-4 px-2"
                style={{ scrollSnapAlign: "start", minWidth: "calc(100vw - 3rem)" }}
              >
                {allEarners.slice(pairIndex * 2, pairIndex * 2 + 2).map((earner: ProcessedEarner) => (
                  <div key={earner.id} className="flex flex-col items-center flex-1">
                    <div className="relative mb-2">
                      <img
                        src={earner.img}
                        alt={earner.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/Images/placeholder-image.png";
                        }}
                        className="rounded-full object-cover border border-white shadow-md w-20 h-20"
                      />
                      <div
                        className={`absolute bottom-1 right-1 w-fit h-fit px-1 py-0.5 ${earner.color} text-white text-xs font-semibold flex items-center justify-center rounded-full border-2 border-white`}
                      >
                        {earner.rank === 1
                          ? "1st"
                          : earner.rank === 2
                            ? "2nd"
                            : earner.rank === 3
                              ? "3rd"
                              : `${earner.rank}th`}
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mt-1 text-center">
                      {earner.name}
                    </p>
                    <p className="text-[10px] text-gray-500">{earner.id}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}