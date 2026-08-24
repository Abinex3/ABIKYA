// src/components/about/AboutHero.tsx

import aboutHero from "../../assets/about/about-hero.png";

const AboutHero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="grid min-h-[72vh] grid-cols-1 md:grid-cols-[34%_66%] lg:min-h-[82vh]">
        {/* Left */}
        <div className="flex bg-black px-6 py-14 text-white sm:px-10 md:px-12 lg:px-16 xl:px-20">
          <div className="flex w-full flex-col justify-between">
            <div>
              <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-white/60">
                About ABIKYA
              </p>

              <h1 className="text-[clamp(3.5rem,7vw,8rem)] font-medium uppercase leading-[0.82] tracking-[-0.05em]">
                Our
                <br />
                Vision
              </h1>
            </div>

            <p className="mt-16 max-w-[320px] text-sm leading-6 text-white/65 md:mt-0">
              Jewellery for self-expression. Piercing culture without
              boundaries. Designed for people who wear their individuality
              their own way.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-[55vh] md:min-h-full">
          <img
            src={aboutHero}
            alt="ABIKYA piercing jewellery editorial"
            className="absolute inset-0 h-full w-full object-cover object-center grayscale"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutHero;