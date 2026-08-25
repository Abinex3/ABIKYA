import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import { useLocation } from "react-router-dom";

type AdminHeaderProps = {
  onMenuClick: () => void;
};

const getPageDetails = (pathname: string) => {
  if (pathname === "/admin") {
    return {
      title: "Dashboard",
      subtitle:
        "Welcome back. Here's what's happening with your store.",
    };
  }

  if (pathname.startsWith("/admin/products")) {
    return {
      title: "Products",
      subtitle:
        "Manage your products, pricing, images, and availability.",
    };
  }

  if (pathname.startsWith("/admin/orders")) {
    return {
      title: "Orders",
      subtitle:
        "Track and manage customer orders.",
    };
  }

  if (pathname.startsWith("/admin/inventory")) {
    return {
      title: "Inventory",
      subtitle:
        "Monitor stock levels and product availability.",
    };
  }

  if (pathname.startsWith("/admin/categories")) {
    return {
      title: "Categories",
      subtitle:
        "Organize products by piercing category.",
    };
  }

  if (pathname.startsWith("/admin/collections")) {
    return {
      title: "Collections",
      subtitle:
        "Manage curated product collections.",
    };
  }

  if (pathname.startsWith("/admin/customers")) {
    return {
      title: "Customers",
      subtitle:
        "View customer activity and order information.",
    };
  }

  if (pathname.startsWith("/admin/settings")) {
    return {
      title: "Settings",
      subtitle:
        "Manage your store and admin preferences.",
    };
  }

  return {
    title: "Admin",
    subtitle: "ABIKYA administration portal.",
  };
};

const AdminHeader = ({
  onMenuClick,
}: AdminHeaderProps) => {
  const location = useLocation();

  const page = getPageDetails(
    location.pathname
  );

  return (
    <header className="sticky top-0 z-30 flex min-h-[88px] items-center justify-between border-b border-[#ebe8f3] bg-[#f5f5fb]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {/* Mobile menu */}
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onMenuClick}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-[#50495b] shadow-sm transition-colors hover:bg-[#f8f6fc] lg:hidden"
        >
          <Menu size={19} />
        </button>

        {/* Page title */}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-[-0.03em] sm:text-2xl">
            {page.title}
          </h1>

          <p className="mt-1 hidden max-w-[460px] truncate text-[11px] text-[#98929e] sm:block">
            {page.subtitle}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="ml-4 flex flex-shrink-0 items-center gap-2 sm:gap-3">
        {/* Search */}
        <div className="hidden h-10 items-center rounded-xl border border-[#ebe8f1] bg-white px-3 md:flex">
          <Search
            size={15}
            className="flex-shrink-0 text-[#aaa4b2]"
          />

          <input
            type="text"
            placeholder="Search..."
            aria-label="Search admin"
            className="ml-2 w-28 border-0 bg-transparent text-xs outline-none placeholder:text-[#aaa4b2] lg:w-36 xl:w-48"
          />
        </div>

        {/* Notification */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#ebe8f1] bg-white text-[#77717e] transition-colors hover:bg-[#f9f7fc]"
        >
          <Bell size={17} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-[#ff5d72]" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 rounded-xl border border-[#ebe8f1] bg-white p-1.5 sm:pr-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#755cff,#bd69ef)] text-[11px] font-semibold text-white">
            A
          </div>

          <div className="hidden sm:block">
            <p className="text-[11px] font-semibold">
              Admin
            </p>

            <p className="text-[9px] text-[#9993a3]">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;