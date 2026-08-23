import { useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

// MAIN CAMPAIGN IMAGE
import mensMain from "../../assets/men/mens-main.png";

// PRODUCT 1
import minimalProduct from "../../assets/men/mens-minimal-product.png";
import minimalWorn from "../../assets/men/mens-minimal-worn.png";

// PRODUCT 2
import geometricProduct from "../../assets/men/mens-geometric-product.png";
import geometricWorn from "../../assets/men/mens-geometric-worn.png";

// PRODUCT 3
import barProduct from "../../assets/men/mens-bar-product.png";
import barWorn from "../../assets/men/mens-bar-worn.png";

// PRODUCT 4
import statementProduct from "../../assets/men/mens-statement-product.png";
import statementWorn from "../../assets/men/mens-statement-worn.png";

type MensProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  material: string;
  image: string;
  hoverImage: string;
  bestSeller?: boolean;
};

const products: MensProduct[] = [
  {
    id: 1,
    name: "Minimal Crystal Stud",
    slug: "minimal-crystal-stud",
    price: 999,
    material: "925 Silver",
    image: minimalProduct,
    hoverImage: minimalWorn,
    bestSeller: true,
  },
  {
    id: 2,
    name: "Geometric Silver Stud",
    slug: "geometric-silver-stud",
    price: 1199,
    material: "925 Silver",
    image: geometricProduct,
    hoverImage: geometricWorn,
    bestSeller: true,
  },
  {
    id: 3,
    name: "Minimal Bar Stud",
    slug: "minimal-bar-stud",
    price: 1099,
    material: "925 Silver",
    image: barProduct,
    hoverImage: barWorn,
  },
  {
    id: 4,
    name: "Compass Statement Stud",
    slug: "compass-statement-stud",
    price: 1399,
    material: "925 Silver",
    image: statementProduct,
    hoverImage: statementWorn,
    bestSeller: true,
  },
];

type ProductCardProps = {
  product: MensProduct;
};

function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    console.log("Added to cart:", product.name);
  };

  return (
    <article
      className="
        group
        w-[78vw]
        shrink-0
        snap-start

        sm:w-[340px]
        lg:w-[310px]
        xl:w-[340px]
      "
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#efefef]">
        <Link
          to={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="block h-full w-full"
        >
          {/* PRODUCT */}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="
              absolute inset-0
              h-full w-full
              object-cover
              opacity-100

              transition-all
              duration-700
              ease-out

              group-hover:scale-[1.03]
              group-hover:opacity-0
            "
          />

          {/* WORN */}
          <img
            src={product.hoverImage}
            alt={`${product.name} worn`}
            loading="lazy"
            className="
              absolute inset-0
              h-full w-full
              scale-[1.04]
              object-cover
              opacity-0

              transition-all
              duration-700
              ease-out

              group-hover:scale-100
              group-hover:opacity-100
            "
          />
        </Link>

        {/* BEST SELLER */}
        {product.bestSeller && (
          <div
            className="
              absolute left-4 top-4 z-20
              bg-red-600
              px-3 py-2

              text-[9px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-white

              sm:text-[10px]
            "
          >
            Best Seller
          </div>
        )}

        {/* WISHLIST */}
        <button
          type="button"
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsWishlisted((prev) => !prev);
          }}
          className={`
            absolute right-4 top-4 z-30

            flex h-11 w-11
            items-center
            justify-center

            rounded-full

            transition-all
            duration-300

            ${
              isWishlisted
                ? "bg-red-600 text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            }
          `}
        >
          <Heart
            size={18}
            strokeWidth={1.6}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* HOVER ACTIONS */}
        <div
          className="
            absolute bottom-0 left-0 right-0 z-30

            hidden
            translate-y-full
            grid-cols-2

            transition-transform
            duration-300
            ease-out

            group-hover:translate-y-0

            md:grid
          "
        >
          <Link
            to={`/product/${product.slug}`}
            className="
              flex min-h-[62px]
              items-center
              justify-center

              bg-white
              px-3

              text-center
              text-[10px]
              font-medium
              uppercase
              tracking-[0.13em]
              text-black

              transition-colors
              duration-300

              hover:bg-[#eaeaea]
            "
          >
            Product Overview
          </Link>

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleAddToCart();
            }}
            className="
              flex min-h-[62px]
              items-center
              justify-center

              border-l
              border-white/20
              bg-black
              px-3

              text-center
              text-[10px]
              font-medium
              uppercase
              tracking-[0.13em]
              text-white

              transition-colors
              duration-300

              hover:bg-red-600
            "
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* DETAILS */}
      <div className="pt-5 text-white">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-[15px] transition-opacity duration-300 hover:opacity-60">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-sm font-medium">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/45">
          {product.material}
        </p>

        {/* MOBILE */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="
            mt-4
            flex h-9
            items-center
            justify-center

            border
            border-white/40
            px-4

            text-[9px]
            uppercase
            tracking-[0.12em]
            text-white

            transition-all
            duration-300

            hover:bg-white
            hover:text-black

            md:hidden
          "
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

function MenSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({
      left: -380,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({
      left: 380,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) return;

    const maxScroll =
      container.scrollWidth - container.clientWidth;

    if (maxScroll <= 0) {
      setScrollProgress(100);
      return;
    }

    const progress =
      (container.scrollLeft / maxScroll) * 100;

    setScrollProgress(
      Math.min(100, Math.max(0, progress))
    );
  };

  return (
    <section className="w-full bg-black">
      <div
        className="
          grid
          grid-cols-1

          lg:grid-cols-[42%_58%]
        "
      >
        {/* =========================================
            LEFT CAMPAIGN
        ========================================= */}
        <div
          className="
            relative
            min-h-[650px]
            overflow-hidden

            lg:min-h-[920px]
          "
        >
          <img
            src={mensMain}
            alt="Men's piercing jewellery collection"
            loading="lazy"
            className="
              absolute inset-0
              h-full w-full
              object-cover
              object-center

              transition-transform
              duration-[1200ms]
              ease-out

              hover:scale-[1.02]
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {/* CAMPAIGN LABEL */}
          <div
            className="
              absolute bottom-8 left-6

              text-white

              sm:left-8
              lg:bottom-10
              lg:left-10
            "
          >
            <p className="text-[9px] uppercase tracking-[0.24em] text-white/60">
              ABIKYATATTOOS
            </p>

            <p className="mt-2 text-sm uppercase tracking-[0.14em]">
              Men / Piercing
            </p>
          </div>
        </div>

        {/* =========================================
            RIGHT SECTION
        ========================================= */}
        <div
          className="
            flex min-w-0
            flex-col
            bg-[#111111]
            px-5 py-10

            sm:px-8
            sm:py-12

            lg:px-10
            lg:py-14

            xl:px-14
          "
        >
          {/* HEADER */}
          <div className="border-b border-white/10 pb-10">
            <div
              className="
                flex
                flex-col
                gap-7

                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/40">
                  Built different
                </p>

                <h2
                  className="
                    text-4xl
                    tracking-tight
                    text-white

                    lg:text-5xl
                    xl:text-6xl
                  "
                >
                  MEN'S STUDS
                </h2>

                <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
                  Minimal. Strong. Made for everyday wear.
                </p>
              </div>

              {/* HEADER ACTIONS */}
              <div className="flex items-center gap-3">
                {/* ARROWS */}
                <div className="hidden items-center gap-2 md:flex">
                  <button
                    type="button"
                    onClick={scrollLeft}
                    aria-label="Previous men's products"
                    className="
                      flex h-11 w-11
                      items-center
                      justify-center

                      border
                      border-white/20

                      text-white

                      transition-all
                      duration-300

                      hover:bg-white
                      hover:text-black
                    "
                  >
                    <ChevronLeft
                      size={18}
                      strokeWidth={1.5}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={scrollRight}
                    aria-label="Next men's products"
                    className="
                      flex h-11 w-11
                      items-center
                      justify-center

                      border
                      border-white/20

                      text-white

                      transition-all
                      duration-300

                      hover:bg-white
                      hover:text-black
                    "
                  >
                    <ChevronRight
                      size={18}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                {/* SHOP BUTTON */}
                <Link
                  to="/men"
                  className="
                    group

                    flex min-h-[48px]
                    items-center
                    justify-center
                    gap-3

                    bg-white
                    px-6

                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.16em]
                    text-black

                    transition-all
                    duration-300

                    hover:bg-red-600
                    hover:text-white
                  "
                >
                  Shop Men

                  <ArrowRight
                    size={15}
                    strokeWidth={1.5}
                    className="
                      transition-transform
                      duration-300

                      group-hover:translate-x-1
                    "
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* =========================================
              PRODUCT RAIL
          ========================================= */}
          <div className="mt-10 min-w-0">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="
                flex
                snap-x
                snap-mandatory
                gap-5

                overflow-x-auto
                scroll-smooth

                pb-3

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* =========================================
                SCROLL PROGRESS
            ========================================= */}
            <div className="mt-10">
              <div className="relative h-[4px] w-full overflow-hidden bg-white/15">
                <div
                  className="
                    absolute left-0 top-0
                    h-full
                    bg-white

                    transition-[width]
                    duration-150
                    ease-out
                  "
                  style={{
                    width: `${
                      24 + scrollProgress * 0.76
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* MOBILE SHOP BUTTON */}
          <Link
            to="/men"
            className="
              mt-10

              flex w-full
              items-center
              justify-center
              gap-3

              bg-white
              px-6 py-4

              text-[10px]
              uppercase
              tracking-[0.16em]
              text-black

              transition-colors
              duration-300

              hover:bg-red-600
              hover:text-white

              sm:hidden
            "
          >
            Shop Men's Collection

            <ArrowRight
              size={15}
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MenSection;