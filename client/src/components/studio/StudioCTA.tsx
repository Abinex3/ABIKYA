// src/components/studio/StudioCTA.tsx

import { ArrowUpRight } from "lucide-react";
import Reveal from "../common/Reveal";

const StudioCTA = () => {
  return (
    <section className="overflow-hidden bg-[#f5f5f3] px-6 py-24 sm:px-10 md:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-center text-center">
          {/* Label */}
          <Reveal>
            <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.3em] text-black/40 md:text-[12px]">
              Ready When You Are
            </p>
          </Reveal>

          {/* Heading */}
          <Reveal delay={0.1}>
            <h2 className="max-w-[1200px] text-[42px] font-medium uppercase leading-[0.92] tracking-[-0.045em] text-black sm:text-[56px] md:text-[72px] lg:text-[90px] xl:text-[104px]">
              Your Next Piece
              <br />
              Starts Here.
            </h2>
          </Reveal>

          {/* Description */}
          <Reveal delay={0.2}>
            <p className="mt-9 max-w-[700px] text-[15px] leading-7 text-black/55 sm:text-[16px] md:text-[18px] md:leading-8">
              Whether it&apos;s your first tattoo, a new piercing, or an idea
              you&apos;ve been carrying for a while — come create something
              personal with ABIKYA.
            </p>
          </Reveal>

         {/* CTAs */}
<Reveal delay={0.3}>
  <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
    {/* Primary CTA */}
    <a
      href="/contact"
      className="group inline-flex min-w-[300px] items-center justify-center gap-3 bg-black px-8 py-5 text-[11px] font-medium uppercase tracking-[0.17em] !text-white transition-all duration-300 hover:bg-black/80 hover:!text-white"
    >
      <span className="!text-white">
        Contact The Studio
      </span>

      <ArrowUpRight
        size={15}
        strokeWidth={1.5}
        className="text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
      />
    </a>

    {/* Secondary CTA */}
    <a
      href="/shop"
      className="group inline-flex min-w-[300px] items-center justify-center gap-3 border border-black bg-transparent px-8 py-5 text-[11px] font-medium uppercase tracking-[0.17em] !text-black transition-all duration-300 hover:bg-black hover:!text-white"
    >
      <span className="transition-colors duration-300 group-hover:!text-white">
        Explore Jewellery
      </span>

      <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:!text-white">
        →
      </span>
    </a>
  </div>
</Reveal>

          {/* Closing Statement */}
          <Reveal delay={0.4}>
            <div className="mt-16 border-t border-black/15 pt-7 md:mt-20">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-black/35">
                Tattoo · Piercing · Jewellery · Self-Expression
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default StudioCTA;