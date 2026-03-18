import {
  Check,
  Crown,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRewards } from "../../api/dashboard";
import { rewardsKey } from "../../api/queryKeys";



export default function Rewards() {
  const { data: rewards, isLoading } = useQuery({
    queryKey: rewardsKey(),
    queryFn: getRewards,
  });

  if (isLoading) {
    return (
      // skeleton
      <div className="bg-gradient-to-b from-[#fffbf5] to-[#fff9ee] rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-6 text-lg">Rewards</h3>
        <div className="relative pl-2 animate-pulse">
          <div className="absolute left-[20px] top-2 bottom-6 w-[2px] bg-orange-100 z-0"></div>

          <div className="space-y-4 relative z-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-200 shrink-0 border-2 border-white shadow-sm"></div>
                <div className="flex-1 flex items-center justify-between p-3 rounded-xl bg-orange-50">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-orange-200 rounded-lg shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-orange-200 rounded"></div>
                      <div className="h-3 w-16 bg-orange-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const steps = rewards?.map((reward: any) => ({
    image: reward.image,
    title: reward.name,
    sub: `${reward.total_customer} Customers`,
    active: reward.status === "achieved",
    color: reward.status === "achieved" ? "bg-orange-400" : "bg-orange-100",
  })) || [];

  return (
    <div className="bg-gradient-to-b from-[#fffbf5] to-[#fff9ee] rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 relative overflow-hidden">
      <h3 className="font-semibold text-gray-800 mb-6 text-lg">Rewards</h3>

      <div className="relative pl-2">
        {/* Blur Overlay */}
        <div className="absolute inset-x-0 -inset-y-4 z-20 backdrop-blur-[2px] bg-white/30 flex items-center justify-center rounded-2xl">
          {/* <div className="bg-white/80 px-4 py-2 rounded-full border border-orange-100 shadow-sm">
            <p className="text-orange-600 font-bold text-xs tracking-wider uppercase">Currently Unavailable</p>
          </div> */}
        </div>

        {/* Scrollable Container for Desktop */}
        <div className="hidden md:block max-h-[400px] overflow-y-auto no-scrollbar pr-2 opacity-40">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-2 bottom-6 w-[2px] bg-orange-100 z-0"></div>
            {/* Active Line Segment overlay */}
            <div className="absolute left-[11px] top-2 h-[100px] w-[2px] bg-orange-400 z-0"></div>

            <div className="space-y-4 relative z-10">
              {steps.map((step: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ${step.active
                      ? "bg-orange-400 text-white"
                      : "bg-orange-100 text-orange-300"
                      }`}
                  >
                    {step.active && <Check size={16} className="absolute text-white" />}
                    {!step.active && idx === steps.length - 1 && (
                      <div className="absolute text-yellow-400">
                        <Crown size={16} />
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div
                    className={`flex-1 flex items-center justify-between p-3 rounded-xl ${step.active
                      ? "bg-gradient-to-r from-orange-300 to-orange-200"
                      : "bg-orange-100"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-gray-800 opacity-80">
                        <img src={step.image} alt="" className="w-10 h-10 object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {step.title}
                        </p>
                        <p
                          className={`text-[10px] mt-1 text-gray-600 flex items-center gap-1 leading-none rounded-full px-1.5 py-0.5 ${step.active
                            ? "bg-orange-50/40"
                            : "bg-orange-200/60"
                            }`}
                        >
                          <Users size={8} /> {step.sub}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center bg-white ${step.active ? "text-orange-400" : "hidden"
                        }`}
                    >
                      <Check size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View - No Scrolling */}
        <div className="md:hidden relative opacity-40">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-2 bottom-6 w-[2px] bg-orange-100 z-0"></div>
          {/* Active Line Segment overlay */}
          <div className="absolute left-[11px] top-2 h-[100px] w-[2px] bg-orange-400 z-0"></div>

          <div className="space-y-4 relative z-10">
            {steps.map((step: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ${step.active
                    ? "bg-orange-400 text-white"
                    : "bg-orange-100 text-orange-300"
                    }`}
                >
                  {step.active && <Check size={16} className="absolute text-white" />}
                  {!step.active && idx === steps.length - 1 && (
                    <div className="absolute text-yellow-400">
                      <Crown size={16} />
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div
                  className={`flex-1 flex items-center justify-between p-3 rounded-xl ${step.active
                    ? "bg-gradient-to-r from-orange-300 to-orange-200"
                    : "bg-orange-100"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-800 opacity-80">
                      <img src={step.image} alt="" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {step.title}
                      </p>
                      <p
                        className={`text-[10px] mt-1 text-gray-600 flex items-center gap-1 leading-none rounded-full px-1.5 py-0.5 ${step.active
                          ? "bg-orange-50/40"
                          : "bg-orange-200/60"
                          }`}
                      >
                        <Users size={8} /> {step.sub}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center bg-white ${step.active ? "text-orange-400" : "hidden"
                      }`}
                  >
                    <Check size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
