import { useQuery } from "@tanstack/react-query";
import { getCustomerStatistics } from "../../api/dashboard";
import { customerStatisticsKey } from "../../api/queryKeys";
import { useScheme } from "../../context/SchemeContext";

export default function StatsRow() {
  const { selectedSchemeId } = useScheme();
  const { data, isLoading } = useQuery({
    queryKey: customerStatisticsKey(selectedSchemeId),
    queryFn: () => getCustomerStatistics(selectedSchemeId),
  });



  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`space-y-2 ${i > 0 ? "md:border-l border-gray-100 md:pl-6" : ""}`}>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
      <div>
        <p className="text-lime-500 text-md font-medium">Total Customers</p>
        <p className="text-2xl md:font-bold font-semibold text-gray-800">
          {data?.totalCustomer ?? "--"}
        </p>
      </div>
      <div className="md:border-l border-gray-100 md:pl-6">
        <p className="text-lime-500 text-md font-medium">Collections</p>
        <p className="text-2xl md:font-bold font-semibold text-gray-800">
          {data?.collections ?? "--"}
        </p>
      </div>
      <div className="md:border-l border-gray-100 md:pl-6">
        <p className="text-lime-500 text-md font-medium">New Customers</p>
        <p className="text-2xl md:font-bold font-semibold text-gray-800">
          {data?.new_customers ?? "--"}
        </p>
      </div>
      <div className="md:border-l border-gray-100 md:pl-6">
        <p className="text-lime-500 text-md font-medium">Activities</p>
        <p className="text-2xl md:font-bold font-semibold text-gray-800">
          {data?.activities ?? "--"}
        </p>
      </div>
    </div>
  );
}
