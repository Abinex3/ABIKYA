import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const shopLinks = [
  { label: "All Studs", to: "/shop" },
  { label: "Lobe", to: "/shop?style=lobe" },
  { label: "Nose", to: "/shop?style=nose" },
  { label: "Helix", to: "/shop?style=helix" },
  { label: "Tragus", to: "/shop?style=tragus" },
  { label: "Conch", to: "/shop?style=conch" },
  { label: "Daith", to: "/shop?style=daith" },
  { label: "Men", to: "/men" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Our Studio", to: "/studio" },
  { label: "Collections", to: "/collections" },
  { label: "Contact Us", to: "/contact" },
  { label: "FAQ", to: "/faq" },
];

const supportLinks = [
  { label: "Track Order", to: "/shipping" },
  { label: "Return / Exchange", to: "/returns" },
  { label: "Contact Us", to: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Returns Policy", to: "/returns" },
  { label: "Shipping Policy", to: "/shipping" },
];

function FooterLink({
  label,
  to,
}: {
  label: string;
  to: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="
          inline-block
          text-sm
          leading-7
          text-black/70
          transition-all
          duration-300

          hover:translate-x-1
          hover:text-black
        "
      >
        {label}
      </Link>
    </li>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-[#f4f4f4] text-black">
      {/* TOP FOOTER */}
      <div
        className="
          mx-auto
          max-w-[1600px]
          px-6
          pb-12
          pt-14

          sm:px-10
          sm:pb-14
          sm:pt-16

          lg:px-16
          lg:pb-16
          lg:pt-20
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-12

            sm:grid-cols-2

            lg:grid-cols-[1.7fr_0.8fr_0.8fr_0.8fr_0.8fr]
            lg:gap-10
          "
        >
          {/* ABOUT */}
          <div className="max-w-md">
            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.08em]
              "
            >
              About
            </h3>

            <p
              className="
                mt-5
                text-sm
                leading-7
                text-black/65
              "
            >
              ABIKYATATTOOS is built around individuality, piercing culture
              and modern self-expression. Our jewellery is curated to
              complement your piercings, your ink, and your everyday style.
            </p>

      {/* SOCIAL ICONS */}
<div className="mt-8 flex items-center gap-6">
  {/* INSTAGRAM */}
  <a
    href="https://instagram.com/"
    target="_blank"
    rel="noreferrer"
    aria-label="Instagram"
    className="text-black transition-opacity duration-300 hover:opacity-50"
  >
    <svg
      viewBox="0 0 24 24"
      className="h-[19px] w-[19px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  </a>

  {/* FACEBOOK */}
  <a
    href="https://facebook.com/"
    target="_blank"
    rel="noreferrer"
    aria-label="Facebook"
    className="text-black transition-opacity duration-300 hover:opacity-50"
  >
    <svg
      viewBox="0 0 24 24"
      className="h-[19px] w-[19px]"
      fill="currentColor"
    >
      <path d="M13.5 22v-8h2.8l.42-3.2H13.5V8.75c0-.93.26-1.56 1.62-1.56h1.73V4.33c-.3-.04-1.33-.13-2.53-.13-2.5 0-4.22 1.53-4.22 4.34v2.26H7.27V14h2.83v8h3.4Z" />
    </svg>
  </a>

  {/* YOUTUBE */}
  <a
    href="https://youtube.com/"
    target="_blank"
    rel="noreferrer"
    aria-label="YouTube"
    className="text-black transition-opacity duration-300 hover:opacity-50"
  >
    <svg
      viewBox="0 0 24 24"
      className="h-[21px] w-[21px]"
      fill="currentColor"
    >
      <path d="M23 12s0-3.3-.42-4.9a3.1 3.1 0 0 0-2.18-2.2C18.8 4.5 12 4.5 12 4.5s-6.8 0-8.4.4A3.1 3.1 0 0 0 1.42 7.1C1 8.7 1 12 1 12s0 3.3.42 4.9a3.1 3.1 0 0 0 2.18 2.2c1.6.4 8.4.4 8.4.4s6.8 0 8.4-.4a3.1 3.1 0 0 0 2.18-2.2C23 15.3 23 12 23 12Zm-13.25 3.3V8.7L15.5 12l-5.75 3.3Z" />
    </svg>
  </a>
</div>
          </div>

          {/* SHOP */}
          <div>
            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.08em]
              "
            >
              Shop
            </h3>

            <ul className="mt-4">
              {shopLinks.map((link) => (
                <FooterLink
                  key={link.label}
                  label={link.label}
                  to={link.to}
                />
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.08em]
              "
            >
              Company
            </h3>

            <ul className="mt-4">
              {companyLinks.map((link) => (
                <FooterLink
                  key={link.label}
                  label={link.label}
                  to={link.to}
                />
              ))}
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.08em]
              "
            >
              Support
            </h3>

            <ul className="mt-4">
              {supportLinks.map((link) => (
                <FooterLink
                  key={link.label}
                  label={link.label}
                  to={link.to}
                />
              ))}
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.08em]
              "
            >
              Legal
            </h3>

            <ul className="mt-4">
              {legalLinks.map((link) => (
                <FooterLink
                  key={link.label}
                  label={link.label}
                  to={link.to}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="mt-14 h-px w-full bg-black/10 lg:mt-16" />

        {/* BOTTOM META */}
<div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black">
    © {currentYear} ABIKYATATTOOS. ALL RIGHTS RESERVED.
  </p>

  <a
    href="#"
    className="
      group inline-flex w-fit items-center gap-2
      text-[11px] font-semibold uppercase
      tracking-[0.12em] text-black
      transition-opacity duration-300
      hover:opacity-50
    "
  >
    DESIGNED & DEVELOPED BY ABXI

    <ArrowUpRight
      size={14}
      strokeWidth={1.8}
      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    />
  </a>
</div>
      </div>

      {/* OVERSIZED BRAND WORDMARK */}
<div className="w-full overflow-hidden border-t border-black/10">
  <div className="flex w-full items-end justify-center px-5 pt-6 sm:px-8 lg:px-12">
    <p
      className="
        w-full
        select-none
        whitespace-nowrap
        text-center
        text-[12.2vw]
        leading-[0.78]
        tracking-[-0.065em]
        text-black
      "
    >
      ABIKYATATTOOS
    </p>
  </div>
</div>
      {/* SCROLL TO TOP */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="
          fixed
          bottom-5
          right-5
          z-40
          flex h-12 w-12
          items-center justify-center
          rounded-full
          bg-black
          text-white
          shadow-lg
          transition-all
          duration-300

          hover:-translate-y-1
          hover:bg-red-600

          sm:bottom-7
          sm:right-7
        "
      >
        <ArrowUp size={19} strokeWidth={1.5} />
      </button>
    </footer>
  );
}

export default Footer;