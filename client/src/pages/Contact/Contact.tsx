import { useState } from "react";
import {
  Mail,
  Clock3,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";

import logo from "../../assets/logo.png";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Enquiry",
    orderNumber: "",
    message: "",
  });

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    console.log("Contact form:", formData);

    // Later connect this to your backend / email API.
  };

  return (
    <div className="w-full bg-white text-black">
      {/* =====================================================
    PAGE HERO
===================================================== */}
<section className="border-b border-black/10 bg-[#f7f7f7]">
  <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 lg:px-16 lg:py-20">
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      {/* LEFT CONTENT */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
          Tattoo · Piercing · Jewellery
        </p>

        <h1 className="mt-4 text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
          LET&apos;S TALK.
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-7 text-black/55">
          Have a question about our jewellery, your order,
          piercing services or studio? Get in touch with
          ABIKYA TATTOOS and our team will be happy to help.
        </p>

        {/* SOCIAL LINKS */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <SocialButton
            href="https://www.instagram.com/abikya_tattoos?igsi=MTB2eWdwcDhiM3B6OQ%3D%3D&utm_source=qr"
            label="Instagram"
          >
            <InstagramIcon />
          </SocialButton>

          <SocialButton
            href="https://www.facebook.com/share/19kSVNyoog/?mibextid=wwXIfr"
            label="Facebook"
          >
            <FacebookIcon />
          </SocialButton>

          <SocialButton
            href="https://youtube.com/@abikyatattoos?si=BErnkd9uVe-CCPiF"
            label="YouTube"
          >
            <YoutubeIcon />
          </SocialButton>
        </div>
      </div>

      {/* RIGHT LOGO */}
      <div className="flex items-center justify-start lg:justify-end">
        <div
          className="
            flex
            w-full
            max-w-[420px]
            items-center
            justify-center
            bg-white
            p-8

            sm:p-10
            lg:max-w-[460px]
          "
        >
          <img
            src={logo}
            alt="ABIKYA Tattoos"
            className="
              h-auto
              w-full
              max-w-[320px]
              object-contain

              sm:max-w-[360px]
            "
          />
        </div>
      </div>
    </div>
  </div>
</section>

      {/* =====================================================
          MAIN CONTACT AREA
      ===================================================== */}
      <section>
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[38%_62%]">
          {/* =================================================
              LEFT SIDE
          ================================================= */}
          <div className="border-b border-black/10 bg-[#f7f7f7] px-5 py-12 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-16">
            <div className="max-w-md">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                Contact the studio
              </p>

              <h2 className="mt-3 text-2xl tracking-tight sm:text-3xl">
                WE’RE HERE TO HELP.
              </h2>

              <p className="mt-4 text-sm leading-7 text-black/55">
                For order support, jewellery questions,
                piercing enquiries or studio visits, reach
                us using the details below.
              </p>

              {/* =============================================
                  CONTACT DETAILS
              ============================================= */}
              <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
                {/* PHONE */}
                <div className="flex gap-4 py-6">
                  <Phone
                    size={20}
                    strokeWidth={1.4}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Call the Studio
                    </p>

                    <a
                      href="tel:+918428961409"
                      className="
                        mt-1
                        inline-block
                        text-sm
                        text-black/55
                        transition-colors
                        duration-300

                        hover:text-black
                      "
                    >
                      +91 84289 61409
                    </a>

                    <p className="mt-1 text-xs leading-5 text-black/40">
                      For studio, piercing and general enquiries.
                    </p>
                  </div>
                </div>

                {/* EMAIL */}
                <div className="flex gap-4 py-6">
                  <Mail
                    size={20}
                    strokeWidth={1.4}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Customer Support
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/50">
                      Email address will be updated soon.
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/40">
                      For online orders, products, returns
                      and customer support.
                    </p>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex gap-4 py-6">
                  <MapPin
                    size={20}
                    strokeWidth={1.4}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Studio Location
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/50">
                      ABIKYA TATTOOS
                    </p>

                    <a
                      href="https://maps.app.goo.gl/R1oFk3nfrBEifJxN8?g_st=iw"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        group
                        mt-3
                        inline-flex
                        items-center
                        gap-2
                        border-b
                        border-black
                        pb-1
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.14em]
                      "
                    >
                      Open in Google Maps

                      <ArrowRight
                        size={13}
                        strokeWidth={1.5}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </a>
                  </div>
                </div>

                {/* HOURS */}
                <div className="flex gap-4 py-6">
                  <Clock3
                    size={20}
                    strokeWidth={1.4}
                    className="mt-0.5 shrink-0"
                  />

                  <div>
                    <p className="text-sm font-medium">
                      Studio Hours
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/50">
                      Contact the studio before visiting.
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/40">
                      Appointment availability may vary.
                    </p>
                  </div>
                </div>
              </div>

              {/* =============================================
                  SOCIAL MEDIA
              ============================================= */}
              <div className="mt-10">
                <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                  Follow the studio
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <SocialIconLink
                    href="https://www.instagram.com/abikya_tattoos?igsi=MTB2eWdwcDhiM3B6OQ%3D%3D&utm_source=qr"
                    label="Instagram"
                  >
                    <InstagramIcon />
                  </SocialIconLink>

                  <SocialIconLink
                    href="https://www.facebook.com/share/19kSVNyoog/?mibextid=wwXIfr"
                    label="Facebook"
                  >
                    <FacebookIcon />
                  </SocialIconLink>

                  <SocialIconLink
                    href="https://youtube.com/@abikyatattoos?si=BErnkd9uVe-CCPiF"
                    label="YouTube"
                  >
                    <YoutubeIcon />
                  </SocialIconLink>

                  <SocialIconLink
                    href="https://maps.app.goo.gl/R1oFk3nfrBEifJxN8?g_st=iw"
                    label="Google Maps"
                  >
                    <MapPinIcon />
                  </SocialIconLink>
                </div>
              </div>

              {/* ORDER NOTE */}
              <div className="mt-10 border border-black/10 bg-white p-5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                  Order related enquiry?
                </p>

                <p className="mt-2 text-sm leading-6 text-black/60">
                  Include your order number when contacting
                  us so our team can help you faster.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE — CONTACT FORM
          ================================================= */}
          <div className="px-5 py-12 sm:px-8 lg:px-14 lg:py-16 xl:px-20">
            <div className="mx-auto max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                Send a message
              </p>

              <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
                CONTACT US
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
                Tell us what you need help with and our
                team will get back to you.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-10"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField label="Name">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className={inputClasses}
                    />
                  </FormField>

                  <FormField label="Email">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className={inputClasses}
                    />
                  </FormField>

                  <FormField label="Phone">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91"
                      className={inputClasses}
                    />
                  </FormField>

                  <FormField label="Subject">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      <option>General Enquiry</option>
                      <option>Order Support</option>
                      <option>Product Question</option>
                      <option>Piercing Enquiry</option>
                      <option>Studio Appointment</option>
                      <option>Returns & Refunds</option>
                      <option>Collaboration</option>
                    </select>
                  </FormField>
                </div>

                <div className="mt-6">
                  <FormField label="Order Number">
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder="Optional"
                      className={inputClasses}
                    />
                  </FormField>
                </div>

                <div className="mt-6">
                  <FormField label="Message">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      required
                      rows={7}
                      className={`${inputClasses} h-auto resize-none py-4`}
                    />
                  </FormField>
                </div>

                <button
                  type="submit"
                  className="
                    group
                    mt-8
                    inline-flex
                    min-h-[56px]
                    items-center
                    justify-center
                    gap-3
                    bg-black
                    px-8
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-white

                    transition-colors
                    duration-300

                    hover:bg-red-600
                  "
                >
                  Send Message

                  <ArrowRight
                    size={15}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

     {/* =====================================================
    GOOGLE MAP CTA
===================================================== */}
<section className="border-t border-white/10 bg-black text-white">
  <div
    className="
      mx-auto
      flex
      max-w-[1600px]
      flex-col
      gap-8
      px-5
      py-12

      sm:px-8

      md:flex-row
      md:items-center
      md:justify-between

      lg:px-16
      lg:py-14
    "
  >
    {/* LEFT */}
    <div className="flex items-start gap-5">
      {/* MAP ICON */}
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-white/20
          text-white
        "
      >
        <MapPinIcon />
      </div>

      {/* TEXT */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
          Find the studio
        </p>

        <h2 className="mt-2 text-2xl tracking-tight text-white sm:text-3xl">
          VISIT ABIKYA TATTOOS
        </h2>

        <p className="mt-2 text-sm text-white/50">
          Open our exact studio location in Google Maps.
        </p>
      </div>
    </div>

    {/* GOOGLE MAP BUTTON */}
    <a
      href="https://maps.app.goo.gl/R1oFk3nfrBEifJxN8?g_st=iw"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#000000",
      }}
      className="
        group
        inline-flex
        min-h-[58px]
        w-fit
        min-w-[230px]
        items-center
        justify-center
        gap-3

        border
        border-white
        bg-white
        px-8

        text-[11px]
        font-medium
        uppercase
        tracking-[0.17em]

        transition-all
        duration-300

        hover:bg-[#e9e9e9]
        hover:border-[#e9e9e9]
      "
    >
      <span
        style={{
          color: "#000000",
        }}
      >
        GET DIRECTIONS
      </span>

      <ArrowRight
        size={15}
        strokeWidth={1.6}
        style={{
          color: "#000000",
        }}
        className="
          transition-transform
          duration-300
          group-hover:translate-x-1
        "
      />
    </a>
  </div>
</section>
    </div>
  );
}

/* =========================================================
   INPUT STYLE
========================================================= */

const inputClasses = `
  h-14
  w-full
  border
  border-black/15
  bg-white
  px-4
  text-sm
  text-black
  outline-none
  transition-colors
  duration-300
  placeholder:text-black/30
  focus:border-black
`;

/* =========================================================
   FORM FIELD
========================================================= */

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

function FormField({
  label,
  children,
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-black/45">
        {label}
      </span>

      {children}
    </label>
  );
}

/* =========================================================
   SOCIAL TEXT BUTTON
========================================================= */

type SocialButtonProps = {
  href: string;
  label: string;
  children: React.ReactNode;
};

function SocialButton({
  href,
  label,
  children,
}: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        group
        inline-flex
        h-11
        items-center
        gap-2.5

        border
        border-black/15
        bg-white
        px-4

        text-[10px]
        font-medium
        uppercase
        tracking-[0.13em]
        text-black

        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:border-black/40
        hover:bg-[#f2f2f2]
        hover:text-black
      "
    >
      <span
        className="
          h-[17px]
          w-[17px]
          transition-transform
          duration-300

          group-hover:scale-110
        "
      >
        {children}
      </span>

      {label}
    </a>
  );
}


/* =========================================================
   SOCIAL ICON BUTTON
========================================================= */

function SocialIconLink({
  href,
  label,
  children,
}: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="
        group
        flex
        h-11
        w-11
        items-center
        justify-center

        rounded-full
        border
        border-black/15
        bg-white
        text-black

        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:border-black/40
        hover:bg-[#f2f2f2]
        hover:text-black
      "
    >
      <span
        className="
          h-[18px]
          w-[18px]
          transition-transform
          duration-300

          group-hover:scale-110
        "
      >
        {children}
      </span>
    </a>
  );
}


/* =========================================================
   INLINE SVG ICONS
========================================================= */

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path d="M13.6 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.3Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.4-4.8ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />

      <circle
        cx="12"
        cy="10"
        r="2.5"
      />
    </svg>
  );
}

export default Contact;