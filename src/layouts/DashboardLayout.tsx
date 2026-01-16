import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DesktopSidebar from "../components/sidebar/desktopSidebar";
import MobileSidebar from "../components/sidebar/mobileSidebar";
import Topbar from "../components/topbar";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = collapsed ? 80 : 256;
  const topbarHeight = 72;

  const contentLeft = isDesktop ? sidebarWidth : 0;
  const contentWidth = isDesktop
    ? `calc(100% - ${sidebarWidth}px)`
    : "100%";

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-[#fafeea] to-[#f4f5f7] overflow-hidden">
      <DesktopSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Topbar
        sidebarWidth={sidebarWidth}
        onMobileOpen={() => setMobileOpen(true)}
      />

      <main
        className="absolute overflow-y-auto no-scrollbar transition-all duration-300"
        style={{
          left: contentLeft,
          top: topbarHeight,
          width: contentWidth,
          height: `calc(100% - ${topbarHeight}px)`,
        }}
      >
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
