// src/components/studio/StudioIntro.tsx

import Reveal from "../common/Reveal";

const StudioIntro = () => {
  return (
    <section
      id="studio-intro"
      className="overflow-hidden bg-[#f5f5f3] px-6 py-24 sm:px-10 md:py-32 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="text-center">
            <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.3em] text-black/45 md:text-[12px]">
              More Than A Studio
            </p>

            <h2 className="mx-auto max-w-[1250px] text-[34px] font-medium uppercase leading-[1.05] tracking-[-0.035em] text-black sm:text-[44px] md:text-[56px] lg:text-[68px] xl:text-[76px]">
              A Place Where Art,
              <br className="hidden sm:block" />
              Identity & Culture Meet.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-10 max-w-[820px] text-center md:mt-12">
            <p className="text-[15px] leading-7 text-black/65 sm:text-[16px] md:text-[18px] md:leading-8">
              ABIKYA is a creative space built around tattoos, piercings,
              jewellery and individual expression. Every visit is personal —
              whether you are getting your first tattoo, choosing a new
              piercing or simply discovering a style that feels like you.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mx-auto mt-12 flex max-w-[900px] flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-black/15 pt-8 md:mt-14">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/55">
              Tattoo
            </span>

            <span className="h-1 w-1 rounded-full bg-black/30" />

            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/55">
              Piercing
            </span>

            <span className="h-1 w-1 rounded-full bg-black/30" />

            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/55">
              Jewellery
            </span>

            <span className="h-1 w-1 rounded-full bg-black/30" />

            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/55">
              Self-Expression
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default StudioIntro;