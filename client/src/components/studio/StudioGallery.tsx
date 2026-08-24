// src/components/studio/StudioGallery.tsx

import Reveal from "../common/Reveal";
import ImageReveal from "../common/ImageReveal";

import studio01 from "../../assets/studio/studio-01.png";
import studio02 from "../../assets/studio/studio-02.png";
import studio03 from "../../assets/studio/studio-01.png";
import studio04 from "../../assets/studio/studio-02.png";
import studio05 from "../../assets/studio/studio-01.png";

const StudioGallery = () => {
  return (
    <section className="overflow-hidden bg-white px-4 py-24 sm:px-6 md:py-32 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-[1600px]">
        {/* Section Heading */}
        <Reveal>
          <div className="mb-12 flex flex-col gap-5 border-b border-black/15 pb-8 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-black/45">
                Inside ABIKYA
              </p>

              <h2 className="text-[38px] font-medium uppercase leading-[0.95] tracking-[-0.035em] text-black sm:text-[48px] md:text-[60px] lg:text-[72px]">
                Step Inside
                <br />
                Our Space.
              </h2>
            </div>

            <p className="max-w-[460px] text-[14px] leading-7 text-black/60 md:text-[15px]">
              A closer look at the space where ideas become tattoos, piercings
              and personal expressions.
            </p>
          </div>
        </Reveal>

        {/* Top Editorial Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Large Image */}
          <div className="lg:col-span-8">
            <ImageReveal className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[16/10]">
              <img
                src={studio01}
                alt="ABIKYA studio interior"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </ImageReveal>
          </div>

          {/* Right Stack */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <ImageReveal className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[300px]">
              <img
                src={studio02}
                alt="ABIKYA studio detail"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </ImageReveal>

            <ImageReveal className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[300px]">
              <img
                src={studio03}
                alt="Inside ABIKYA tattoo studio"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </ImageReveal>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <ImageReveal className="relative aspect-[4/3] overflow-hidden md:aspect-[5/6]">
              <img
                src={studio04}
                alt="ABIKYA tattoo workstation"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </ImageReveal>
          </div>

          <div className="md:col-span-7">
            <ImageReveal className="relative aspect-[4/3] overflow-hidden md:aspect-[7/5]">
              <img
                src={studio05}
                alt="ABIKYA studio atmosphere"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
            </ImageReveal>
          </div>
        </div>

        {/* Bottom Caption */}
        <Reveal delay={0.15}>
          <div className="mt-10 flex justify-end md:mt-12">
            <p className="max-w-[620px] text-right text-[13px] uppercase leading-6 tracking-[0.08em] text-black/45 md:text-[14px]">
              Designed for comfort, creativity and the kind of work that stays
              with you.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default StudioGallery;