import { UsersRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOverview } from "../../api/dashboard";
import { overviewKey } from "../../api/queryKeys";
import { useScheme } from "../../context/SchemeContext";

export default function Overview() {
    const { selectedSchemeId } = useScheme();
    const { data: overviewData, isLoading } = useQuery({
        queryKey: overviewKey(selectedSchemeId),
        queryFn: () => getOverview(selectedSchemeId),
    });



    if (isLoading) {
        return (
            <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 w-full max-w-sm animate-pulse">
                <h3 className="font-semibold text-gray-800 mb-4 h-5 bg-gray-200 rounded w-20"></h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between h-4 bg-gray-100 rounded"></div>
                    <div className="flex justify-between h-4 bg-gray-100 rounded"></div>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-lime-50 px-4 py-2 h-10 "></div>
            </div>
        );
    }

    const totalEarnings = parseFloat(overviewData?.total_earnings || "0").toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
    });

    const totalCollections = parseFloat(overviewData?.total_collection || "0").toLocaleString("en-IN", {
        minimumFractionDigits: 2,
    });

    const teamStrength = overviewData?.total_customer || 0;

    return (
        <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 w-full max-w-sm">
            {/* Title */}
            <h3 className="font-semibold text-gray-800 mb-4">Over View</h3>

            {/* Stats */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Total Earnings:</span>
                    <span className="font-semibold text-gray-800">{totalEarnings}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                    <span>Total Collections:</span>
                    <span className="font-semibold text-gray-800">{totalCollections}</span>
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

                <span className="font-semibold text-gray-800">{teamStrength}</span>
            </div>
        </div>
    );
};
