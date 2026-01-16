import { ChevronDown } from "lucide-react";

export default function PaymentChart() {
  return (
    <div className="md:col-span-2 bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Payment</h3>
        <div className="flex items-center justify-between gap-2 text-xs border border-gray-200 px-4 py-0.5 rounded-full text-gray-500 cursor-pointer">
          <span>Last 7 Days</span>
          <ChevronDown size={14} />
        </div>
      </div>

      <div className="relative w-40 h-40 mx-auto">
        {/* CSS Donut Chart using conic-gradient */}
        <div
          className="w-full h-full rounded-full"
          style={{
            background: "conic-gradient(#facc15 0% 20%, #a3e635 16% 100%)",
          }}
        ></div>
        {/* Inner White Circle */}
        <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center z-10">
          <span className="text-gray-500 text-[10px] font-medium uppercase">
            Total
          </span>
          <span className="text-gray-900 font-bold text-sm">3,56,146</span>
        </div>
        {/* Labels on Chart (Simulated via absolute positioning for the image look) */}
        <div className="absolute top-4 right-6 text-sm text-white font-semibold">
          16%
        </div>
        <div className="absolute bottom-4 left-7 text-sm text-white font-semibold">
          84%
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-lime-500 rounded-sm"></div>
          <span className="text-[10px] text-gray-500 font-medium">
            Success 2,99,163
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
          <span className="text-[10px] text-gray-500 font-medium">
            Pending 56,983.36
          </span>
        </div>
      </div>
    </div>
  );
};