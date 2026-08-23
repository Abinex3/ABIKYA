import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import ProductCard, {
  type ProductCardData,
} from "../../components/products/ProductCard";

// TEMPORARY WISHLIST PRODUCTS
import lobeProduct from "../../assets/categories/lobe-product.png";
import lobeWorn from "../../assets/categories/lobe-worn.png";

import noseProduct from "../../assets/categories/nose-product.png";
import noseWorn from "../../assets/categories/nose-worn.png";

import helixProduct from "../../assets/categories/helix-product.png";
import helixWorn from "../../assets/categories/helix-worn.png";

import tragusProduct from "../../assets/categories/tragus-product.png";
import tragusWorn from "../../assets/categories/tragus-worn.png";

const wishlistProducts: ProductCardData[] = [
  {
    id: 1,
    name: "Celestial Lobe Stud",
    slug: "celestial-lobe-stud",
    price: 1299,
    material: "925 Silver",
    image: lobeProduct,
    hoverImage: lobeWorn,
    isNew: true,
  },
  {
    id: 2,
    name: "Luna Nose Stud",
    slug: "luna-nose-stud",
    price: 899,
    material: "925 Silver",
    image: noseProduct,
    hoverImage: noseWorn,
  },
  {
    id: 3,
    name: "Orbit Helix Stud",
    slug: "orbit-helix-stud",
    price: 1499,
    material: "925 Silver",
    image: helixProduct,
    hoverImage: helixWorn,
  },
  {
    id: 4,
    name: "Halo Tragus Stud",
    slug: "halo-tragus-stud",
    price: 1099,
    material: "925 Silver",
    image: tragusProduct,
    hoverImage: tragusWorn,
    isSale: true,
    originalPrice: 1399,
  },
];

function Wishlist() {
  const hasItems = wishlistProducts.length > 0;

  return (
    <div className="w-full bg-white">
      {/* HEADER */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-[1600px] px-5 py-12 text-center sm:px-8 lg:px-16 lg:py-16">
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
            Saved for later
          </p>

          <h1 className="mt-2 text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl">
            WISHLIST
          </h1>

          <div className="mt-5 flex items-center justify-center gap-3 text-xs text-black/45">
            <Link
              to="/"
              className="transition-colors duration-300 hover:text-black"
            >
              Home
            </Link>

            <span>→</span>

            <span className="text-black">
              Wishlist
            </span>
          </div>

          {hasItems && (
            <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-black/40">
              {wishlistProducts.length} saved{" "}
              {wishlistProducts.length === 1
                ? "item"
                : "items"}
            </p>
          )}
        </div>
      </section>

      {/* WISHLIST CONTENT */}
      <section>
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-8 lg:px-16 lg:py-14">
          {hasItems ? (
            <>
              {/* TOP INFO ROW */}
              <div className="mb-8 flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-black">
                    Your saved pieces
                  </p>

                  <p className="mt-1 text-xs leading-5 text-black/45">
                    Keep your favourites here and come
                    back whenever you're ready.
                  </p>
                </div>

                <Link
                  to="/shop"
                  className="
                    group
                    inline-flex w-fit
                    items-center gap-3
                    border-b border-black
                    pb-1
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.15em]
                    text-black
                  "
                >
                  Continue Shopping

                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              {/* PRODUCT GRID */}
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
                {wishlistProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </>
          ) : (
            /* EMPTY STATE */
            <div className="flex min-h-[520px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/15">
                <Heart
                  size={24}
                  strokeWidth={1.4}
                />
              </div>

              <p className="mt-7 text-[10px] uppercase tracking-[0.22em] text-black/40">
                Nothing saved yet
              </p>

              <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
                YOUR WISHLIST IS EMPTY
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-black/50">
                Save the pieces you love and build your
                perfect piercing stack over time.
              </p>

              <Link
                to="/shop"
                className="
                  mt-8
                  bg-black
                  px-8 py-4
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-white
                  transition-colors
                  duration-300

                  hover:bg-red-600
                "
              >
                Explore Studs
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Wishlist;