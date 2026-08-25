import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  return (
    <main className="admin-font min-h-screen bg-[#f5f5fb] text-[#181621]">
      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setMobileSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <AdminSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCollapse={() =>
          setSidebarCollapsed(
            (current) => !current
          )
        }
        onMobileClose={() =>
          setMobileSidebarOpen(false)
        }
      />

      <div
        className={`
          min-h-screen transition-all duration-300
          ${
            sidebarCollapsed
              ? "lg:pl-[84px]"
              : "lg:pl-[240px]"
          }
        `}
      >
        <AdminHeader
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;