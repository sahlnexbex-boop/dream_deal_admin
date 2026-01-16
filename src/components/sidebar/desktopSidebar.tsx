// import React from "react";
import {
  ChevronLeft,
  ChevronRight,
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

// defining menu items here to match the image icons exactly
const sidebarMenu = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Sub Promoters", path: "/sub-promoters", icon: User },
  { name: "My Customers", path: "/my-customers", icon: Users },
  { name: "Affiliate Marketing", path: "/affiliate-level", icon: Layers },
  { name: "Payments", path: "/payments", icon: CreditCard },
  { name: "Repayment Pins", path: "/repayment-pins", icon: Key },
  { name: "Repayment History", path: "/pin-history", icon: History },
  { name: "My Pin Requests", path: "/pin-requests", icon: BookmarkPlus },
  // { name: "Withdrawal Request", path: "/withdrawal", icon: Wallet },
  //   { name: "Customer Report", path: "/customer-report", icon: FileBarChart },
  //   { name: "Income Report", path: "/income-report", icon: TrendingUp },
];

export default function DesktopSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={`hidden md:flex fixed top-0 left-0 h-screen bg-white 
      transition-all duration-300 ease-in-out font-sans border-r border-gray-100 shadow-[2px_0_10px_rgba(0,0,0,0.02)]
      ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex flex-col w-full h-full">
        {/* HEADER / LOGO SECTION */}
        <div className="h-24 flex items-center justify-between px-6 pt-4 mb-4">
          {!collapsed ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div>
                  <img src="/Images/logo_with_text.png" alt="logo"
                    className="max-h-14" />
                </div>
              </div>
            </div>
          ) : (
           <img src="/Images/logo_only.png" alt="logo" className="max-w-6" />
          )}

          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 bg-transparent !border-none p-1 focus:outline-none"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* MENU LIST */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
          {sidebarMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
                  {!collapsed && (
                    <span className="text-sm tracking-wide">{item.name}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* LOGOUT */}
        {/* <div className="p-6 mt-auto">
          <button className={`flex items-center gap-4 text-gray-500 hover:text-red-500 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}>
            <LogOut size={20} strokeWidth={1.5} />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div> */}
      </div>
    </aside>
  );
}
