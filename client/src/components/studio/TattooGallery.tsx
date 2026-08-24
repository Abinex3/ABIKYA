// src/components/studio/TattooGallery.tsx

import Reveal from "../common/Reveal";
import ImageReveal from "../common/ImageReveal";

import tattoo01 from "../../assets/studio/tattoos/tattoo-01.jpeg";
import tattoo02 from "../../assets/studio/tattoos/tattoo-02.jpeg";
import tattoo03 from "../../assets/studio/tattoos/tattoo-03.jpeg";
import tattoo04 from "../../assets/studio/tattoos/tattoo-04.jpeg";
import tattoo05 from "../../assets/studio/tattoos/tattoo-05.jpeg";
import tattoo06 from "../../assets/studio/tattoos/tattoo-06.jpeg";
import tattoo07 from "../../assets/studio/tattoos/tattoo-07.jpeg";
import tattoo08 from "../../assets/studio/tattoos/tattoo-08.jpeg";
import tattoo09 from "../../assets/studio/tattoos/tattoo-09.jpeg";
import tattoo10 from "../../assets/studio/tattoos/tattoo-10.jpeg";
import tattoo11 from "../../assets/studio/tattoos/tattoo-11.jpeg";
import tattoo12 from "../../assets/studio/tattoos/tattoo-12.jpeg";
import tattoo13 from "../../assets/studio/tattoos/tattoo-13.jpeg";
import tattoo14 from "../../assets/studio/tattoos/tattoo-14.jpeg";
import tattoo15 from "../../assets/studio/tattoos/tattoo-15.jpeg";
import tattoo16 from "../../assets/studio/tattoos/tattoo-16.jpeg";
import tattoo17 from "../../assets/studio/tattoos/tattoo-17.jpeg";
import tattoo18 from "../../assets/studio/tattoos/tattoo-18.jpeg";

const tattoos = [
  tattoo01,
  tattoo02,
  tattoo03,
  tattoo04,
  tattoo05,
  tattoo06,
  tattoo07,
  tattoo08,
  tattoo09,
  tattoo10,
  tattoo11,
  tattoo12,
  tattoo13,
  tattoo14,
  tattoo15,
  tattoo16,
  tattoo17,
  tattoo18,
];

const TattooGallery = () => {
  return (
    <section
      id="tattoo-gallery"
      className="overflow-hidden bg-[#f5f5f3] px-4 py-24 sm:px-6 md:py-32 lg:px-10 lg:py-40"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* =========================
            SECTION HEADING
        ========================== */}
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 border-b border-black/15 pb-8 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-black/45">
                Inked At ABIKYA
              </p>

              <h2 className="text-[40px] font-medium uppercase leading-[0.95] tracking-[-0.04em] text-black sm:text-[52px] md:text-[66px] lg:text-[78px]">
                Real Work.
                <br />
                Real Stories.
              </h2>
            </div>

            <p className="max-w-[460px] text-[14px] leading-7 text-black/60 md:text-[15px]">
              A selection of tattoos created at ABIKYA — each piece shaped
              around an idea, a story and the person who wears it.
            </p>
          </div>
        </Reveal>

        {/* =========================
            TATTOO GALLERY
        ========================== */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {tattoos.map((tattoo, index) => {
            /*
             * Give selected images more visual importance.
             * This breaks up the regular grid and creates
             * an editorial portfolio layout.
             */
            const isFeatured =
              index === 0 ||
              index === 7 ||
              index === 12;

            return (
              <div
                key={index}
                className={
                  isFeatured
                    ? "col-span-2 row-span-2"
                    : "col-span-1"
                }
              >
                <ImageReveal
                  className={`group relative w-full overflow-hidden ${
                    isFeatured
                      ? "aspect-square"
                      : "aspect-[4/5]"
                  }`}
                >
                  <img
                    src={tattoo}
                    alt={`Tattoo artwork created at ABIKYA ${
                      index + 1
                    }`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  />

                  {/* Hover Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />

                  {/* Hover Number */}
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex translate-y-3 items-end justify-between p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-5">
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white">
                      ABIKYA / Tattoo
                    </p>

                    <span className="text-[10px] tracking-[0.15em] text-white/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </ImageReveal>
              </div>
            );
          })}
        </div>

        {/* =========================
            GALLERY FOOTER
        ========================== */}
        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col gap-7 border-t border-black/15 pt-8 sm:flex-row sm:items-end sm:justify-between md:mt-16">
            <div>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-black/35">
                Tattoo Portfolio
              </p>

              <p className="max-w-[560px] text-[13px] leading-6 text-black/50 md:text-[14px]">
                Every piece is different. These are some of the stories,
                ideas and artworks brought to life inside the ABIKYA studio.
              </p>
            </div>

            <a
              href="/contact"
              className="group inline-flex w-fit items-center gap-3 border-b border-black pb-2 text-[12px] font-medium uppercase tracking-[0.16em] text-black transition-opacity duration-300 hover:opacity-50"
            >
              Start Your Tattoo

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default TattooGallery;