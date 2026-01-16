import { Menu, Search, Bell, MoreVertical, ChevronDown } from "lucide-react";

export default function Topbar({
  sidebarWidth,
  onMobileOpen,
}: {
  sidebarWidth: number;
  onMobileOpen: () => void;
}) {
  const isDesktop = window.innerWidth >= 768;

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
        <div className="flex items-center bg-white px-4 py-2.5 rounded-full shadow-sm w-40 md:w-80 border border-transparent focus-within:border-lime-200">
          <Search size={18} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-1 md:gap-4 pointer-events-auto">
        {/* Plan Dropdown (Desktop only) */}
        <button className="hidden md:flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors border border-gray-50 hover:border-lime-500">
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            Smart Purchase Plan
          </span>
          <ChevronDown size={16} className="text-gray-500" />
        </button>

        {/* Notification */}
        <button className="relative w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-50 hover:border-lime-500 p-0">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 bg-lime-400 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#fcfcf9] ">
            4
          </span>
        </button>

        {/* More */}
        <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-50 hover:border-lime-500 p-0">
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>
    </header>
  );
}
