import {
  BadgePercent,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Gift,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Tags,
  Users,
  X,
  Layers3,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import studioLogo from "../../assets/logo.png";

type AdminSidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onMobileClose: () => void;
};

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
    end: true,
  },
  {
    label: "Products",
    icon: Package,
    path: "/admin/products",
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    path: "/admin/orders",
  },
  {
    label: "Inventory",
    icon: Boxes,
    path: "/admin/inventory",
  },
  {
    label: "Categories",
    icon: Tags,
    path: "/admin/categories",
  },
  {
    label: "Collections",
    icon: Layers3,
    path: "/admin/collections",
  },
  {
    label: "Promotions",
    icon: BadgePercent,
    path: "/admin/promotions",
  },
  {
    label: "Gifts",
    icon: Gift,
    path: "/admin/gifts",
  },
  {
    label: "Customers",
    icon: Users,
    path: "/admin/customers",
  },
];

const AdminSidebar = ({
  collapsed,
  mobileOpen,
  onCollapse,
  onMobileClose,
}: AdminSidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const csrfToken = sessionStorage.getItem(
      "admin_csrf_token"
    );

    try {
      await fetch(
        "http://localhost:5000/api/admin/auth/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "x-csrf-token": csrfToken ?? "",
          },
        }
      );
    } finally {
      sessionStorage.removeItem(
        "admin_csrf_token"
      );

      navigate("/admin/login", {
        replace: true,
      });
    }
  };

  return (
    <aside
      className={`
        fixed bottom-0 left-0 top-0 z-50
        flex flex-col overflow-hidden

        bg-[#7057F5]
        text-white

        shadow-[10px_0_35px_rgba(78,56,178,0.16)]

        transition-all duration-300

        ${
          collapsed
            ? "lg:w-[84px]"
            : "lg:w-[240px]"
        }

        ${
          mobileOpen
            ? "w-[260px] translate-x-0"
            : "w-[260px] -translate-x-full lg:translate-x-0"
        }
      `}
    >
      {/* Logo */}
      <div
        className="
          relative z-10 flex h-[88px]
          items-center justify-between
          border-b border-white/15
          px-5
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex h-11 w-11 flex-shrink-0
              items-center justify-center
              rounded-2xl bg-white
              shadow-sm
            "
          >
            <img
              src={studioLogo}
              alt="ABIKYA"
              className="h-8 w-8 object-contain"
            />
          </div>

          {!collapsed && (
            <div className="hidden lg:block">
              <p className="text-[13px] font-semibold tracking-[-0.02em] text-white">
                ABIKYA
              </p>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.18em] text-white/60">
                Admin Portal
              </p>
            </div>
          )}

          <div className="lg:hidden">
            <p className="text-[13px] font-semibold text-white">
              ABIKYA
            </p>

            <p className="text-[9px] uppercase tracking-[0.18em] text-white/60">
              Admin Portal
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onMobileClose}
          className="
            rounded-xl p-2 text-white/80
            transition-colors
            hover:bg-white/10
            hover:text-white
            lg:hidden
          "
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav
        className="
          relative z-10 flex-1
          overflow-y-auto
          px-3 py-6
        "
      >
        {!collapsed && (
          <p
            className="
              mb-3 hidden px-3
              text-[9px] font-medium
              uppercase tracking-[0.2em]
              text-white/50
              lg:block
            "
          >
            Menu
          </p>
        )}

        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
  key={item.path}
  to={item.path}
  end={item.end}
  title={collapsed ? item.label : undefined}
  onClick={onMobileClose}
  className={({ isActive }) => `
    group flex w-full items-center
    rounded-xl px-3 py-3
    transition-all duration-200

    ${
      collapsed
        ? "lg:justify-center lg:px-0"
        : "lg:px-3"
    }

    ${
      isActive
        ? "bg-white !text-[#17141D] shadow-[0_8px_24px_rgba(39,24,102,0.15)]"
        : "text-white/85 hover:bg-white/10 hover:text-white"
    }
  `}
>
  <Icon
    size={18}
    strokeWidth={1.9}
    className="flex-shrink-0"
  />

  <span
    className={`
      ml-3 text-[12px] font-medium
      ${collapsed ? "lg:hidden" : ""}
    `}
  >
    {item.label}
  </span>
</NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/15 p-3">
        <NavLink
          to="/admin/settings"
          onClick={onMobileClose}
          className={({ isActive }) => `
            flex w-full items-center
            rounded-xl px-3 py-3
            transition-all duration-200

            ${
              collapsed
                ? "lg:justify-center lg:px-0"
                : ""
            }

            ${
              isActive
                ? `
                  bg-white
                  text-[#17141D]
                  shadow-[0_8px_24px_rgba(39,24,102,0.15)]
                `
                : `
                  text-white/85
                  hover:bg-white/10
                  hover:text-white
                `
            }
          `}
        >
          <Settings
            size={18}
            strokeWidth={1.9}
          />

          <span
            className={`
              ml-3 text-[12px] font-medium
              ${collapsed ? "lg:hidden" : ""}
            `}
          >
            Settings
          </span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className={`
            mt-1 flex w-full items-center
            rounded-xl px-3 py-3
            text-white/80
            transition-all duration-200

            hover:bg-white/10
            hover:text-white

            ${
              collapsed
                ? "lg:justify-center lg:px-0"
                : ""
            }
          `}
        >
          <LogOut
            size={18}
            strokeWidth={1.9}
          />

          <span
            className={`
              ml-3 text-[12px] font-medium
              ${collapsed ? "lg:hidden" : ""}
            `}
          >
            Logout
          </span>
        </button>

        {/* Desktop collapse */}
        <button
          type="button"
          onClick={onCollapse}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="
            mt-4 hidden w-full
            items-center justify-center
            rounded-xl
            border border-white/20
            py-2.5
            text-white/70
            transition-all duration-200

            hover:border-white/30
            hover:bg-white/10
            hover:text-white

            lg:flex
          "
        >
          {collapsed ? (
            <ChevronRight size={17} />
          ) : (
            <>
              <ChevronLeft size={17} />

              <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.12em]">
                Collapse
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;