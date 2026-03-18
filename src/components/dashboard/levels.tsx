import { Crown, Users, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getLevels } from "../../api/dashboard";
import { levelsKey } from "../../api/queryKeys";

export default function Levels() {
  const { data: levelsData, isLoading } = useQuery({
    queryKey: levelsKey(),
    queryFn: getLevels,
  });

  if (isLoading) {
    return (
      // skeleton
      <div className="bg-gradient-to-b from-[#fffffe] to-[#fcfff0d2] rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg text-gray-800 mb-6">Level</h3>

        <div className="relative pl-2 animate-pulse">
          <div className="absolute left-[9px] top-2 bottom-10 w-[2px] bg-lime-100 z-0"></div>

          <div className="space-y-6 relative z-10">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-lime-200 border-2 border-white shadow-sm mt-1 shrink-0"></div>

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-lime-200 rounded"></div>
                  <div className="h-5 w-20 bg-lime-100 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const levels = levelsData?.map((lvl: any) => ({
    title: lvl.name,
    sub: `${lvl.total_customer} Customers`,
    active: lvl.status === "active",
  })) || [];

  return (
    <div className="bg-gradient-to-b from-[#fffffe] to-[#fcfff0d2] rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 relative overflow-hidden">
      <h3 className="font-semibold text-lg text-gray-800 mb-6">Levels</h3>

      <div className="relative pl-2">
        {/* Blur Overlay */}
        <div className="absolute inset-x-0 -inset-y-4 z-20 backdrop-blur-[2px] bg-white/30 flex items-center justify-center rounded-2xl">
          {/* <div className="bg-white/80 px-4 py-2 rounded-full border border-lime-100 shadow-sm">
            <p className="text-lime-600 font-bold text-xs tracking-wider uppercase">Currently Unavailable</p>
          </div> */}
        </div>

        {/* Scrollable Container for Desktop - Max 4 visible, then scroll */}
        <div className="hidden md:block max-h-[280px] overflow-y-auto no-scrollbar pr-2 opacity-40">
          <div className="relative">
            <div className="absolute left-[9px] top-2 bottom-10 w-[2px] bg-lime-100 z-0"></div>
            <div className="absolute left-[9px] top-2 h-[75px] w-[2px] bg-lime-500 z-0"></div>

            <div className="space-y-6 relative z-10">
              {levels.map((lvl: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm mt-1 shrink-0 ${lvl.active
                      ? "bg-lime-500"
                      : idx === levels.length - 1
                        ? "bg-transparent text-lime-500"
                        : "bg-lime-100"
                      }`}
                  >
                    {lvl.active && (
                      <Check size={10} className="text-white m-auto" />
                    )}
                    {idx === levels.length - 1 && (
                      // <div className="text-[10px] -mt-1 -ml-0.5">
                      <Crown size={12} />
                      // </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{lvl.title}</p>
                    <span className="inline-flex items-center gap-1 bg-lime-50 text-lime-700 text-[10px] px-2 py-0.5 rounded-full border border-lime-100 mt-1">
                      <Users size={8} /> {lvl.sub}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View - No Scrolling */}
        <div className="md:hidden relative opacity-40">
          <div className="absolute left-[9px] top-2 bottom-10 w-[2px] bg-lime-100 z-0"></div>
          <div className="absolute left-[9px] top-2 h-[75px] w-[2px] bg-lime-500 z-0"></div>

          <div className="space-y-6 relative z-10">
            {levels.map((lvl: any, idx: number) => (
              <div key={idx} className="flex items-start gap-4">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm mt-1 shrink-0 ${lvl.active
                    ? "bg-lime-500"
                    : idx === levels.length - 1
                      ? "bg-transparent text-lime-500"
                      : "bg-lime-100"
                    }`}
                >
                  {lvl.active && (
                    <Check size={10} className="text-white m-auto" />
                  )}
                  {idx === levels.length - 1 && (
                    // <div className="text-[10px] -mt-1 -ml-0.5">
                    <Crown size={12} />
                    // </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{lvl.title}</p>
                  <span className="inline-flex items-center gap-1 bg-lime-50 text-lime-700 text-[10px] px-2 py-0.5 rounded-full border border-lime-100 mt-1">
                    <Users size={8} /> {lvl.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};