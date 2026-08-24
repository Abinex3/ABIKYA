// src/components/about/AboutCraft.tsx

import tattooArtist from "../../assets/about/tattoo-artist.png";

const AboutCraft = () => {
  return (
    <section className="bg-[#f5f5f3]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Content */}
        <div className="flex min-h-[520px] items-center px-6 py-20 sm:px-10 md:px-14 lg:min-h-[760px] lg:px-16 xl:px-24">
          <div className="max-w-[650px]">
            <p className="mb-5 text-[12px] font-medium uppercase tracking-[0.25em] text-black/55">
              Our Craft
            </p>

            <h2 className="text-[38px] font-medium uppercase leading-[0.95] tracking-[-0.03em] text-black sm:text-[48px] md:text-[58px] lg:text-[64px]">
              Art, Identity
              <br />
              & Expression
            </h2>

            <div className="mt-9 max-w-[570px] space-y-6 text-[15px] leading-7 text-black/70 md:text-[16px]">
              <p>
                At ABIKYA, body art is personal. From thoughtfully chosen
                jewellery and precision piercings to tattoos created with
                intention, every detail is about helping you express something
                that feels uniquely yours.
              </p>

              <p>
                We believe the best work begins with trust, creativity and
                attention to detail. Whether it&apos;s a subtle piercing or a
                tattoo that carries a story, our studio is a space to make it
                yours.
              </p>
            </div>

            <a
              href="/studio"
              className="mt-10 inline-flex border-b border-black pb-1 text-[13px] font-medium uppercase tracking-[0.12em] transition-opacity duration-300 hover:opacity-50"
            >
              Explore Our Studio
            </a>
          </div>
        </div>

        {/* Tattoo Artist Image */}
        <div className="relative min-h-[520px] lg:min-h-[760px]">
          <img
            src={tattooArtist}
            alt="Tattoo artist working at ABIKYA studio"
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />

          {/* Subtle dark editorial treatment */}
          <div className="pointer-events-none absolute inset-0 bg-black/10" />
        </div>
      </div>
    </section>
  );
};

export default AboutCraft;