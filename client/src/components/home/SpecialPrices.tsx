import { useEffect, useRef, useState } from "react";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// TEMPORARY IMAGES
// Reusing existing assets for now.

import product1 from "../../assets/categories/helix-product.png";
import hover1 from "../../assets/categories/helix-worn.png";

import product2 from "../../assets/categories/conch-product.png";
import hover2 from "../../assets/categories/conch-worn.png";

import product3 from "../../assets/categories/tragus-product.png";
import hover3 from "../../assets/categories/tragus-worn.png";

import product4 from "../../assets/categories/daith-product.png";
import hover4 from "../../assets/categories/daith-worn.png";

import product5 from "../../assets/categories/nose-product.png";
import hover5 from "../../assets/categories/nose-worn.png";

import product6 from "../../assets/categories/lobe-product.png";
import hover6 from "../../assets/categories/lobe-worn.png";

import product7 from "../../assets/categories/flat-product.png";
import hover7 from "../../assets/categories/flat-worn.png";

import product8 from "../../assets/categories/upper-lobe-product.png";
import hover8 from "../../assets/categories/upper-lobe-worn.png";

type Product = {
  id: number;
  name: string;
  slug: string;
  salePrice: number;
  originalPrice: number;
  material: string;
  image: string;
  hoverImage: string;
  soldOut?: boolean;
};

const products: Product[] = [
  {
    id: 1,
    name: "Crystal Helix Stud",
    slug: "crystal-helix-stud",
    salePrice: 1099,
    originalPrice: 1499,
    material: "925 Silver",
    image: product1,
    hoverImage: hover1,
  },
  {
    id: 2,
    name: "Starlight Conch Stud",
    slug: "starlight-conch-stud",
    salePrice: 1299,
    originalPrice: 1699,
    material: "925 Silver",
    image: product2,
    hoverImage: hover2,
    soldOut: true,
  },
  {
    id: 3,
    name: "Mini Tragus Stud",
    slug: "mini-tragus-stud",
    salePrice: 899,
    originalPrice: 1199,
    material: "925 Silver",
    image: product3,
    hoverImage: hover3,
  },
  {
    id: 4,
    name: "Classic Daith Stud",
    slug: "classic-daith-stud",
    salePrice: 1199,
    originalPrice: 1599,
    material: "925 Silver",
    image: product4,
    hoverImage: hover4,
  },
  {
    id: 5,
    name: "Luna Nose Stud",
    slug: "luna-nose-stud",
    salePrice: 699,
    originalPrice: 999,
    material: "925 Silver",
    image: product5,
    hoverImage: hover5,
  },
  {
    id: 6,
    name: "Celestial Lobe Stud",
    slug: "celestial-lobe-stud",
    salePrice: 999,
    originalPrice: 1299,
    material: "925 Silver",
    image: product6,
    hoverImage: hover6,
  },
  {
    id: 7,
    name: "Nova Flat Stud",
    slug: "nova-flat-stud",
    salePrice: 1099,
    originalPrice: 1399,
    material: "925 Silver",
    image: product7,
    hoverImage: hover7,
  },
  {
    id: 8,
    name: "Upper Lobe Spark Stud",
    slug: "upper-lobe-spark-stud",
    salePrice: 799,
    originalPrice: 1099,
    material: "925 Silver",
    image: product8,
    hoverImage: hover8,
  },
];

type ProductCardProps = {
  product: Product;
  index: number;
};

function ProductCard({ product, index }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const element = cardRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleAddToCart = () => {
    if (product.soldOut) return;

    console.log("Added to cart:", product.name);
  };

  return (
    <div
      ref={cardRef}
      style={{
        transitionDelay: `${(index % 4) * 80}ms`,
      }}
      className={`
        group min-w-0
        transition-all duration-700 ease-out
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }
      `}
    >
      {/* IMAGE AREA */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f4f4]">
        <Link
          to={`/product/${product.slug}`}
          className="block h-full w-full"
        >
          {/* PRODUCT IMAGE */}
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

          {/* HOVER IMAGE */}
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

        {/* SALE BADGE */}
        <div
          className="
            absolute left-3 top-3 z-20
            bg-red-600
            px-3 py-1.5
            text-[9px]
            font-medium
            uppercase
            tracking-[0.18em]
            text-white

            sm:left-4
            sm:top-4
            sm:text-[10px]
          "
        >
          Sale
        </div>

        {/* WISHLIST */}
        <button
          type="button"
          onClick={() => setIsWishlisted((prev) => !prev)}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          className={`
            absolute right-3 top-3 z-30
            flex h-9 w-9
            items-center justify-center
            rounded-full
            transition-all duration-300

            sm:right-4
            sm:top-4
            sm:h-10
            sm:w-10

            ${
              isWishlisted
                ? "bg-red-600 text-white"
                : "bg-white/95 text-black hover:bg-black hover:text-white"
            }
          `}
        >
          <Heart
            size={18}
            strokeWidth={1.6}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* SOLD OUT OVERLAY */}
        {product.soldOut && (
          <div
            className="
              pointer-events-none
              absolute inset-0 z-20
              flex items-center justify-center
              bg-black/20
            "
          >
            <span
              className="
                bg-black
                px-5 py-3
                text-[10px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-white
              "
            >
              Sold Out
            </span>
          </div>
        )}

        {/* DESKTOP HOVER ACTIONS */}
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
          {/* PRODUCT OVERVIEW */}
          <Link
            to={`/product/${product.slug}`}
            className="
              flex min-h-[64px]
              items-center
              justify-center
              bg-white
              px-3
              text-center
              text-[10px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-black
              transition-colors
              duration-300

              hover:bg-[#eeeeee]

              lg:text-[11px]
            "
          >
            Product Overview
          </Link>

          {/* ADD TO CART */}
          <button
            type="button"
            disabled={product.soldOut}
            onClick={handleAddToCart}
            className={`
              flex min-h-[64px]
              items-center
              justify-center
              border-l
              px-3
              text-center
              text-[10px]
              font-medium
              uppercase
              tracking-[0.14em]
              transition-colors
              duration-300

              lg:text-[11px]

              ${
                product.soldOut
                  ? "cursor-not-allowed border-black/10 bg-[#e8e8e8] text-black/35"
                  : "border-white/20 bg-black text-white hover:bg-red-600"
              }
            `}
          >
            {product.soldOut ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="pt-4 sm:pt-5">
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-1 text-sm text-black transition-opacity duration-300 hover:opacity-60 sm:text-[15px]">
            {product.name}
          </h3>
        </Link>

        {/* PRICE */}
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-medium text-red-600">
            ₹{product.salePrice.toLocaleString("en-IN")}
          </p>

          <p className="text-xs text-black/40 line-through">
            ₹{product.originalPrice.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="mt-1 flex items-end justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-black/45">
            {product.material}
          </p>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            disabled={product.soldOut}
            onClick={handleAddToCart}
            className={`
              flex h-8 items-center justify-center
              border px-3
              text-[9px]
              uppercase
              tracking-[0.1em]
              transition-colors duration-300

              md:hidden

              ${
                product.soldOut
                  ? "cursor-not-allowed border-black/10 text-black/30"
                  : "border-black text-black hover:bg-black hover:text-white"
              }
            `}
          >
            {product.soldOut ? "Sold Out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SpecialPrices() {
  return (
    <section className="w-full bg-[#f7f7f7]">
      {/* HEADER */}
      <div className="border-b border-black/10 px-5 py-12 sm:px-8 md:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-red-600 sm:text-xs">
              Limited time
            </p>

            <h2 className="text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl">
              SPECIAL PRICES
            </h2>

            <p className="mt-3 max-w-md text-xs leading-5 text-black/55 sm:text-sm">
              Selected pieces at special prices while stocks last.
            </p>
          </div>

          <Link
            to="/shop?sale=true"
            className="
              group hidden items-center gap-3
              border-b border-black pb-1
              text-[11px] uppercase
              tracking-[0.15em]
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

      {/* PRODUCT GRID */}
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 sm:py-10 lg:px-16 lg:py-14">
        <div
          className="
            grid
            grid-cols-2
            gap-x-3 gap-y-10

            sm:gap-x-5

            md:grid-cols-3

            lg:grid-cols-4
            lg:gap-x-6
            lg:gap-y-14
          "
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-12 flex justify-center sm:hidden">
          <Link
            to="/shop?sale=true"
            className="
              flex min-w-[180px]
              items-center justify-center gap-3
              bg-black
              px-6 py-4
              text-[10px]
              uppercase
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

export default SpecialPrices;