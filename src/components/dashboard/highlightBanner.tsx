import { useQuery } from "@tanstack/react-query";
import { getHighestEarnersMonth } from "../../api/dashboard";
import { highestEarnersMonthKey } from "../../api/queryKeys";

export default function HighlightBanner() {
  const { data, isLoading } = useQuery({
    queryKey: highestEarnersMonthKey(),
    queryFn: getHighestEarnersMonth,
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-[#ffe9c0] to-[#ffd993] rounded-3xl md:p-8 p-5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[220px] animate-pulse">
        <div className="z-10 max-w-lg w-full">
          <div className="h-4 bg-yellow-200/50 rounded w-48 mb-4"></div>
          <div className="h-8 bg-yellow-200/50 rounded w-64 mb-6"></div>
          <div className="h-4 bg-yellow-200/50 rounded w-full mb-2"></div>
          <div className="h-4 bg-yellow-200/50 rounded w-3/4 mb-6"></div>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 bg-yellow-200/50 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-yellow-200/50 rounded"></div>
              <div className="h-8 w-40 bg-yellow-200/50 rounded"></div>
            </div>
          </div>
        </div>
        <div className="relative mt-6 md:mt-0">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-yellow-200/50"></div>
        </div>
      </div>
    );
  }

  const earner = data?.top_1 || {};

  // If API explicitly returns null top_1 -> show blurred banner + centered message box
  if (data?.top_1 === null) {
    const responseMessage = (data && (data.message || data.msg)) || "Current month not published yet";

    return (
      <div className="bg-gradient-to-r from-[#ffe9c0] to-[#ffd993] rounded-3xl md:p-8 p-5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[220px]">
        {/* Underlying content (same layout) */}
        <div className="z-10 max-w-lg">
          <p className="text-yellow-950 font-semibold md:text-md text-sm tracking-wider mb-2 uppercase opacity-70 flex justify-between items-center">
            <span>Highest Earners of the Month <span className="text-gray-900">|</span> {data?.period_end}</span>
          </p>
          <h2 className="lg:text-4xl text-2xl font-bold text-gray-900 mb-3">
            N/A
          </h2>
          <p className="text-gray-800 text-sm mb-6 max-w-md leading-relaxed opacity-90">
            Outstanding performance this month with exceptional dedication and consistency.
          </p>

          <div className="flex items-center gap-4">
            <div className="md:w-28 md:h-28 w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 shadow-inner">
              <img src="/Images/trophy.png" alt="Trophy" className="md:w-16 md:h-16 w-14 h-14 object-contain" />
            </div>
            <div>
              <p className="text-gray-800 text-md font-medium opacity-80">Monthly Earnings</p>
              <p className="md:text-3xl text-2xl font-bold text-gray-900">
                ₹ 0
              </p>
            </div>
          </div>
        </div>

        {/* Image Circle Placeholder (same size) */}
        <div className="relative mt-6 md:mt-0">
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg border-4 border-white/30 bg-yellow-100">
            <img
              src="/Images/toper.png"
              alt="Placeholder"
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        </div>

        {/* Blur overlay to blur underlying content (covers full banner) */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-20 pointer-events-none"></div>

        {/* Centered message (not blurred) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto bg-white/95 px-6 py-4 rounded-xl shadow-lg z-30">
            <p className="text-gray-900 font-semibold text-lg md:text-xl">{responseMessage}</p>
            <p className="text-gray-700 text-sm mt-2 opacity-80">Check back soon for this month's top earner</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#ffe9c0] to-[#ffd993] rounded-3xl md:p-8 p-5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[220px]">
      <div className="z-10 max-w-lg">
        <p className="text-yellow-950 font-semibold md:text-md text-sm tracking-wider mb-2 uppercase opacity-70 flex justify-between items-center">
          <span>Highest Earners of the Month <span className="text-gray-900">|</span> {data.period_end}</span>
        </p>
        <h2 className="lg:text-4xl text-2xl font-bold text-gray-900 mb-3">
          {earner.name || "N/A"}
        </h2>
        <p className="text-gray-800 text-sm mb-6 max-w-md leading-relaxed opacity-90">
          Outstanding performance this month with exceptional dedication and
          consistency.
        </p>

        <div className="flex items-center gap-4">
          {/* Trophy Icon Placeholder */}
          <div className="md:w-28 md:h-28 w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 shadow-inner">
            <img src="/Images/trophy.png" alt="Trophy" className="md:w-16 md:h-16 w-14 h-14 object-contain" />
          </div>
          <div>
            <p className="text-gray-800 text-md font-medium opacity-80">Monthly Earnings</p>
            <p className="md:text-3xl text-2xl font-bold text-gray-900">
              ₹ {earner.amount?.toLocaleString() || "0"}
            </p>
          </div>
        </div>
      </div>

      {/* Image Circle with Border */}
      <div className="relative mt-6 md:mt-0">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg border-4 border-white/30">
          <img
            src={earner.profile_image || "/Images/toper.png"}
            alt={earner.name}
            // onError={(e) => (e.currentTarget.src = "/Images/toper.png")}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}