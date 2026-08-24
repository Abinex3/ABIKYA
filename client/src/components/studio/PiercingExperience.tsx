// src/components/studio/PiercingExperience.tsx

import piercingExperience from "../../assets/about/tattoo-artist.png";

import Reveal from "../common/Reveal";
import ImageReveal from "../common/ImageReveal";

const PiercingExperience = () => {
  return (
    <section className="overflow-hidden bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Content */}
        <div className="order-2 flex min-w-0 items-center px-6 py-20 sm:px-10 md:px-14 lg:order-1 lg:min-h-[800px] lg:px-16 xl:px-24">
          <Reveal direction="left" className="w-full">
            <div className="max-w-[650px]">
              {/* Label */}
              <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.3em] text-black/45 md:text-[12px]">
                Piercing At ABIKYA
              </p>

              {/* Heading */}
              <h2 className="text-[42px] font-medium uppercase leading-[0.92] tracking-[-0.04em] text-black sm:text-[54px] md:text-[64px] lg:text-[72px] xl:text-[82px]">
                Precision.
                <br />
                Style.
                <br />
                Individuality.
              </h2>

              {/* Description */}
              <div className="mt-10 max-w-[570px] space-y-6 text-[15px] leading-7 text-black/60 md:text-[16px] md:leading-8">
                <p>
                  Piercing is more than placement — it&apos;s another way to
                  make your style personal. At ABIKYA, every piercing
                  experience is approached with attention, precision and care.
                </p>

                <p>
                  From subtle everyday details to expressive ear styling, we
                  help you find placements and jewellery that feel right for
                  you.
                </p>
              </div>

              {/* Experience Details */}
              <div className="mt-12 grid max-w-[570px] grid-cols-1 border-y border-black/15 sm:grid-cols-3">
                <div className="border-b border-black/15 py-6 sm:border-b-0 sm:border-r sm:pr-5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/35">
                    01
                  </span>

                  <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-black/75">
                    Choose
                  </p>
                </div>

                <div className="border-b border-black/15 py-6 sm:border-b-0 sm:border-r sm:px-5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/35">
                    02
                  </span>

                  <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-black/75">
                    Pierce
                  </p>
                </div>

                <div className="py-6 sm:pl-5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/35">
                    03
                  </span>

                  <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-black/75">
                    Style
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                <a
                  href="/shop"
                  className="group inline-flex items-center gap-3 border-b border-black pb-2 text-[12px] font-medium uppercase tracking-[0.16em] text-black transition-opacity duration-300 hover:opacity-50"
                >
                  Explore Jewellery

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>

                <a
                  href="/contact"
                  className="text-[12px] font-medium uppercase tracking-[0.16em] text-black/50 transition-colors duration-300 hover:text-black"
                >
                  Contact Studio
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Piercing Image */}
        <div className="order-1 lg:order-2">
          <ImageReveal className="relative min-h-[560px] lg:min-h-[800px]">
            <img
              src={piercingExperience}
              alt="Piercing experience at ABIKYA studio"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Editorial treatment */}
            <div className="pointer-events-none absolute inset-0 bg-black/5" />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </ImageReveal>
        </div>
      </div>
    </section>
  );
};

export default PiercingExperience;