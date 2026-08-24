// src/components/about/AboutPhilosophy.tsx

import Reveal from "../common/Reveal";

const AboutPhilosophy = () => {
  return (
    <section className="overflow-hidden bg-black px-6 py-24 text-white sm:px-10 md:py-32 lg:px-16 lg:py-40">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
        
        {/* Label */}
        <Reveal delay={0}>
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-white/50 md:text-[12px]">
            Our Philosophy
          </p>
        </Reveal>

        {/* Main Heading */}
        <Reveal delay={0.1}>
          <h2 className="text-[42px] font-medium uppercase leading-[0.95] tracking-[-0.04em] sm:text-[56px] md:text-[72px] lg:text-[88px]">
            Made To Be Yours.
          </h2>
        </Reveal>

        {/* Description */}
        <Reveal delay={0.2}>
          <p className="mt-10 max-w-[760px] text-[15px] leading-7 text-white/65 sm:text-[16px] md:text-[18px] md:leading-8">
            Tattoos, piercings and jewellery are different forms of the same
            thing — self-expression. At ABIKYA, we believe there are no rules
            for how you choose to wear your identity.
          </p>
        </Reveal>

        {/* Statement */}
        <Reveal delay={0.3}>
          <p className="mt-5 text-[14px] font-medium uppercase tracking-[0.18em] text-white">
            Your body. Your story. Your way.
          </p>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.4}>
          <a
            href="/studio"
            className="group mt-12 inline-flex items-center gap-3 border-b border-white pb-2 text-[12px] font-medium uppercase tracking-[0.16em] transition-opacity duration-300 hover:opacity-60"
          >
            Visit Our Studio

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default AboutPhilosophy;