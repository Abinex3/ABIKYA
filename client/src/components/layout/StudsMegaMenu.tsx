import { Link } from "react-router-dom";
import helixStudsImage from "../../assets/helix-studs.png";
import noseStudsImage from "../../assets/nose-studs.png";

const styles = [
  "Lobe",
  "Bugadi",
  "Belly Button",
  "Nose",
  "Eyebrow",
  "Tongue",
  "Check All",
//   "Flat",
//   "Helix",
//   "Snug",
//   "Conch",
//   "Tragus",
//   "Daith",
];

const collections = [
  "Best Sellers",
  "New Arrivals",
  "Minimal",
  "Statement",
  "Tattoo Collection",
  "Limited Edition",
];

const shopBy = [
  "Men",
  "Women",
  "Unisex",
];

const featured = [
  "Everyday Essentials",
  "Most Gifted",
  "New Arrivals",
  "Best Sellers",
];

function StudsMegaMenu() {
  return (
    <div className="w-full border-t border-neutral-200 bg-white text-black shadow-sm">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-8 py-10 lg:grid-cols-[1.2fr_1fr_0.8fr_0.9fr_1.6fr]">

        {/* BY STYLE */}
        <div className="border-r border-neutral-200 pr-8">
          <h3 className="mb-2 text-sm uppercase tracking-[0.12em]">
  By Style
</h3>
          <div className="mb-7 h-[2px] w-7 bg-black" />

          <div className="grid grid-cols-1 gap-4">
            {styles.map((style) => (
              <Link
                key={style}
                to={`/shop?style=${encodeURIComponent(style.toLowerCase())}`}
                className="text-[15px] transition-opacity hover:opacity-50"
              >
                {style}
              </Link>
            ))}
          </div>
        </div>

        {/* COLLECTIONS */}
        <div className="border-r border-neutral-200 pr-8">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">
            Collections
          </h3>

          <div className="mb-7 h-[2px] w-7 bg-black" />

          <div className="flex flex-col gap-5">
            {collections.map((item) => (
              <Link
                key={item}
                to="/collections"
                className="text-[15px] transition-opacity hover:opacity-50"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* SHOP BY */}
        <div className="border-r border-neutral-200 pr-8">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">
            Shop By
          </h3>

          <div className="mb-7 h-[2px] w-7 bg-black" />

          <div className="flex flex-col gap-5">
            {shopBy.map((item) => (
              <Link
                key={item}
                to={
                  item === "Men"
                    ? "/men"
                    : item === "Women"
                      ? "/women"
                      : "/shop"
                }
                className="text-[15px] transition-opacity hover:opacity-50"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* FEATURED */}
        <div className="border-r border-neutral-200 pr-8">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide">
            Featured
          </h3>

          <div className="mb-7 h-[2px] w-7 bg-black" />

          <div className="flex flex-col gap-5">
            {featured.map((item) => (
              <Link
                key={item}
                to="/shop"
                className="text-[15px] transition-opacity hover:opacity-50"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* PROMO CARDS */}
<div className="grid grid-cols-2 gap-4">
  {/* HELIX */}
  <Link
    to="/shop?style=helix"
    className="group relative min-h-[390px] overflow-hidden bg-black"
  >
    <img
      src={helixStudsImage}
      alt="Helix studs"
      className="absolute inset-0 h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />

    <div className="absolute bottom-0 left-0 z-10 p-6 text-white">
      <h3 className="text-xl uppercase tracking-wide">
        Helix Studs
      </h3>

      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/80">
        New Arrivals
      </p>

      <span className="mt-5 inline-block border border-white px-5 py-2.5 text-xs uppercase tracking-wider transition-colors duration-300 group-hover:bg-white group-hover:text-black">
        Shop Now
      </span>
    </div>
  </Link>

  {/* NOSE */}
  <Link
    to="/shop?style=nose"
    className="group relative min-h-[390px] overflow-hidden bg-black"
  >
    <img
      src={noseStudsImage}
      alt="Nose studs"
      className="absolute inset-0 h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />

    <div className="absolute bottom-0 left-0 z-10 p-6 text-white">
      <h3 className="text-xl uppercase tracking-wide">
        Nose Studs
      </h3>

      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/80">
        Best Sellers
      </p>

      <span className="mt-5 inline-block border border-white px-5 py-2.5 text-xs uppercase tracking-wider transition-colors duration-300 group-hover:bg-white group-hover:text-black">
        Shop Now
      </span>
    </div>
  </Link>
</div>

      </div>
    </div>
  );
}

export default StudsMegaMenu;