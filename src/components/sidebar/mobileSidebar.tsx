import { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { getSidebarMenu } from "./sidebarMenu";
import { useScheme } from "../../context/SchemeContext";


export default function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const location = useLocation();
  const { selectedSchemeId } = useScheme();
  const sidebarMenu = getSidebarMenu(selectedSchemeId?.toString() || "");

  // Auto-open accordion based on current path
  useEffect(() => {
    if (open) {
      const currentPath = location.pathname;
      const activeParent = sidebarMenu.find(item =>
        item.children?.some(child => currentPath.startsWith(child.path))
      );
      if (activeParent) {
        setOpenAccordion(activeParent.path);
      }
    }
  }, [location.pathname, open, sidebarMenu]);

  const handleAccordionToggle = (path: string) => {
    setOpenAccordion(openAccordion === path ? null : path);
  };

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
        <nav className="mt-4 px-4 space-y-1 overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar">
          {sidebarMenu.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isAccordionOpen = openAccordion === item.path;

            return (
              <div key={item.path} className="relative">
                {/* Parent Menu Item */}
                <NavLink
                  to={item.path}
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault();
                      handleAccordionToggle(item.path);
                    } else {
                      onClose();
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 group
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
                </NavLink>

                {/* Children Accordion */}
                {hasChildren && (
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
                          onClick={onClose}
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
      </aside>
    </>
  );
}