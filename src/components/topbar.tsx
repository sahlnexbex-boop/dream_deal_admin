import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  // Bell,
  MoreVertical,
  ChevronDown,
  Check,
  UserCircle,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { DecryptData, EncryptData } from "../hooks/crypto";

import { getSidebarMenu } from "./sidebar/sidebarMenu";
import { OLD_PORTAL_URL } from "../utils/oldPortal";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssignedSchemes } from "../api/dashboard";
import { assignedSchemesKey } from "../api/queryKeys";
import { useScheme } from "../context/SchemeContext";

// Plan options for topbar
// const topbarPlanOptions = [
//   { id: 1, name: "Smart Purchase Plan" },
//   { id: 2, name: "Premium Plan" },
//   { id: 3, name: "Standard Plan" },
// ];

export default function Topbar({
  sidebarWidth,
  onMobileOpen,
}: {
  sidebarWidth: number;
  onMobileOpen: () => void;
}) {
  const navigate = useNavigate();
  const isDesktop = window.innerWidth >= 768;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const { data: assignedSchemes, isLoading: schemesLoading } = useQuery({
    queryKey: assignedSchemesKey(),
    queryFn: getAssignedSchemes,
  });

  const storedUserId = localStorage.getItem("user_id");
  const encryptedUserId = storedUserId
    ? encodeURIComponent(EncryptData(storedUserId))
    : "";

  const { selectedSchemeId, setSelectedSchemeId } = useScheme();

  const selectedPlan = (assignedSchemes || []).find(
    (plan: any) => plan.scheme_id === selectedSchemeId
  );

  useEffect(() => {
    if (assignedSchemes && assignedSchemes.length > 0) {
      const isValid = assignedSchemes.some(
        (plan: any) => plan.scheme_id === selectedSchemeId
      );
      if (!isValid) {
        setSelectedSchemeId(assignedSchemes[0].scheme_id);
      }
    }
  }, [assignedSchemes, selectedSchemeId, setSelectedSchemeId]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ name: string; path: string; icon: any; isChild?: boolean; parentName?: string }>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    if (isMoreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreOpen]);

  const queryClient = useQueryClient();

  const staticEncryptEmail = EncryptData("sheethalshee057@gmail.com");
  const staticEncryptPassword = EncryptData("dd123@#");

  console.log("encrypted email", staticEncryptEmail);
  console.log("encrypted password", staticEncryptPassword);

  const staticDecryptEmail = DecryptData(staticEncryptEmail);
  const staticDecryptPassword = DecryptData(staticEncryptPassword);

  console.log("decrypt email", staticDecryptEmail);
  console.log("decrypt password", staticDecryptPassword);

  const handleLogout = async () => {
    setIsMoreOpen(false);
    try {
      await logout();
    } catch {
      // proceed even if API fails
    } finally {
      // Clear all state and storage
      localStorage.removeItem("token");
      localStorage.removeItem("scheme_id");
      localStorage.removeItem("user_id");

      // Clear React Query cache to prevent data leakage between users
      queryClient.clear();

      navigate("/");
    }
  };

  const handlePlanSelect = (plan: any) => {
    setSelectedSchemeId(plan.scheme_id);
    setIsDropdownOpen(false);
  };


  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const menuItems = getSidebarMenu(selectedSchemeId?.toString() || "");
    const query = searchQuery.toLowerCase().trim();
    const results: Array<{ name: string; path: string; icon: any; isChild?: boolean; parentName?: string }> = [];

    // Search through menu items and children
    for (const item of menuItems) {
      // Check if parent matches
      if (item.name.toLowerCase().includes(query)) {
        results.push({
          name: item.name,
          path: item.path,
          icon: item.icon,
          isChild: false,
        });
      }

      // Check children
      if (item.children) {
        for (const child of item.children) {
          if (child.name.toLowerCase().includes(query)) {
            results.push({
              name: child.name,
              path: child.path,
              icon: item.icon, // Use parent icon for children
              isChild: true,
              parentName: item.name,
            });
          }
        }
      }

      // Limit to 4 results
      if (results.length >= 4) break;
    }

    setSearchResults(results.slice(0, 4)); // Max 4 results
    setShowSearchResults(results.length > 0);
  }, [searchQuery, selectedSchemeId]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchResults]);

  const handleSearchResultClick = (path: string) => {
    if (path.startsWith("http")) {
      window.location.href = path;
    } else {
      navigate(path);
    }
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <header
      className="
        fixed top-0 right-0 z-30
        flex items-center justify-between
        px-4 md:px-6 py-4
        transition-[left,width] duration-300 ease-in-out
        bg-transparent pointer-events-none max-w-7xl mx-auto
      "
      style={
        isDesktop
          ? {
            left: sidebarWidth,
            width: `calc(100% - ${sidebarWidth}px)`,
          }
          : {
            left: 0,
            width: "100%",
          }
      }
    >
      {/* LEFT SIDE */}
      <div className="flex items-center md:gap-4 gap-2 w-full md:w-auto pointer-events-auto">
        {/* Mobile Toggle */}
        <button
          onClick={onMobileOpen}
          className="md:hidden p-2 bg-white text-gray-600 rounded-full shadow-sm hover:bg-gray-50"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div ref={searchRef} className="relative w-40 md:w-80">
          <div className="flex items-center bg-white px-4 py-2.5 rounded-full shadow-sm border border-transparent focus-within:border-lime-200">
            <Search size={18} className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowSearchResults(true);
                }
              }}
              className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.path}-${index}`}
                    onClick={() => handleSearchResultClick(result.path)}
                    className="w-full px-4 py-1 text-left hover:bg-lime-50 transition-colors border-b border-gray-50 last:border-b-0 flex items-center rounded-xl gap-3 group focus:outline-none hover:border-lime-500 hover:text-lime-600"
                  >
                    <result.icon
                      size={18}
                      className="text-lime-600 group-hover:text-lime-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 group-hover:text-lime-600 truncate">
                        {result.name}
                      </div>
                      {/* {result.isChild && result.parentName && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {result.parentName}
                        </div>
                      )} */}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-1 md:gap-4 pointer-events-auto">
        {/* Plan Dropdown (Desktop only) */}
        <div ref={dropdownRef} className="relative hidden md:block">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors border border-gray-50 hover:border-lime-500 focus:outline-none"
          >
            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              {schemesLoading ? "Loading..." : selectedPlan ? selectedPlan.scheme_name : "Select Plan"}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-200 opacity-100 min-w-[200px]">
              <div className="overflow-hidden">
                {schemesLoading ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
                ) : (assignedSchemes || []).map((plan: any) => (
                  <button
                    key={plan.scheme_id}
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full px-4 py-3 text-left transition-colors border-b border-gray-50 hover:border-lime-500 last:border-b-0 flex items-center justify-between group focus:outline-none text-sm rounded-xl ${selectedPlan?.scheme_id === plan.scheme_id
                      ? "bg-lime-50 text-gray-800"
                      : "bg-white text-gray-700 hover:bg-lime-50/50"
                      }`}
                    style={{
                      WebkitAppearance: 'none',
                      appearance: 'none',
                    }}
                  >
                    <span className={`font-medium ${selectedPlan?.scheme_id === plan.scheme_id ? "text-gray-800" : "text-gray-700 group-hover:text-lime-600"
                      }`}>
                      {plan.scheme_name}
                    </span>
                    {selectedPlan?.scheme_id === plan.scheme_id && (
                      <Check
                        size={16}
                        className="text-lime-600 flex-shrink-0 ml-2"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notification */}
        {/* <button className="relative focus:outline-none w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-50 hover:border-lime-500 p-0">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 bg-lime-400 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#fcfcf9] ">
            4
          </span>
        </button> */}

        {/* More — with dropdown */}
        <div ref={moreRef} className="relative">
          <button
            onClick={() => setIsMoreOpen((v) => !v)}
            className={`w-10 h-10 focus:outline-none rounded-full shadow-sm flex items-center justify-center transition-colors border p-0
              ${isMoreOpen
                ? "bg-lime-50 border-lime-400 text-lime-600"
                : "bg-white border-gray-50 hover:bg-gray-50 hover:border-lime-500 text-gray-600"
              }`}
          >
            <MoreVertical size={20} />
          </button>

          {/* Dropdown */}
          {isMoreOpen && (
            <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-w-[160px]"
              style={{ animation: "fadeInUp 0.2s ease-out" }}
            >
              {/* Dashboard */}
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  navigate("/dashboard");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-lime-50 hover:text-lime-700 transition-colors border-b border-gray-50 focus:outline-none group"
              >
                <LayoutDashboard size={17} className="text-gray-400 group-hover:text-lime-600 flex-shrink-0" />
                <span className="font-medium">Dashboard</span>
              </button>

              {/* Profile */}
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  const schemeId = selectedSchemeId || "";
                  if (encryptedUserId) {
                    window.location.href = `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/profile&current_scheme_id=${schemeId}`;
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-lime-50 hover:text-lime-700 transition-colors border-b border-gray-50 focus:outline-none group"
              >
                <UserCircle size={17} className="text-gray-400 group-hover:text-lime-600 flex-shrink-0" />
                <span className="font-medium">Profile</span>
              </button>

              {/* KYC Verification */}
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  const schemeId = selectedSchemeId || "";
                  if (encryptedUserId) {
                    window.location.href = `${OLD_PORTAL_URL}/go-to?user_id=${encryptedUserId}&url=/kyc&current_scheme_id=${schemeId}`;
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-lime-50 hover:text-lime-700 transition-colors border-b border-gray-50 focus:outline-none group"
              >
                <ShieldCheck size={17} className="text-gray-400 group-hover:text-lime-600 flex-shrink-0" />
                <span className="font-medium">KYC</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors focus:outline-none group"
              >
                <LogOut size={17} className="flex-shrink-0" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
