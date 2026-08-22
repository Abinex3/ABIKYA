import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import hero1 from "../../assets/hero/hero-1.png";
import hero2 from "../../assets/hero/hero-2.png";
import hero3 from "../../assets/hero/hero-3.png";
import hero4 from "../../assets/hero/hero-4.png";

const slides = [
  {
    image: hero1,
    title: "EXPRESS\nYOUR STYLE",
    description: "Premium studs made for every version of you.",
    primaryCta: "Shop Studs",
    secondaryCta: "New Arrivals",
  },
  {
    image: hero2,
    title: "SMALL DETAIL.\nBIG STATEMENT.",
    description: "Minimal pieces designed to stand out.",
    primaryCta: "Shop Nose Studs",
    secondaryCta: "Best Sellers",
  },
  {
    image: hero3,
    title: "OWN\nEVERY EDGE",
    description: "Helix and cartilage studs with attitude.",
    primaryCta: "Shop Helix",
    secondaryCta: "Explore Styles",
  },
  {
    image: hero4,
    title: "PIERCED\nDIFFERENT",
    description: "Bold details for your individual style.",
    primaryCta: "Shop Now",
    secondaryCta: "View Collection",
  },
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section className="relative overflow-hidden bg-black">
      <div className="relative h-[72vh] min-h-[560px] w-full lg:h-[calc(100vh-130px)] lg:min-h-[650px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title.replace("\n", " ")}
              className="h-full w-full object-cover object-center"
            />

            {/* DARK OVERLAY FOR TEXT READABILITY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
          </div>
        ))}

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-center px-6 sm:px-10 lg:px-16">
          <div className="max-w-xl text-white">
            <h1 className="whitespace-pre-line text-4xl leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {slides[currentSlide].title}
            </h1>

            <p className="mt-6 max-w-md text-sm leading-6 text-white/80 sm:text-base">
              {slides[currentSlide].description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="border border-white bg-white px-6 py-3 text-xs uppercase tracking-[0.15em] text-black transition-colors duration-300 hover:bg-black hover:text-white"
              >
                {slides[currentSlide].primaryCta}
              </button>

              <button
                type="button"
                className="border border-white px-6 py-3 text-xs uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
              >
                {slides[currentSlide].secondaryCta}
              </button>
            </div>
          </div>
        </div>

        {/* LEFT ARROW */}
        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 text-white transition-opacity hover:opacity-60 sm:left-5"
        >
          <ChevronLeft size={30} strokeWidth={1.4} />
        </button>

        {/* RIGHT ARROW */}
        <button
          type="button"
          onClick={goToNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 text-white transition-opacity hover:opacity-60 sm:right-5"
        >
          <ChevronRight size={30} strokeWidth={1.4} />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 w-2.5 rounded-full border border-white transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;