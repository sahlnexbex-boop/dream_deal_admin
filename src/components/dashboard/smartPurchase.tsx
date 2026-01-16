import { ChevronDown } from "lucide-react";

export default function SmartPurchasePlan() {
  return (
    <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 text-xl">
          Smart Purchase Plan
        </h3>
        <ChevronDown size={16} className="text-gray-400" />
      </div>
      <div className="bg-gray-50 rounded-full px-2 py-1 mb-4 w-fit">
        <p className="text-xs text-gray-500 font-medium text-center">
          01 Dec 2025 To 01 Aug 2027
        </p>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-gray-500 mb-1">Emi Done :</p>
          <p className="text-sm text-gray-500">Total Budget :</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-lime-500 mb-1">0/24</p>
          <p className="text-sm font-semibold text-gray-800">₹26000</p>
        </div>
      </div>
    </div>
  );
};