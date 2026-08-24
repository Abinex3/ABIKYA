// src/components/studio/TattooExperience.tsx

import tattooExperience from "../../assets/about/tattoo-artist.png";

import Reveal from "../common/Reveal";
import ImageReveal from "../common/ImageReveal";

const TattooExperience = () => {
  return (
    <section className="overflow-hidden bg-black text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Tattoo Artist Image */}
        <ImageReveal className="relative min-h-[560px] lg:min-h-[820px]">
          <img
            src={tattooExperience}
            alt="Tattoo artist working at ABIKYA studio"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark cinematic overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/10" />

          {/* Bottom gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
        </ImageReveal>

        {/* Content */}
        <div className="flex min-w-0 items-center px-6 py-20 sm:px-10 md:px-14 lg:min-h-[820px] lg:px-16 xl:px-24">
          <Reveal direction="right" className="w-full">
            <div className="max-w-[650px]">
              {/* Label */}
              <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.3em] text-white/45 md:text-[12px]">
                Tattoos At ABIKYA
              </p>

              {/* Heading */}
              <h2 className="text-[42px] font-medium uppercase leading-[0.92] tracking-[-0.04em] sm:text-[54px] md:text-[64px] lg:text-[72px] xl:text-[82px]">
                Your Idea.
                <br />
                Your Story.
                <br />
                Your Ink.
              </h2>

              {/* Description */}
              <div className="mt-10 max-w-[570px] space-y-6 text-[15px] leading-7 text-white/60 md:text-[16px] md:leading-8">
                <p>
                  Every tattoo starts with something personal. An idea, a
                  memory, a feeling or simply a piece of art you want to carry
                  with you.
                </p>

                <p>
                  At ABIKYA, we bring those ideas to life through thoughtful
                  design, careful detail and an experience built around you.
                  From minimal pieces to expressive artwork, every tattoo is
                  approached with intention.
                </p>
              </div>

              {/* Small Detail Row */}
              <div className="mt-12 grid max-w-[570px] grid-cols-1 gap-6 border-y border-white/15 py-7 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                    01
                  </p>

                  <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-white/80">
                    Consult
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                    02
                  </p>

                  <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-white/80">
                    Create
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                    03
                  </p>

                  <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-white/80">
                    Ink
                  </p>
                </div>
              </div>

              {/* CTA */}
              <a
                href="#tattoo-gallery"
                className="group mt-10 inline-flex items-center gap-3 border-b border-white pb-2 text-[12px] font-medium uppercase tracking-[0.16em] transition-opacity duration-300 hover:opacity-60"
              >
                Explore Our Work

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default TattooExperience;