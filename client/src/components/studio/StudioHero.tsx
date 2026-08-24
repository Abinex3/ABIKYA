// src/components/studio/StudioHero.tsx

import { motion } from "framer-motion";
import studioHero from "../../assets/studio/studio-hero.png";

const StudioHero = () => {
  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-black lg:min-h-[88vh]">
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0"
      >
        <img
          src={studioHero}
          alt="Inside the ABIKYA tattoo and piercing studio"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-[1600px] items-end px-6 pb-14 pt-32 sm:px-10 md:pb-16 lg:min-h-[88vh] lg:px-16 lg:pb-20 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full"
        >
          {/* Label */}
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.3em] text-white/65 md:text-[12px]">
            Our Studio
          </p>

          {/* Heading */}
          <h1 className="max-w-[1100px] text-[48px] font-medium uppercase leading-[0.88] tracking-[-0.045em] text-white sm:text-[64px] md:text-[82px] lg:text-[105px] xl:text-[120px]">
            A Space For
            <br />
            Self-Expression.
          </h1>

          {/* Bottom Content */}
          <div className="mt-9 flex flex-col gap-7 border-t border-white/30 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[13px] uppercase tracking-[0.18em] text-white/80">
                Tattoo · Piercing · Jewellery
              </p>

              <p className="mt-3 max-w-[500px] text-[14px] leading-6 text-white/60 sm:text-[15px]">
                A creative space built for individuality, artistry and the
                freedom to make your body your own.
              </p>
            </div>

            {/* Scroll Indicator */}
            <a
              href="#studio-intro"
              className="group inline-flex w-fit items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white"
            >
              Discover The Studio

              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 transition-all duration-300 group-hover:bg-white group-hover:text-black">
                ↓
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StudioHero;