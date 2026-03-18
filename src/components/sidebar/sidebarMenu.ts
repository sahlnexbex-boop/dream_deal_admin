import {
  LayoutDashboard,
  Users,
  User,
  Layers,
  CreditCard,
  Key,
  BookmarkPlus,
  History,
} from "lucide-react";
import { EncryptData } from "../../hooks/crypto";
import { OLD_PORTAL_URL } from "../../utils/oldPortal";

export const getSidebarMenu = (schemeId: string) => {
  const userId = localStorage.getItem("user_id") || "";
  const encryptedUserId = userId ? EncryptData(userId) : "";

  return [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    {
      name: "Sub Promoters",
      path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/sub-promoters&current_scheme_id=${schemeId}`,
      icon: User,
    },
    { name: "My Customers", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/my-customers&current_scheme_id=${schemeId}`, icon: Users },
    {
      name: "Affiliate Marketing",
      path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/affiliate-marketing-level&current_scheme_id=${schemeId}`,
      icon: Layers,
    },
    {
      name: "Payments",
      path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/payments&current_scheme_id=${schemeId}`,
      icon: CreditCard,
      children: [
        { name: "All Payments", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/payments&current_scheme_id=${schemeId}` },
        { name: "Repayment Pins", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/repayment-pins&current_scheme_id=${schemeId}` },
        { name: "Repayment History", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/repayment-pin-history&current_scheme_id=${schemeId}` },
      ]
    },
    {
      name: "Requests", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/my-pin-requests&current_scheme_id=${schemeId}`, icon: Key,
      children: [
        { name: "My Pin Requests", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/my-pin-requests&current_scheme_id=${schemeId}` },
        { name: "Withdrawal Request", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/withdrawal-request&current_scheme_id=${schemeId}` },
      ]
    },
    { name: "Customer Report", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/customer-report&current_scheme_id=${schemeId}`, icon: BookmarkPlus },
    {
      name: "Income Report", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/income-report&current_scheme_id=${schemeId}`, icon: History,
      children: [
        { name: "Passive Income", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/income-report/passive-income&current_scheme_id=${schemeId}` },
        { name: "Activation Income", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/income-report/activation-income&current_scheme_id=${schemeId}` },
        { name: "Repayment Income", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/income-report/repayment-income&current_scheme_id=${schemeId}` },
        { name: "Payout Details", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/income-report/payout-details&current_scheme_id=${schemeId}` },
        { name: "Rewards and Awards", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/income-report/rewards-and-awards&current_scheme_id=${schemeId}` },
        { name: "Advisory Board Income", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/income-report/advisory-board-income&current_scheme_id=${schemeId}` },
        { name: "Director Income", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/income-report/director-income&current_scheme_id=${schemeId}` },
        { name: "Offer Income", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/income-report/offer-income&current_scheme_id=${schemeId}` },
        { name: "Royalty Income", path: `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/income-report/royalty-income&current_scheme_id=${schemeId}` },
      ]
    },
  ];
};