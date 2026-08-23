import { useEffect, useRef, useState } from "react";
import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// TEMPORARY IMAGES
// We are reusing the existing category images for now.
// Later these will be replaced with real product images from the API.

import product1 from "../../assets/categories/lobe-product.png";
import lobeWorn from "../../assets/categories/lobe-worn.png";

import product2 from "../../assets/categories/bugadi-product.png";
import bugadiWorn from "../../assets/categories/bugadi-worn.png";

import product3 from "../../assets/categories/belly-button-product.png";
import bellyButtonWorn from "../../assets/categories/belly-button-worn.png";

import product4 from "../../assets/categories/nose-product.png";
import noseWorn from "../../assets/categories/nose-worn.png";

import product5 from "../../assets/categories/eyebrow-product.png";
import eyebrowWorn from "../../assets/categories/eyebrow-worn.png";

import product6 from "../../assets/categories/tongue-product.png";
import tongueWorn from "../../assets/categories/tongue-worn.png";

import product7 from "../../assets/categories/upper-lobe-product.png";
import upperLobeWorn from "../../assets/categories/upper-lobe-worn.png";

import product8 from "../../assets/categories/flat-product.png";
import flatWorn from "../../assets/categories/flat-worn.png";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  material: string;
  image: string;
  hoverImage: string;
  isNew?: boolean;
};

const products: Product[] = [
  {
    id: 1,
    name: "Celestial Lobe Stud",
    slug: "celestial-lobe-stud",
    price: 1299,
    material: "925 Silver",
    image: product1,
    hoverImage: lobeWorn,
    isNew: true,
  },
  {
    id: 2,
    name: "Bugadi Statement Stud",
    slug: "bugadi-statement-stud",
    price: 1499,
    material: "925 Silver",
    image: product2,
    hoverImage: bugadiWorn,
    isNew: true,
  },
  {
    id: 3,
    name: "Belly Button Crystal Stud",
    slug: "belly-button-crystal-stud",
    price: 1399,
    material: "925 Silver",
    image: product3,
    hoverImage: bellyButtonWorn,
    isNew: true,
  },
  {
    id: 4,
    name: "Luna Nose Stud",
    slug: "luna-nose-stud",
    price: 899,
    material: "925 Silver",
    image: product4,
    hoverImage: noseWorn,
    isNew: true,
  },
  {
    id: 5,
    name: "Minimal Eyebrow Stud",
    slug: "minimal-eyebrow-stud",
    price: 1099,
    material: "925 Silver",
    image: product5,
    hoverImage: eyebrowWorn,
    isNew: true,
  },
  {
    id: 6,
    name: "Classic Tongue Stud",
    slug: "classic-tongue-stud",
    price: 1199,
    material: "925 Silver",
    image: product6,
    hoverImage: tongueWorn,
    isNew: true,
  },
  {
    id: 7,
    name: "Mini Spark Upper Lobe Stud",
    slug: "mini-spark-upper-lobe-stud",
    price: 999,
    material: "925 Silver",
    image: product7,
    hoverImage: upperLobeWorn,
    isNew: true,
  },
  {
    id: 8,
    name: "Nova Flat Stud",
    slug: "nova-flat-stud",
    price: 1299,
    material: "925 Silver",
    image: product8,
    hoverImage: flatWorn,
    isNew: true,
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
    // Temporary until Zustand cart store is connected
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
      {/* PRODUCT IMAGE AREA */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f4f4f4]">
        <Link
          to={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="block h-full w-full"
        >
          {/* DEFAULT PRODUCT IMAGE */}
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

          {/* WORN IMAGE */}
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

          {/* SUBTLE HOVER OVERLAY */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              bg-black/0
              transition-colors duration-500
              group-hover:bg-black/[0.04]
            "
          />
        </Link>

        {/* NEW BADGE */}
        {product.isNew && (
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
            New
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
    Quick View
  </Link>

  {/* ADD TO CART */}
  <button
    type="button"
    onClick={(event) => {
      event.preventDefault();
      event.stopPropagation();
      handleAddToCart();
    }}
    className="
      flex min-h-[64px]
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
      tracking-[0.14em]
      text-white
      transition-colors
      duration-300

      hover:bg-red-600

      lg:text-[11px]
    "
  >
    Add to Cart
  </button>
</div>
      </div>

      {/* PRODUCT INFO */}
      <div className="pt-4 sm:pt-5">
        <Link to={`/product/${product.slug}`}>
          <h3
            className="
              line-clamp-1
              text-sm
              text-black
              transition-opacity
              duration-300
              hover:opacity-60
              sm:text-[15px]
            "
          >
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-black">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-black/45">
              {product.material}
            </p>
          </div>

          {/* MOBILE ACTION */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="
              flex h-8 items-center justify-center
              border border-black
              px-3
              text-[9px]
              uppercase
              tracking-[0.1em]
              text-black
              transition-colors duration-300
              hover:bg-black
              hover:text-white
              md:hidden
            "
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function NewArrivals() {
  return (
    <section className="w-full bg-white">
      {/* SECTION HEADER */}
      <div
        className="
          border-b
          border-black/10
          px-5 py-12

          sm:px-8
          md:px-10
          lg:px-16
          lg:py-16
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-[1600px]
            items-end
            justify-between
            gap-6
          "
        >
          <div>
            <p
              className="
                mb-2
                text-[10px]
                uppercase
                tracking-[0.22em]
                text-black/45

                sm:text-xs
              "
            >
              Just dropped
            </p>

            <h2
              className="
                text-3xl
                tracking-tight
                text-black

                sm:text-4xl
                lg:text-5xl
              "
            >
              NEW ARRIVALS
            </h2>

            <p
              className="
                mt-3
                max-w-md
                text-xs
                leading-5
                text-black/55

                sm:text-sm
              "
            >
              Fresh pieces made for your next piercing.
            </p>
          </div>

          {/* DESKTOP VIEW ALL */}
          <Link
            to="/shop?sort=newest"
            className="
              group
              hidden
              items-center
              gap-3
              border-b
              border-black
              pb-1
              text-[11px]
              uppercase
              tracking-[0.15em]
              text-black

              sm:flex
            "
          >
            <span>View All</span>

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

      {/* PRODUCTS */}
      <div
        className="
          mx-auto
          max-w-[1600px]
          px-4 py-8

          sm:px-8
          sm:py-10

          lg:px-16
          lg:py-14
        "
      >
        <div
          className="
            grid
            grid-cols-2
            gap-x-3
            gap-y-10

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
            to="/shop?sort=newest"
            className="
              flex
              min-w-[180px]
              items-center
              justify-center
              gap-3
              bg-black
              px-6 py-4
              text-[10px]
              uppercase
              tracking-[0.18em]
              text-white
            "
          >
            <span>View All</span>

            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewArrivals;