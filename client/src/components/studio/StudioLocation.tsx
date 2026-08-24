// src/components/studio/StudioLocation.tsx

import { ArrowUpRight, MapPin } from "lucide-react";
import Reveal from "../common/Reveal";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Abikya+Tattoos/@9.3699414,78.8376369,17z/data=!3m1!4b1!4m6!3m5!1s0x3b019795d53e05c1:0xa4c0c966d62830c3!8m2!3d9.3699414!4d78.8376369!16s%2Fg%2F11r9bb4c3q?hl=en-GB&entry=ttu";

const MAP_EMBED_URL =
  "https://www.google.com/maps?q=9.3699414,78.8376369&z=17&output=embed";

const StudioLocation = () => {
  return (
    <section className="overflow-hidden bg-black text-white">
      <div className="grid grid-cols-1 lg:grid-cols-[58%_42%]">
        {/* =========================
            GOOGLE MAP
        ========================== */}
        <div className="relative min-h-[520px] overflow-hidden bg-[#e9e9e9] lg:min-h-[780px]">
          <iframe
            src={MAP_EMBED_URL}
            title="ABIKYA Tattoos Studio Location"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />

          {/* Studio Map Label */}
          <div className="pointer-events-none absolute bottom-5 left-5 z-10 sm:bottom-7 sm:left-7">
            <div className="flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-white shadow-lg">
              <MapPin
                size={15}
                strokeWidth={1.8}
                className="text-red-500"
              />

              <span className="text-[10px] font-medium uppercase tracking-[0.16em]">
                ABIKYA Tattoos
              </span>
            </div>
          </div>
        </div>

        {/* =========================
            LOCATION INFORMATION
        ========================== */}
        <div className="flex min-w-0 items-center px-6 py-20 sm:px-10 md:px-14 lg:min-h-[780px] lg:px-14 xl:px-20">
          <Reveal direction="right" className="w-full">
            <div className="max-w-[560px]">
              {/* Label */}
              <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.3em] text-white/45 md:text-[12px]">
                Visit ABIKYA
              </p>

              {/* Heading */}
              <h2 className="text-[46px] font-medium uppercase leading-[0.9] tracking-[-0.045em] sm:text-[58px] md:text-[68px] lg:text-[76px] xl:text-[84px]">
                Come
                <br />
                See Us.
              </h2>

              {/* Description */}
              <p className="mt-9 max-w-[500px] text-[15px] leading-7 text-white/60 md:text-[16px] md:leading-8">
                Step inside ABIKYA and experience the studio for yourself.
                Whether you&apos;re planning your next tattoo, exploring a new
                piercing or looking for jewellery, we&apos;d love to have you
                visit.
              </p>

              {/* =========================
                  STUDIO DETAILS
              ========================== */}
              <div className="mt-12 border-t border-white/15">
                {/* Location */}
                <div className="grid grid-cols-[90px_1fr] gap-5 border-b border-white/15 py-6 sm:grid-cols-[120px_1fr]">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
                    Location
                  </p>

                  <div>
                    <p className="text-[14px] font-medium uppercase tracking-[0.08em] text-white">
                      ABIKYA Tattoos
                    </p>

                    <p className="mt-2 text-[14px] leading-6 text-white/60">
                      Ramanathapuram
                      <br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="grid grid-cols-[90px_1fr] gap-5 border-b border-white/15 py-6 sm:grid-cols-[120px_1fr]">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
                    Hours
                  </p>

                  <div className="text-[14px] leading-6 text-white/80">
                    <p>Monday — Sunday</p>
                    <p className="text-white/55">
                      10:00 AM — 8:00 PM
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-[90px_1fr] gap-5 border-b border-white/15 py-6 sm:grid-cols-[120px_1fr]">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
                    Contact
                  </p>

                  <div className="text-[14px] leading-6 text-white/80">
                    <p>+91 XXXXX XXXXX</p>
                  </div>
                </div>
              </div>

              {/* =========================
                  CTA BUTTONS
              ========================== */}
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                {/* Google Maps */}
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-3 border-b border-white pb-2 text-[12px] font-medium uppercase tracking-[0.16em] text-white transition-opacity duration-300 hover:opacity-60"
                >
                  Get Directions

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </a>

                {/* Contact */}
                <a
                  href="/contact"
                  className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/45 transition-colors duration-300 hover:text-white"
                >
                  Contact Studio
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default StudioLocation;