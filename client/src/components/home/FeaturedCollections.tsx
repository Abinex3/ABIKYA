import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import bestSellersImage from "../../assets/collections/best-sellers.png";
import minimalImage from "../../assets/collections/minimal.png";
import statementImage from "../../assets/collections/statement.png";
import tattooCollectionImage from "../../assets/collections/tattoo-collection.png";

const collections = [
  {
    id: 1,
    title: "Best Sellers",
    subtitle: "Most loved",
    slug: "best-sellers",
    image: bestSellersImage,
  },
  {
    id: 2,
    title: "Minimal",
    subtitle: "Less. But never basic.",
    slug: "minimal",
    image: minimalImage,
  },
  {
    id: 3,
    title: "Statement",
    subtitle: "Made to stand out",
    slug: "statement",
    image: statementImage,
  },
  {
    id: 4,
    title: "Tattoo Collection",
    subtitle: "Piercing meets ink",
    slug: "tattoo-collection",
    image: tattooCollectionImage,
  },
];

function FeaturedCollections() {
  return (
    <section className="w-full bg-[#f5f5f5]">
      {/* HEADER */}
      <div className="border-b border-black/10 px-5 py-12 sm:px-8 md:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-black/45 sm:text-xs">
              Curated for you
            </p>

            <h2 className="text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl">
              FEATURED COLLECTIONS
            </h2>

            <p className="mt-3 max-w-lg text-xs leading-5 text-black/55 sm:text-sm">
              Discover pieces curated around your mood, style and individuality.
            </p>
          </div>

          {/* VIEW ALL */}
          <Link
            to="/collections"
            className="
              group hidden items-center gap-3
              border-b border-black pb-1
              text-[11px] uppercase tracking-[0.15em]
              text-black
              sm:flex
            "
          >
            View All

            <ArrowRight
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* COLLECTION GRID */}
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 sm:py-10 lg:px-16 lg:py-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.slug}`}
              className="
                group relative block
                aspect-[4/5]
                overflow-hidden
                bg-[#eaeaea]
              "
            >
              {/* COLLECTION IMAGE */}
              <img
                src={collection.image}
                alt={collection.title}
                loading="lazy"
                className="
                  absolute inset-0
                  h-full w-full
                  object-cover
                  transition-transform
                  duration-[900ms]
                  ease-out
                  group-hover:scale-[1.045]
                "
              />

              {/* DARK GRADIENT */}
              <div
                className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-black/70
                  via-black/10
                  to-transparent
                  transition-colors
                  duration-500
                "
              />

              {/* CONTENT */}
              <div
                className="
                  absolute inset-x-0 bottom-0
                  flex items-end justify-between
                  gap-4
                  p-5
                  text-white
                  sm:p-6
                "
              >
                <div>
                  <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-white/70 sm:text-[10px]">
                    {collection.subtitle}
                  </p>

                  <h3 className="text-xl uppercase tracking-tight sm:text-2xl">
                    {collection.title}
                  </h3>
                </div>

                <div
                  className="
                    flex h-10 w-10
                    shrink-0
                    items-center justify-center
                    border border-white/60
                    transition-all
                    duration-300

                    group-hover:bg-white
                    group-hover:text-black
                  "
                >
                  <ArrowRight
                    size={17}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-[2px]"
                  />
                </div>
              </div>

              {/* VERY SUBTLE BORDER */}
              <div className="pointer-events-none absolute inset-0 border border-black/5" />
            </Link>
          ))}
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            to="/collections"
            className="
              flex min-w-[190px]
              items-center justify-center gap-3
              bg-black
              px-6 py-4
              text-[10px] uppercase
              tracking-[0.18em]
              text-white
            "
          >
            View All

            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollections;