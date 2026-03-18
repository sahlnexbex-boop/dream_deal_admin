import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPaymentGraph } from "../../api/dashboard";
import { paymentGraphKey } from "../../api/queryKeys";
import { useScheme } from "../../context/SchemeContext";

// Days options
const daysOptions = [
    { id: 7, label: "Last 7 Days" },
    { id: 15, label: "Last 15 Days" },
    { id: 30, label: "Last 30 Days" },
];

const getDateRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const formatDate = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    return `${formatDate(start)} to ${formatDate(end)}`;
};

export default function PaymentChart() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDays, setSelectedDays] = useState(7);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const dateRange = getDateRange(selectedDays);

    const { selectedSchemeId } = useScheme();
    const { data, isLoading } = useQuery({
        queryKey: paymentGraphKey(dateRange, selectedSchemeId),
        queryFn: () => getPaymentGraph(dateRange, selectedSchemeId),
    });



    const selectedOption =
        daysOptions.find((opt) => opt.id === selectedDays) || daysOptions[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleDaysSelect = (days: number) => {
        setSelectedDays(days);
        setIsDropdownOpen(false);
    };

    const total = data?.total || 0;
    const success = data?.success || 0;
    const pending = data?.pending || 0;

    // Calculate percentages safely
    const successPercent = total > 0 ? Math.round((success / total) * 100) : 0;
    const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;

    if (isLoading) {
        return (
            <div className="md:col-span-2 bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 flex flex-col justify-between animate-pulse">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>
                <div className="relative w-40 h-40 mx-auto">
                    <div className="w-full h-full rounded-full bg-gray-200 border-8 border-gray-100"></div>
                    <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center z-10">
                        <div className="h-3 w-10 bg-gray-200 rounded mb-1"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="flex justify-center gap-4 mt-6">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="md:col-span-2 bg-white rounded-3xl md:p-6 p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4 relative">
                <h3 className="font-semibold text-gray-700">Payment</h3>
                <div ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-between gap-2 text-xs border border-gray-200 px-4 py-0.5 rounded-full text-gray-500 cursor-pointer hover:border-lime-500 hover:text-lime-600 transition-colors focus:outline-none bg-white"
                    >
                        <span>{selectedOption.label}</span>
                        <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-200 opacity-100 min-w-[150px]">
                            <div className="overflow-hidden">
                                {daysOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleDaysSelect(option.id)}
                                        className={`w-full px-4 py-3 text-left transition-colors border-b border-gray-50 hover:border-lime-500 last:border-b-0 flex items-center justify-between group focus:outline-none text-xs rounded-xl ${selectedDays === option.id
                                            ? "bg-lime-50 text-gray-800"
                                            : "bg-white text-gray-700 hover:bg-lime-50/50"
                                            }`}
                                        style={{
                                            WebkitAppearance: "none",
                                            appearance: "none",
                                        }}
                                    >
                                        <span
                                            className={`${selectedDays === option.id
                                                ? "text-gray-800 font-medium"
                                                : "text-gray-700 group-hover:text-lime-600"
                                                }`}
                                        >
                                            {option.label}
                                        </span>
                                        {selectedDays === option.id && (
                                            <Check
                                                size={14}
                                                className="text-lime-600 flex-shrink-0 ml-2"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative w-40 h-40 mx-auto">
                {/* CSS Donut Chart using conic-gradient */}
                <div
                    className="w-full h-full rounded-full"
                    style={{
                        background: `conic-gradient(#facc15 0% ${pendingPercent}%, #a3e635 ${pendingPercent}% 100%)`,
                    }}
                ></div>
                {/* Inner White Circle */}
                <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center z-10">
                    <span className="text-gray-500 text-[10px] font-medium uppercase">
                        Total
                    </span>
                    <span className="text-gray-900 font-bold text-sm">{total}</span>
                </div>
                {/* Labels on Chart (Simulated via absolute positioning for the image look) */}
                {total > 0 && (
                    <>
                        {pendingPercent > 0 && <div className="absolute top-4 right-6 text-sm text-white font-semibold drop-shadow-md">
                            {pendingPercent}%
                        </div>}
                        {successPercent > 0 && <div className="absolute bottom-4 left-7 text-sm text-white font-semibold drop-shadow-md">
                            {successPercent}%
                        </div>}
                    </>
                )}
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-lime-500 rounded-sm"></div>
                    <span className="text-[10px] text-gray-500 font-medium">
                        Success {success}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                    <span className="text-[10px] text-gray-500 font-medium">
                        Pending {pending}
                    </span>
                </div>
            </div>
        </div>
    );
};
