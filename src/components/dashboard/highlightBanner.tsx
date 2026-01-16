// import { Trophy } from "lucide-react";

export default function HighlightBanner() {
  return (
    <div className="bg-gradient-to-r from-[#ffe9c0] to-[#ffd993] rounded-3xl md:p-8 p-5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[220px]">
      <div className="z-10 max-w-lg">
        <p className="text-yellow-500 font-semibold md:text-md text-sm tracking-wider mb-2 uppercase">
          Highest Earners of the Month
        </p>
        <h2 className="lg:text-4xl text-2xl font-bold text-gray-900 mb-3">
          James Elizabeth
        </h2>
        <p className="text-gray-800 text-sm mb-6 max-w-md leading-relaxed">
          Outstanding performance this week with exceptional dedication and
          consistency.
        </p>

        <div className="flex items-center gap-4">
          {/* Trophy Icon Placeholder */}
          <div className="w-28 h-28 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
            <img src="/Images/trophy.png" alt="Trophy" />
          </div>
          <div>
            <p className="text-gray-700 text-md font-medium">Weekly Earnings</p>
            <p className="text-3xl font-bold text-gray-900">₹ 84,500</p>
          </div>
        </div>
      </div>

      {/* Image Circle with Border */}
      <div className="relative mt-6 md:mt-0">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg">
          <img
            src="/Images/toper.png"
            alt="James Elizabeth"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};