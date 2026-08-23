import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import lobeProduct from "../../assets/categories/lobe-product.png";
import lobeWorn from "../../assets/categories/lobe-worn.png";

import bugadiProduct from "../../assets/categories/bugadi-product.png";
import bugadiWorn from "../../assets/categories/bugadi-worn.png";

import bellyButtonProduct from "../../assets/categories/belly-button-product.png";
import bellyButtonWorn from "../../assets/categories/belly-button-worn.png";

import noseProduct from "../../assets/categories/nose-product.png";
import noseWorn from "../../assets/categories/nose-worn.png";

import eyebrowProduct from "../../assets/categories/eyebrow-product.png";
import eyebrowWorn from "../../assets/categories/eyebrow-worn.png";

import tongueProduct from "../../assets/categories/tongue-product.png";
import tongueWorn from "../../assets/categories/tongue-worn.png";

import upperLobeProduct from "../../assets/categories/upper-lobe-product.png";
import upperLobeWorn from "../../assets/categories/upper-lobe-worn.png";

import flatProduct from "../../assets/categories/flat-product.png";
import flatWorn from "../../assets/categories/flat-worn.png";

import helixProduct from "../../assets/categories/helix-product.png";
import helixWorn from "../../assets/categories/helix-worn.png";

import snugProduct from "../../assets/categories/snug-product.png";
import snugWorn from "../../assets/categories/snug-worn.png";

import conchProduct from "../../assets/categories/conch-product.png";
import conchWorn from "../../assets/categories/conch-worn.png";

import tragusProduct from "../../assets/categories/tragus-product.png";
import tragusWorn from "../../assets/categories/tragus-worn.png";

import daithProduct from "../../assets/categories/daith-product.png";
import daithWorn from "../../assets/categories/daith-worn.png";

const categories = [
  {
    name: "Lobe",
    slug: "lobe",
    productImage: lobeProduct,
    wornImage: lobeWorn,
  },
  {
    name: "Bugadi",
    slug: "bugadi",
    productImage: bugadiProduct,
    wornImage: bugadiWorn,
  },
  {
    name: "Belly Button",
    slug: "belly-button",
    productImage: bellyButtonProduct,
    wornImage: bellyButtonWorn,
  },
  {
    name: "Nose",
    slug: "nose",
    productImage: noseProduct,
    wornImage: noseWorn,
  },
  {
    name: "Eyebrow",
    slug: "eyebrow",
    productImage: eyebrowProduct,
    wornImage: eyebrowWorn,
  },
  {
    name: "Tongue",
    slug: "tongue",
    productImage: tongueProduct,
    wornImage: tongueWorn,
  },
  {
    name: "Upper Lobe",
    slug: "upper-lobe",
    productImage: upperLobeProduct,
    wornImage: upperLobeWorn,
  },
  {
    name: "Flat",
    slug: "flat",
    productImage: flatProduct,
    wornImage: flatWorn,
  },
  {
    name: "Helix",
    slug: "helix",
    productImage: helixProduct,
    wornImage: helixWorn,
  },
  {
    name: "Snug",
    slug: "snug",
    productImage: snugProduct,
    wornImage: snugWorn,
  },
  {
    name: "Conch",
    slug: "conch",
    productImage: conchProduct,
    wornImage: conchWorn,
  },
  {
    name: "Tragus",
    slug: "tragus",
    productImage: tragusProduct,
    wornImage: tragusWorn,
  },
  {
    name: "Daith",
    slug: "daith",
    productImage: daithProduct,
    wornImage: daithWorn,
  },
];

function ShopByPiercing() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);

const handleScroll = () => {
  const container = scrollRef.current;

  if (!container) return;

  const maxScroll = container.scrollWidth - container.clientWidth;

  if (maxScroll <= 0) {
    setScrollProgress(100);
    return;
  }

  const progress = (container.scrollLeft / maxScroll) * 100;

  setScrollProgress(Math.min(100, Math.max(0, progress)));
};

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -700,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 700,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-[#f5f5f5]">
      {/* HEADER */}
      <div className="flex items-end justify-between border-b border-black/15 px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-black/45 sm:text-xs">
            Explore by placement
          </p>

          <h2 className="text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl">
            SHOP BY PIERCING
          </h2>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll piercing categories left"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20 text-black transition-all duration-300 hover:bg-black hover:text-white"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll piercing categories right"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/20 text-black transition-all duration-300 hover:bg-black hover:text-white"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* CATEGORY SLIDER */}
      <div
  ref={scrollRef}
  onScroll={handleScroll}
  className="
    flex snap-x snap-mandatory overflow-x-auto scroll-smooth
    [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden
  "
>
        {categories.map((category) => (
          <a
            key={category.slug}
            href={`/shop?style=${category.slug}`}
            className="
              group relative min-w-[82%] snap-start
              border-r border-black/15
              sm:min-w-[48%]
              md:min-w-[36%]
              lg:min-w-[25%]
              xl:min-w-[20%]
            "
          >
            {/* IMAGE AREA */}
            <div className="relative aspect-[4/5] overflow-hidden bg-white">
              {/* PRODUCT IMAGE */}
              <img
                src={category.productImage}
                alt={`${category.name} stud`}
                loading="lazy"
                className="
                  absolute inset-0 h-full w-full object-cover
                  opacity-100
                  transition-all duration-700 ease-out
                  group-hover:scale-[1.03]
                  group-hover:opacity-0
                "
              />

              {/* WORN IMAGE */}
              <img
                src={category.wornImage}
                alt={`${category.name} piercing worn`}
                loading="lazy"
                className="
                  absolute inset-0 h-full w-full object-cover
                  scale-[1.03] opacity-0
                  transition-all duration-700 ease-out
                  group-hover:scale-100
                  group-hover:opacity-100
                "
              />

              {/* SUBTLE OVERLAY */}
              <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/[0.03]" />

              {/* VIEW TEXT */}
              <div
                className="
                  pointer-events-none absolute bottom-4 left-4
                  translate-y-2 opacity-0
                  transition-all duration-500
                  group-hover:translate-y-0
                  group-hover:opacity-100
                "
              >
                <span className="bg-white/90 px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-black backdrop-blur-sm">
                  View Style
                </span>
              </div>
            </div>

            {/* CATEGORY LABEL */}
            <div className="flex items-center justify-between border-t border-black/15 bg-[#f5f5f5] px-5 py-5 sm:px-6 lg:py-6">
              <div>
                <h3 className="text-sm uppercase tracking-[0.06em] text-black sm:text-base">
                  {category.name}
                </h3>

                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-black/45">
                  Shop studs
                </p>
              </div>

              <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </div>
          </a>
        ))}
      </div>
      {/* SCROLL PROGRESS */}
<div className="w-full bg-[#f5f5f5] px-6 py-5 sm:px-10 lg:px-16">
  <div className="relative h-[3px] w-full overflow-hidden bg-black/15">
    <div
      className="absolute left-0 top-0 h-full bg-black transition-[width] duration-150 ease-out"
      style={{
        width: `${20 + scrollProgress * 0.8}%`,
      }}
    />
  </div>
</div>
    </section>
  );
}

export default ShopByPiercing;