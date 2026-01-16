import {
  X,
  LayoutDashboard,
  User,
  Users,
  Layers,
  CreditCard,
  Key,
  History,
  BookmarkPlus,
} from "lucide-react";
import { NavLink } from "react-router-dom";

// Standardizing the menu to match DesktopSidebar exactly
const sidebarMenu = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Sub Promoters", path: "/sub-promoters", icon: User },
  { name: "My Customers", path: "/my-customers", icon: Users },
  { name: "Affiliate Marketing", path: "/affiliate-level", icon: Layers },
  { name: "Payments", path: "/payments", icon: CreditCard },
  { name: "Repayment Pins", path: "/repayment-pins", icon: Key },
  { name: "Repayment History", path: "/pin-history", icon: History },
  { name: "My Pin Requests", path: "/pin-requests", icon: BookmarkPlus },
];

export default function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* DRAWER */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50
        transform transition-transform duration-300 ease-in-out font-sans shadow-xl
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-gray-100">
          <img
            src="/Images/logo_with_text.png"
            alt="logo"
            className="max-h-12"
          />
          <button 
            className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none" 
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* MENU */}
        <nav className="mt-4 px-4 space-y-2 overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar">
          {sidebarMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 group
                ${
                  isActive
                    ? "bg-[#edfacc] text-gray-800 font-semibold" // Active: Lime light bg, dark text
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium" // Inactive
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={22}
                    strokeWidth={1.5}
                    className={`${
                      isActive
                        ? "text-gray-800"
                        : "text-lime-600 group-hover:text-gray-700"
                    }`}
                  />
                  <span className="text-sm tracking-wide">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}