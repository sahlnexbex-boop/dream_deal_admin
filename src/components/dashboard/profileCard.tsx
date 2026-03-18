import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, MapPin, Star, Info } from "lucide-react";
import IdCardModal from "./idCardModal";
import WithdrawModal from "./withdrawModal";
import ProfileCardSkeleton from "../skeltons/profilecard";
import { getProfileSummary } from "../../api/dashboard";
import {
    profileSummaryKey,
    invalidateProfileSummary,
} from "../../api/queryKeys";

export default function ProfileCard() {
    const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: profileSummaryKey(),
        queryFn: () => getProfileSummary(),
        refetchOnWindowFocus: true,
    });

    /** Call after mutations that change profile (e.g. verify, withdraw). Triggers auto refetch. */
    const invalidateProfile = () => {
        invalidateProfileSummary(queryClient);
    };

    // Helper function to format amounts to 1 decimal place
    const formatAmount = (amount: number | string): string => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return num.toFixed(1);
    };

    // Helper function to get status badge colors
    const getStatusColor = (status: string, _type: 'agreement' | 'kyc') => {
        const statusLower = status.toLowerCase();

        if (statusLower === 'completed' || statusLower === 'approved') {
            return {
                bg: 'bg-green-50',
                text: 'text-green-600',
                border: 'border-green-100'
            };
        } else if (statusLower === 'pending') {
            return {
                bg: 'bg-red-50',
                text: 'text-red-600',
                border: 'border-red-100'
            };
        } else if (statusLower === 'not submitted' || statusLower === 'not_submitted') {
            return {
                bg: 'bg-yellow-50',
                text: 'text-yellow-600',
                border: 'border-yellow-100'
            };
        } else {
            // Default fallback
            return {
                bg: 'bg-gray-50',
                text: 'text-gray-600',
                border: 'border-gray-100'
            };
        }
    };

    if (isLoading) return <ProfileCardSkeleton />;

    const p = data.personal_details;

    return (
        <div className="bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 relative overflow-hidden">
            {/* Top Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:mb-8 mb-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img
                            src={p.image || "/Images/placeholder-image.png"}
                            alt="Profile"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/Images/placeholder-image.png";
                            }}
                            className="md:w-32 md:h-32 w-28 h-28 rounded-full object-cover border border-white shadow-md"
                        />
                        <span className="absolute bottom-0 right-0 bg-lime-500 text-white md:text-[10px] text-[8px] md:px-2 px-1 py-0.5 rounded-full font-bold border-2 border-white">
                            Active
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-xs mb-1 text-lime-500">
                            <MapPin size={12} />
                            <span>{p.place}</span>
                        </div>
                        <h2 className="md:text-2xl text-xl font-bold text-gray-800">
                            {p.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-gray-400 text-xs">#{p.user_id}</span>

                            {p.agreement_status && (
                                <span className={`flex items-center gap-1 ${getStatusColor(p.agreement_status, 'agreement').bg} ${getStatusColor(p.agreement_status, 'agreement').text} px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(p.agreement_status, 'agreement').border}`}>
                                    <Info size={10} /> Agreement {p.agreement_status}
                                </span>
                            )}

                            {p.kyc_status && (
                                <span className={`flex items-center gap-1 ${getStatusColor(p.kyc_status, 'kyc').bg} ${getStatusColor(p.kyc_status, 'kyc').text} px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(p.kyc_status, 'kyc').border}`}>
                                    <Info size={10} /> KYC {p.kyc_status}
                                </span>
                            )}
                        </div>
                        <div className="mt-2">
                            <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full border border-yellow-100 font-medium w-fit">
                                <Star size={10} />
                                <span>Promoting Partner</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex md:flex-col flex-wrap md:items-end gap-2 w-full md:w-auto">
                    <button
                        onClick={() => setIsIdCardModalOpen(true)}
                        className="flex items-center gap-1 focus:outline-none text-lime-600 text-xs font-semibold bg-lime-50 px-3 py-1.5 rounded-full hover:bg-lime-100 transition hover:border-lime-500"
                    >
                        View ID Card <ArrowUpRight size={12} />
                    </button>
                    <div className="text-right">
                        <div className="text-3xl font-medium text-gray-800">
                            ₹{formatAmount(data.total_wallet)}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium text-sm px-10 tracking-wide py-2 mt-2 rounded-full shadow-sm transition w-full md:w-auto hover:border-lime-600"
                    >
                        Withdraw
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 md:gap-6 gap-2 pt-2 ">
                <div className="flex flex-col items-center">
                    <p className="text-lime-500 md:text-md text-[11px] font-medium mb-1 text-start">
                        Total Income
                    </p>
                    <p className="md:text-3xl text-lg font-semibold text-gray-800">
                        ₹{formatAmount(data.total_income)}
                    </p>
                </div>
                <div className="border-l border-gray-100 md:pl-6 pl-2 flex flex-col items-center">
                    <p className="text-lime-500 md:text-md text-[11px] font-medium mb-1">
                        Direct Income
                    </p>
                    <p className="md:text-3xl text-lg font-semibold text-gray-800">
                        ₹{formatAmount(data.direct_income)}
                    </p>
                </div>
                <div className="border-l border-gray-100 md:pl-6 pl-2 flex flex-col items-center">
                    <p className="text-lime-500 md:text-md text-[11px] font-medium mb-1">
                        Passive Income
                    </p>
                    <p className="md:text-3xl text-lg font-semibold text-gray-800">
                        ₹{formatAmount(data.passive_income)}
                    </p>
                </div>
            </div>

            <IdCardModal
                open={isIdCardModalOpen}
                onClose={() => setIsIdCardModalOpen(false)}
            />
            <WithdrawModal
                open={isWithdrawModalOpen}
                onClose={() => {
                    setIsWithdrawModalOpen(false);
                    invalidateProfile();
                }}
            />
        </div>
    );
}
