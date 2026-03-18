import { useEffect, useState } from "react";
import { X, ChevronDown, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getWithdrawalSchemes, getWalletBalances, submitWithdrawalRequest, getProfileSummary } from "../../api/dashboard";
import { schemesKey, walletBalancesKey, profileSummaryKey } from "../../api/queryKeys";
import { EncryptData } from "../../hooks/crypto";
import { OLD_PORTAL_URL } from "../../utils/oldPortal";
import { useToast } from "../Toast";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WithdrawModal({ open, onClose }: WithdrawModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Form state
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [isSchemeDropdownOpen, setIsSchemeDropdownOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch withdrawal schemes (new API)
  const { data: withdrawalSchemes, isLoading: schemesLoading } = useQuery({
    queryKey: schemesKey(),
    queryFn: getWithdrawalSchemes,
    enabled: open,
  });

  const { data: profileData } = useQuery({
    queryKey: profileSummaryKey(),
    queryFn: getProfileSummary,
    enabled: open,
  });

  const storedUserId = localStorage.getItem("user_id");
  const encryptedUserId = storedUserId
    ? encodeURIComponent(EncryptData(storedUserId))
    : "";

  const kycStatus = profileData?.personal_details?.kyc_status?.toLowerCase() || "";
  const showBankNotice = kycStatus === "not submitted" || kycStatus === "not_submitted";

  // Fetch real wallet balances
  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: walletBalancesKey(),
    queryFn: getWalletBalances,
    enabled: open,
  });

  const walletBalances = walletData?.wallet_balances ?? [];
  const totalBalance = walletData?.wallet_balance ?? 0;

  // Animation lifecycle
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setSelectedScheme(null);
      setAmount("");
      setRemarks("");
      setIsSchemeDropdownOpen(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedScheme || !amount.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await submitWithdrawalRequest({
        scheme_id: selectedScheme.scheme_id,
        withdraw_amount: parseFloat(amount),
        remark: remarks.trim(),
      });

      // Check for success/error based on status field in response body
      if (res?.status === 200 || res?.status === 201 || !res?.status) {
        const successMsg = res?.message || "Withdraw request created successfully";
        toast(successMsg, "success");
        onClose();
      } else {
        // Handle custom error status in successful HTTP response
        const errorMsg = res?.message || "Withdrawal request failed";
        toast(errorMsg, "error");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        "Withdrawal request failed. Please try again.";
      toast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = () => {
    if (!isSubmitting) onClose();
  };

  if (!open && !isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleOverlayClick}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out
          ${isAnimating ? "opacity-100" : "opacity-0"}
          ${!isVisible ? "pointer-events-none" : ""}`}
      />

      {/* Modal Container */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none
          ${isVisible ? "" : "pointer-events-none"}`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-white rounded-2xl shadow-2xl w-full max-w-3xl pointer-events-auto
            flex flex-col max-h-[90dvh]
            transform transition-all duration-300 ease-out overflow-hidden
            ${isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
        >
          {/* Header — always visible */}
          <div className="flex-shrink-0 flex items-center justify-between md:px-7 px-4 md:pt-7 pt-4 md:pb-5 pb-3 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Withdrawal request</h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body — scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain md:px-7 px-4 md:pb-4 pb-2">

            {/* Row: Plan + Amount + Remarks */}
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-2 md:mt-5 mt-4 mb-5">
              {/* Smart Purchase Plan Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Smart Purchase Plan
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSchemeDropdownOpen((v) => !v)}
                    className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm transition-colors focus:outline-none
                      ${isSchemeDropdownOpen
                        ? "border-lime-400 bg-lime-50/40"
                        : "border-gray-200 bg-white hover:border-lime-300"
                      }`}
                  >
                    <span className={selectedScheme ? "text-gray-800 font-medium" : "text-gray-400"}>
                      {selectedScheme ? selectedScheme.scheme_name : "Choose Scheme"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${isSchemeDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown list */}
                  {isSchemeDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-10 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                      {schemesLoading ? (
                        <div className="px-4 py-3 text-sm text-gray-400">Loading plans...</div>
                      ) : withdrawalSchemes && withdrawalSchemes.length > 0 ? (
                        withdrawalSchemes.map((scheme: any) => (
                          <button
                            key={scheme.scheme_id}
                            type="button"
                            onClick={() => {
                              setSelectedScheme(scheme);
                              setIsSchemeDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors focus:outline-none border-b border-gray-50 last:border-b-0
                              ${selectedScheme?.scheme_id === scheme.scheme_id
                                ? "bg-lime-50 text-lime-700 font-medium"
                                : "text-gray-700 hover:bg-lime-50/60 hover:text-lime-700"
                              }`}
                          >
                            {scheme.scheme_name}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-400">No plans available</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400
                    focus:outline-none focus:border-lime-400 focus:bg-lime-50/30 transition-colors bg-white"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remarks
                </label>
                <input
                  type="text"
                  placeholder="Enter remarks (optional)"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400
                    focus:outline-none focus:border-lime-400 focus:bg-lime-50/30 transition-colors bg-white"
                />
              </div>
            </div>

            {/* Bank account notice */}
            {showBankNotice && (
              <div className="bg-gray-100 w-full rounded-xl px-4 py-2 flex flex-wrap sm:justify-between sm:items-center items-stretch justify-end mb-5 gap-2">
                <p className="text-gray-700 text-sm">Please update your bank account details</p>
                <button
                  type="button"
                  onClick={() => {
                    const schemeId = localStorage.getItem("scheme_id") || "";
                    if (encryptedUserId) {
                      window.location.href = `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/profile&current_scheme_id=${schemeId}`;
                    }
                  }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-lime-600 rounded-xl hover:bg-lime-700 transition-colors focus:outline-none"
                >
                  Go to Profile
                </button>
              </div>
            )}


            {/* Wallet Details Table */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Wallet size={16} className="text-lime-600" />
                <h3 className="text-sm font-bold text-gray-800 tracking-wide">Wallet Details</h3>
              </div>

              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-2/3">
                        Scheme
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletLoading ? (
                      <>
                        {[1, 2].map((i) => (
                          <tr key={i} className="border-b border-gray-50 animate-pulse">
                            <td className="px-5 py-3">
                              <div className="h-4 bg-gray-100 rounded w-32" />
                            </td>
                            <td className="px-5 py-3">
                              <div className="h-4 bg-gray-100 rounded w-20" />
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : walletBalances.length > 0 ? (
                      walletBalances.map((row) => (
                        <tr
                          key={row.promoter_wallet_master_id}
                          className="border-b border-gray-50 last:border-b-0 hover:bg-lime-50/40 transition-colors"
                        >
                          <td className="px-5 py-3 text-gray-700 font-medium">{row.scheme_name}</td>
                          <td className="px-5 py-3 text-gray-600">
                            {parseFloat(row.balance).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-5 py-4 text-sm text-gray-400 text-center">
                          No wallet data available
                        </td>
                      </tr>
                    )}

                    {/* Total row */}
                    {!walletLoading && (
                      <tr className="bg-lime-50/60 border-t border-lime-100">
                        <td className="px-5 py-3 text-gray-900 font-bold text-sm">TOTAL</td>
                        <td className="px-5 py-3 text-gray-900 font-bold text-sm">
                          {totalBalance.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>



          {/* Footer — always visible */}
          <div className="flex-shrink-0 flex items-center justify-end gap-3 md:px-7 px-4 md:py-5 py-4 border-t border-gray-100 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-700
                hover:bg-gray-50 transition-colors focus:outline-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedScheme || !amount.trim()}
              className="px-8 py-2.5 rounded-full bg-lime-400 hover:bg-lime-500 text-gray-900 text-sm font-bold
                transition-colors focus:outline-none shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
