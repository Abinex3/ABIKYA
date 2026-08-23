import { useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export type ProductCardData = {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  material: string;
  image: string;
  hoverImage: string;
  isNew?: boolean;
  isSale?: boolean;
  soldOut?: boolean;
};

type ProductCardProps = {
  product: ProductCardData;
};

function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (product.soldOut) return;

    console.log("Added to cart:", product.name);
  };

  return (
    <article className="group min-w-0">
      {/* IMAGE */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f3f3f3]">
        <Link
          to={`/product/${product.slug}`}
          className="block h-full w-full"
          aria-label={`View ${product.name}`}
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
        </Link>

        {/* BADGES */}
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-2 sm:left-4 sm:top-4">
          {product.isNew && (
            <span className="bg-red-600 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.17em] text-white sm:text-[10px]">
              New
            </span>
          )}

          {product.isSale && (
            <span className="bg-black px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.17em] text-white sm:text-[10px]">
              Sale
            </span>
          )}
        </div>

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

        {/* SOLD OUT */}
        {product.soldOut && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/15">
            <span className="bg-black px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white">
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
          <Link
            to={`/product/${product.slug}`}
            className="
              flex min-h-[60px]
              items-center justify-center
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
              hover:bg-[#ececec]
            "
          >
            Product Overview
          </Link>

          <button
            type="button"
            disabled={product.soldOut}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleAddToCart();
            }}
            className={`
              flex min-h-[60px]
              items-center justify-center
              border-l
              px-3
              text-center
              text-[10px]
              font-medium
              uppercase
              tracking-[0.13em]
              transition-colors
              duration-300

              ${
                product.soldOut
                  ? "cursor-not-allowed border-black/10 bg-[#e7e7e7] text-black/35"
                  : "border-white/20 bg-black text-white hover:bg-red-600"
              }
            `}
          >
            {product.soldOut ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* INFO */}
      <div className="pt-4 sm:pt-5">
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-1 text-sm text-black transition-opacity duration-300 hover:opacity-60 sm:text-[15px]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p
            className={`text-sm font-medium ${
              product.isSale ? "text-red-600" : "text-black"
            }`}
          >
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          {product.originalPrice && (
            <p className="text-xs text-black/40 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </p>
          )}
        </div>

        <div className="mt-1 flex items-end justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-black/45">
            {product.material}
          </p>

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
    </article>
  );
}

export default ProductCard;