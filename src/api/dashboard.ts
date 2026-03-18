import { api } from "./lib/axios";

// 1. Profile Summary
export const getProfileSummary = async () => {
  const res = await api.get("/api/profile-summary");
  return res.data.data;
};

// 2. Customer Statistics
export const getCustomerStatistics = async (schemeId?: number | null) => {
  const res = await api.get("/api/customer-statistics", {
    headers: schemeId ? { "scheme-id": schemeId.toString() } : undefined,
  });
  return res.data.data;
};

// 3. Levels
export const getLevels = async () => {
  const res = await api.get("/api/levels");
  return res.data.data;
};

// 4. Rewards
export const getRewards = async () => {
  const res = await api.get("/api/rewards");
  return res.data.data;
};

// 5. Payment Graph
export const getPaymentGraph = async (value: string, schemeId?: number | null) => {
  const res = await api.post("/api/payment-graph", {
    duration: "date_range", // Fixed as per requirement/image
    value: value,
  }, {
    headers: schemeId ? { "scheme-id": schemeId.toString() } : undefined,
  });
  return res.data.data;
};

// 6. Highest Earners
export const getHighestEarnersMonth = async () => {
  const res = await api.get("/api/highest-earners-month");
  return res.data.data;
};

export const getHighestEarnersWeek = async () => {
  const res = await api.get("/api/highest-earners-week");
  return res.data.data;
};

// 7. Overview
export const getOverview = async (schemeId?: number | null) => {
  const res = await api.get("/api/overview", {
    headers: schemeId ? { "scheme-id": schemeId.toString() } : undefined,
  });
  return res.data.data;
};

// 8. Smart Purchase Plans
export const getSmartPlans = async () => {
  const res = await api.get("/api/standard-plan");
  return res.data.data;
};

// 9. Notifications
export const getNotifications = async () => {
  const res = await api.get("/api/notifications");
  return res.data.data;
};

// 10. Assigned Schemes
export const getAssignedSchemes = async () => {
  const res = await api.get("/api/assigned-schemes");
  return res.data.data;
};

// 11. Current Scheme Details
export const getCurrentSchemeDetails = async (schemeId?: number | null) => {
  const res = await api.get("/api/current-scheme-details", {
    headers: schemeId ? { "scheme-id": schemeId.toString() } : undefined,
  });
  return res.data.data;
};

// 12. Wallet Balances
export const getWalletBalances = async () => {
  const res = await api.get("/api/wallet-balances");
  return res.data.data as {
    wallet_balances: {
      promoter_wallet_master_id: number;
      scheme_id: number;
      balance: string;
      total_earned: string;
      scheme_name: string;
    }[];
    wallet_balance: number;
  };
};

// 13. Submit Withdrawal Request
export const submitWithdrawalRequest = async (payload: {
  scheme_id: number;
  withdraw_amount: number;
  remark: string;
}) => {
  const res = await api.post("/api/withdrawal-req", payload);
  return res.data;
};

// 14. Withdrawal Schemes
export const getWithdrawalSchemes = async () => {
  const res = await api.get("/api/schemes");
  return res.data.data;
};
