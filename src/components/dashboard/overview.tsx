import { UsersRound } from "lucide-react";

export default function Overview() {
  return (
    <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 w-full max-w-sm">
      {/* Title */}
      <h3 className="font-semibold text-gray-800 mb-4">Over View</h3>

      {/* Stats */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Total Earnings:</span>
          <span className="font-semibold text-gray-800">₹3,885.50</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Total Collections:</span>
          <span className="font-semibold text-gray-800">22</span>
        </div>
      </div>

      {/* Highlight Row */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-lime-50 px-4 py-2">
        <div className="flex items-center gap-2 text-lime-600 text-sm font-medium">
          {/* <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-lime-100"> */}
          <UsersRound size={16} />
          {/* </span> */}
          Team Strength
        </div>

        <span className="font-semibold text-gray-800">32</span>
      </div>
    </div>
  );
};