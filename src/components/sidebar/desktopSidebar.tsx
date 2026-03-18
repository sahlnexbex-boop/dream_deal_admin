import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { getSidebarMenu } from "./sidebarMenu";
import { DecryptData, EncryptData } from "../../hooks/crypto";
import { useScheme } from "../../context/SchemeContext";

export default function DesktopSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const location = useLocation();
  const { selectedSchemeId } = useScheme();
  const sidebarMenu = getSidebarMenu(selectedSchemeId?.toString() || "");

  const encryptedData = EncryptData("dd123@#");
  const decryptedData = DecryptData(encryptedData);

  console.log("encrypted data", encryptedData);
  console.log("decrypted data", decryptedData);

  // Auto-open accordion based on current path
  useEffect(() => {
    if (!collapsed) {
      const currentPath = location.pathname;
      const activeParent = sidebarMenu.find(item =>
        item.children?.some(child => currentPath.startsWith(child.path))
      );
      if (activeParent) {
        setOpenAccordion(activeParent.path);
      }
    }
  }, [location.pathname, collapsed, sidebarMenu]);

  const handleAccordionToggle = (path: string) => {
    if (collapsed) return;
    setOpenAccordion(openAccordion === path ? null : path);
  };

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
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
          {sidebarMenu.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isAccordionOpen = openAccordion === item.path;

            return (
              <div key={item.path} className="relative">
                {/* Parent Menu Item */}
                <NavLink
                  to={item.path}
                  onClick={(e) => {
                    if (hasChildren && !collapsed) {
                      e.preventDefault();
                      handleAccordionToggle(item.path);
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 group relative
                    ${isActive
                      ? "bg-[#edfacc] text-gray-800 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={22}
                        strokeWidth={1.5}
                        className={`${isActive
                          ? "text-gray-800"
                          : "text-lime-600 group-hover:text-gray-700"
                          }`}
                      />
                      {!collapsed && (
                        <>
                          <span className="text-sm tracking-wide flex-1">
                            {item.name}
                          </span>
                          {hasChildren && (
                            <ChevronDown
                              size={16}
                              className={`text-gray-400 transition-transform duration-300 ${isAccordionOpen ? "rotate-180" : ""
                                }`}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </NavLink>

                {/* Children Accordion - Only show when not collapsed */}
                {hasChildren && !collapsed && (
                  <div
                    className={`accordion-content overflow-hidden ${isAccordionOpen
                      ? "max-h-96 opacity-100 translate-y-0"
                      : "max-h-0 opacity-0 -translate-y-2"
                      }`}
                  >
                    <div className="pl-8 pr-4 py-1 space-y-1">
                      {item.children?.map((child, childIdx) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${isAccordionOpen ? "accordion-item" : ""
                            } ${isActive
                              ? "bg-[#edfacc] text-gray-800 font-semibold"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                            }`
                          }
                          style={{
                            animationDelay: isAccordionOpen ? `${childIdx * 50}ms` : "0ms",
                          }}
                        >
                          <span className="tracking-wide">{child.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* LOGOUT */}
        {/* <div className="p-6 mt-auto">
          <button className={`flex items-center gap-4 text-gray-500 hover:text-red-500 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}>
            <LogOut size={20} strokeWidth={1.5} />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div> */}
      </div >
    </aside >
  );
}
