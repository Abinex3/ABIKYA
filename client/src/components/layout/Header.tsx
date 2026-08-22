import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import StudsMegaMenu from "./StudsMegaMenu";

function Header() {
  const [studsOpen, setStudsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className="relative z-40 bg-white text-black"
        onMouseLeave={() => setStudsOpen(false)}
      >
        <div className="border-b border-neutral-200">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10 lg:py-6">

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="xl:hidden"
            >
              <Menu size={24} strokeWidth={1.7} />
            </button>

            {/* BRAND */}
            <Link to="/" className="shrink-0">
              <div className="leading-none">
                <div className="text-xl uppercase tracking-tight sm:text-2xl lg:text-3xl">
                  ABIKYATATTOOS
                </div>

                <div className="mt-1.5 text-center text-[8px] uppercase tracking-[0.38em] text-neutral-500 sm:text-[10px]">
                  Tattoo & Studs
                </div>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden items-center gap-10 text-[15px] xl:flex">
              <div
                className="relative"
                onMouseEnter={() => setStudsOpen(true)}
              >
                <button
                  type="button"
                  className="group relative flex items-center gap-1 py-3"
                >
                  <span>Studs</span>

                  <ChevronDown
                    size={14}
                    strokeWidth={1.7}
                    className={`transition-transform duration-300 ${
                      studsOpen ? "rotate-180" : ""
                    }`}
                  />

                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-300 ease-out ${
                      studsOpen
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              </div>

              <NavLinkWithArrow to="/collections">
                Collections
              </NavLinkWithArrow>

              <NavLinkWithArrow to="/men">
                Men
              </NavLinkWithArrow>

              <NavLinkWithArrow to="/women">
                Women
              </NavLinkWithArrow>

              <AnimatedNavLink to="/studio">
                Our Studio
              </AnimatedNavLink>

              <AnimatedNavLink to="/about">
                About
              </AnimatedNavLink>

              <AnimatedNavLink to="/contact">
                Contact
              </AnimatedNavLink>
            </nav>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-4 sm:gap-5">
              <button
                type="button"
                aria-label="Search"
                className="transition-opacity duration-200 hover:opacity-50"
              >
                <Search size={22} strokeWidth={1.7} />
              </button>

              <button
                type="button"
                aria-label="Account"
                className="hidden transition-opacity duration-200 hover:opacity-50 sm:block"
              >
                <User size={22} strokeWidth={1.7} />
              </button>

              <button
                type="button"
                aria-label="Wishlist"
                className="hidden transition-opacity duration-200 hover:opacity-50 sm:block"
              >
                <Heart size={22} strokeWidth={1.7} />
              </button>

              <Link
                to="/cart"
                aria-label="Cart"
                className="relative transition-opacity duration-200 hover:opacity-50"
              >
                <ShoppingBag size={22} strokeWidth={1.7} />

                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] text-white">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* DESKTOP MEGA MENU */}
        <div
          onMouseEnter={() => setStudsOpen(true)}
          className={`absolute left-0 top-full hidden w-full origin-top transition-all duration-300 ease-out xl:block ${
            studsOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0"
          }`}
        >
          <StudsMegaMenu />
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mobileStudsOpen, setMobileStudsOpen] = useState(false);

  const styles = [
    "Lobe",
    "Bugadi",
    "Belly Button",
    "Nose",
    "Eyebrow",
    "Tongue",
    "Upper Lobe",
    "Flat",
    "Helix",
    "Snug",
    "Conch",
    "Tragus",
    "Daith",
  ];

  return (
    <div
      className={`fixed inset-0 z-[100] xl:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* DRAWER */}
      <aside
        className={`absolute left-0 top-0 h-full w-[88%] max-w-[420px] overflow-y-auto bg-white text-black shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* MOBILE HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-5">
          <Link to="/" onClick={onClose}>
            <div className="leading-none">
              <div className="text-xl uppercase tracking-tight">
                ABIKYATATTOOS
              </div>

              <div className="mt-1.5 text-[8px] uppercase tracking-[0.38em] text-neutral-500">
                Tattoo & Studs
              </div>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={25} strokeWidth={1.6} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="px-5">
          {/* STUDS ACCORDION */}
          <div className="border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setMobileStudsOpen((prev) => !prev)}
              className="flex w-full items-center justify-between py-5 text-left text-base uppercase"
            >
              <span>Studs</span>

              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  mobileStudsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                mobileStudsOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pb-5 pl-3">
                  <p className="mb-4 text-xs uppercase tracking-[0.2em] text-neutral-500">
                    By Style
                  </p>

                  <div className="flex flex-col gap-4">
                    {styles.map((style) => (
                      <Link
                        key={style}
                        to={`/shop?style=${encodeURIComponent(
                          style.toLowerCase()
                        )}`}
                        onClick={onClose}
                        className="text-[15px]"
                      >
                        {style}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <MobileNavLink to="/collections" onClick={onClose}>
            Collections
          </MobileNavLink>

          <MobileNavLink to="/men" onClick={onClose}>
            Men
          </MobileNavLink>

          <MobileNavLink to="/women" onClick={onClose}>
            Women
          </MobileNavLink>

          <MobileNavLink to="/studio" onClick={onClose}>
            Our Studio
          </MobileNavLink>

          <MobileNavLink to="/about" onClick={onClose}>
            About
          </MobileNavLink>

          <MobileNavLink to="/contact" onClick={onClose}>
            Contact
          </MobileNavLink>
        </nav>

        {/* MOBILE ACTIONS */}
        <div className="mt-6 border-t border-neutral-200 px-5 py-6">
          <div className="flex flex-col gap-5">
            <button
              type="button"
              className="flex items-center gap-3 text-sm uppercase"
            >
              <Search size={20} strokeWidth={1.6} />
              Search
            </button>

            <button
              type="button"
              className="flex items-center gap-3 text-sm uppercase"
            >
              <User size={20} strokeWidth={1.6} />
              Account
            </button>

            <button
              type="button"
              className="flex items-center gap-3 text-sm uppercase"
            >
              <Heart size={20} strokeWidth={1.6} />
              Wishlist
            </button>

            <Link
              to="/cart"
              onClick={onClose}
              className="flex items-center gap-3 text-sm uppercase"
            >
              <ShoppingBag size={20} strokeWidth={1.6} />
              Cart
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

function MobileNavLink({
  to,
  children,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block border-b border-neutral-200 py-5 text-base uppercase"
    >
      {children}
    </Link>
  );
}

function AnimatedNavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group relative py-3"
    >
      {children}

      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-black transition-all duration-300 ease-out group-hover:w-full" />
    </Link>
  );
}

function NavLinkWithArrow({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group relative flex items-center gap-1 py-3"
    >
      {children}

      <ChevronDown
        size={14}
        strokeWidth={1.7}
        className="transition-transform duration-300 group-hover:rotate-180"
      />

      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-black transition-all duration-300 ease-out group-hover:w-full" />
    </Link>
  );
}

export default Header;