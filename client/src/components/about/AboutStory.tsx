// src/components/about/AboutStory.tsx

import founderImage from "../../assets/about/founder.png";


const AboutStory = () => {
  return (
    <section className="bg-[#f5f5f3]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Founder / Store Image */}
        <div className="relative min-h-[520px] lg:min-h-[760px]">
          <img
            src={founderImage}
            alt="ABIKYA founder and studio"
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />
        </div>

        {/* Content */}
        <div className="flex items-center px-6 py-20 sm:px-10 md:px-14 lg:px-16 xl:px-24">
          <div className="max-w-[650px]">
            <p className="mb-5 text-[12px] font-medium uppercase tracking-[0.25em] text-black/55">
              Our Story
            </p>

            <h2 className="text-[38px] font-medium uppercase leading-[0.95] tracking-[-0.03em] text-black sm:text-[48px] md:text-[58px] lg:text-[64px]">
              The Story
              <br />
              Behind ABIKYA
            </h2>

            <h3 className="mt-10 text-[16px] font-semibold uppercase tracking-[0.03em] text-black md:text-[18px]">
              Built From Passion. Made For Expression.
            </h3>

            <div className="mt-7 max-w-[560px] space-y-5 text-[15px] leading-7 text-black/70 md:text-[16px]">
              <p>
                ABIKYA began with a simple idea — to create a space where
                jewellery, piercing and tattoo culture could come together
                naturally.
              </p>

              <p>
                What started as a passion for body art and individual style has
                grown into a studio built around creativity, detail and
                self-expression.
              </p>

              <p>
                From carefully selected jewellery to professional piercing and
                tattoo experiences, everything at ABIKYA is created to help
                people wear their identity with confidence.
              </p>
            </div>

            <a
              href="/studio"
              className="mt-10 inline-flex items-center border-b border-black pb-1 text-[13px] font-medium uppercase tracking-[0.12em] transition-opacity duration-300 hover:opacity-50"
            >
              Discover Our Studio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;