import { useQuery } from "@tanstack/react-query";
import { getCurrentSchemeDetails } from "../../api/dashboard";
import { currentSchemeDetailsKey } from "../../api/queryKeys";
import { useScheme } from "../../context/SchemeContext";

export default function SmartPurchasePlan() {
  const { selectedSchemeId } = useScheme();
  const { data: schemeData, isLoading } = useQuery({
    queryKey: currentSchemeDetailsKey(selectedSchemeId),
    queryFn: () => getCurrentSchemeDetails(selectedSchemeId),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-6 w-32 bg-gray-100 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-100 rounded"></div>
          <div className="h-4 w-24 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  const details = schemeData?.scheme_details;

  if (!details) {
    return (
      <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm">No active plan found</p>
      </div>
    );
  }

  const dateRange = `${details.start_date} To ${details.end_date}`;

  // Assuming duration is the total number of installments
  const emiDone = `${details.installment_done}/${details.duration}`;
  const totalBudget = `₹${parseFloat(details.total_amount).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 text-xl">
          {details.scheme_name}
        </h3>
      </div>

      {/* Plan Details */}
      <div className="bg-gray-50 rounded-full px-2 py-1 mb-4 w-fit">
        <p className="text-xs text-gray-500 font-medium text-center">
          {dateRange}
        </p>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-gray-500 mb-1">Emi Done :</p>
          <p className="text-sm text-gray-500">Total Budget :</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-lime-500 mb-1">
            {emiDone}
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {totalBudget}
          </p>
        </div>
      </div>
    </div>
  );
}
