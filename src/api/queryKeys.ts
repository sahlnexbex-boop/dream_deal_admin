import type { QueryClient } from "@tanstack/react-query";

/** Profile summary query key. Use for useQuery, getQueryData, invalidateQueries. */
export const profileSummaryKey = () =>
  ["profile-summary"] as const;

/** Customer statistics query key. */
export const customerStatisticsKey = (schemeId?: number | null) =>
  ["customer-statistics", schemeId] as const;

/** Rewards query key. */
export const rewardsKey = () => ["rewards"] as const;

/** Levels query key. */
export const levelsKey = () => ["levels"] as const;

/** Payment graph query key. */
export const paymentGraphKey = (value: string, schemeId?: number | null) =>
  ["payment-graph", value, schemeId] as const;

/** Highest earners Month query key. */
export const highestEarnersMonthKey = () => ["highest-earners-month"] as const;

/** Highest earners Week query key. */
export const highestEarnersWeekKey = () => ["highest-earners-week"] as const;

/** Overview query key. */
export const overviewKey = (schemeId?: number | null) => ["overview", schemeId] as const;



/** Smart Plans query key. */
export const smartPlansKey = () => ["smart-plans"] as const;

/** Notifications query key. */
export const notificationsKey = () => ["notifications"] as const;

/** Assigned Schemes query key. */
export const assignedSchemesKey = () => ["assigned-schemes"] as const;

/** Current Scheme Details query key. */
export const currentSchemeDetailsKey = (schemeId?: number | null) => ["current-scheme-details", schemeId] as const;

/** Withdrawal Schemes query key. */
export const schemesKey = () => ["schemes"] as const;

/** Wallet Balances query key. */
export const walletBalancesKey = () => ["wallet-balances"] as const;


/**
 * Invalidate profile summary cache so it auto-refetches.
 * Call after mutations that change profile data (e.g. verify, withdraw, profile update).
 */
export function invalidateProfileSummary(
  queryClient: QueryClient
): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: profileSummaryKey() });
}

/**
 * Invalidate rewards cache so it auto-refetches.
 * Call after mutations that change rewards data (e.g. customer count updates, reward achievements).
 */
export function invalidateRewards(
  queryClient: QueryClient
): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: rewardsKey() });
}
