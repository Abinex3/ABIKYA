import { useMemo, useState } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import ShopFilterDrawer, {
  type ShopFilters,
} from "../../components/shop/ShopFilterDrawer";

import ProductCard, {
  type ProductCardData,
} from "../../components/products/ProductCard";
import ShopPromoCard from "../../components/shop/ShopPromoCard";

// EXISTING IMAGES

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

const products: ProductCardData[] = [
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
    name: "Bugadi Statement Stud",
    slug: "bugadi-statement-stud",
    price: 1499,
    material: "925 Silver",
    image: bugadiProduct,
    hoverImage: bugadiWorn,
    isNew: true,
  },
  {
    id: 3,
    name: "Belly Button Crystal Stud",
    slug: "belly-button-crystal-stud",
    price: 1399,
    material: "925 Silver",
    image: bellyButtonProduct,
    hoverImage: bellyButtonWorn,
  },
  {
    id: 4,
    name: "Luna Nose Stud",
    slug: "luna-nose-stud",
    price: 899,
    material: "925 Silver",
    image: noseProduct,
    hoverImage: noseWorn,
  },
  {
    id: 5,
    name: "Minimal Eyebrow Stud",
    slug: "minimal-eyebrow-stud",
    price: 1099,
    material: "925 Silver",
    image: eyebrowProduct,
    hoverImage: eyebrowWorn,
    isSale: true,
    originalPrice: 1399,
  },
  {
    id: 6,
    name: "Classic Tongue Stud",
    slug: "classic-tongue-stud",
    price: 1199,
    material: "925 Silver",
    image: tongueProduct,
    hoverImage: tongueWorn,
  },
  {
    id: 7,
    name: "Mini Spark Upper Lobe Stud",
    slug: "mini-spark-upper-lobe-stud",
    price: 999,
    material: "925 Silver",
    image: upperLobeProduct,
    hoverImage: upperLobeWorn,
  },
  {
    id: 8,
    name: "Nova Flat Stud",
    slug: "nova-flat-stud",
    price: 1299,
    material: "925 Silver",
    image: flatProduct,
    hoverImage: flatWorn,
    soldOut: true,
  },
  {
    id: 9,
    name: "Orbit Helix Stud",
    slug: "orbit-helix-stud",
    price: 1499,
    material: "925 Silver",
    image: helixProduct,
    hoverImage: helixWorn,
  },
  {
    id: 10,
    name: "Minimal Snug Stud",
    slug: "minimal-snug-stud",
    price: 1099,
    material: "925 Silver",
    image: snugProduct,
    hoverImage: snugWorn,
  },
  {
    id: 11,
    name: "Starlight Conch Stud",
    slug: "starlight-conch-stud",
    price: 1599,
    material: "925 Silver",
    image: conchProduct,
    hoverImage: conchWorn,
    isSale: true,
    originalPrice: 1899,
  },
  {
    id: 12,
    name: "Halo Tragus Stud",
    slug: "halo-tragus-stud",
    price: 1099,
    material: "925 Silver",
    image: tragusProduct,
    hoverImage: tragusWorn,
  },
  {
    id: 13,
    name: "Midnight Daith Stud",
    slug: "midnight-daith-stud",
    price: 1399,
    material: "925 Silver",
    image: daithProduct,
    hoverImage: daithWorn,
  },
];

type SortOption =
  | "featured"
  | "newest"
  | "price-low"
  | "price-high";

function Shop() {
  const [sortBy, setSortBy] =
    useState<SortOption>("featured");

    

  const [filterOpen, setFilterOpen] = useState(false);

const [filters, setFilters] = useState<ShopFilters>({
  inStock: false,
  outOfStock: false,
  minPrice: 0,
  maxPrice: 3000,
  piercings: [],
  collections: [],
  saleOnly: false,
});

  const sortedProducts = useMemo(() => {
    const items = [...products];

    switch (sortBy) {
      case "price-low":
        return items.sort(
          (a, b) => a.price - b.price
        );

      case "price-high":
        return items.sort(
          (a, b) => b.price - a.price
        );

      case "newest":
        return items.sort(
          (a, b) =>
            Number(Boolean(b.isNew)) -
            Number(Boolean(a.isNew))
        );

      default:
        return items;
    }
  }, [sortBy]);

  const firstProducts = sortedProducts.slice(0, 2);
  const remainingProducts = sortedProducts.slice(2);

  return (
    <div className="w-full bg-white">
      {/* ======================================
          SHOP HEADER
      ====================================== */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-16 lg:py-14">
          <div className="flex flex-col gap-7">
            {/* TITLE */}
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-black/45 sm:text-xs">
                Explore the collection
              </p>

              <h1 className="text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl">
                ALL STUDS
              </h1>

              <p className="mt-3 max-w-lg text-xs leading-6 text-black/55 sm:text-sm">
                Find the right piece for every piercing,
                stack and style.
              </p>
            </div>

            {/* CONTROLS */}
            <div className="flex flex-col gap-5 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              {/* FILTER */}
              <button
  type="button"
  onClick={() => setFilterOpen(true)}
  className="
    flex items-center gap-2
    text-[11px]
    uppercase
    tracking-[0.14em]
    text-black
  "
>
  <SlidersHorizontal
    size={16}
    strokeWidth={1.5}
  />

  Filter
</button>
              <div className="flex flex-wrap items-center gap-5">
                <p className="text-xs text-black/45">
                  Showing {sortedProducts.length} products
                </p>

                <div className="h-5 w-px bg-black/10" />

                {/* SORT */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-black/45">
                    Sort by
                  </span>

                  <select
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(
                        event.target.value as SortOption
                      )
                    }
                    className="
                      cursor-pointer
                      bg-transparent
                      text-sm
                      text-black
                      outline-none
                    "
                  >
                    <option value="featured">
                      Featured
                    </option>

                    <option value="newest">
                      Newest
                    </option>

                    <option value="price-low">
                      Price: Low to High
                    </option>

                    <option value="price-high">
                      Price: High to Low
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* TEMP FILTER PANEL */}
            {filterOpen && (
              <div className="grid grid-cols-2 gap-6 border-t border-black/10 pt-6 sm:grid-cols-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/45">
                    Piercing
                  </p>

                  <p className="mt-2 text-sm">
                    All placements
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/45">
                    Collection
                  </p>

                  <p className="mt-2 text-sm">
                    All collections
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/45">
                    Price
                  </p>

                  <p className="mt-2 text-sm">
                    ₹0 – ₹2,000+
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/45">
                    Availability
                  </p>

                  <p className="mt-2 text-sm">
                    In stock
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================
          FIRST FEATURE ROW
      ====================================== */}
      <section>
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-16 lg:py-12">
          <div
            className="
              grid
              grid-cols-2
              gap-x-3
              gap-y-8

              sm:gap-x-5

              lg:grid-cols-4
              lg:gap-x-6
            "
          >
            {/* FIRST TWO PRODUCTS */}
            {firstProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

            {/* BIG PROMO CARD */}
            <ShopPromoCard image={noseWorn} />
          </div>
        </div>
      </section>

      {/* ======================================
          ALL REMAINING PRODUCTS
      ====================================== */}
      <section className="border-t border-black/10">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-8 lg:px-16 lg:py-14">
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
            {remainingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ======================================
          LOAD MORE
      ====================================== */}
      <section className="border-t border-black/10">
        <div className="flex justify-center px-6 py-12">
          <button
            type="button"
            className="
              border border-black
              bg-white
              px-8 py-4
              text-[10px]
              font-medium
              uppercase
              tracking-[0.17em]
              text-black
              transition-all
              duration-300

              hover:bg-black
              hover:text-white
            "
          >
            Load More
          </button>
        </div>
      </section>
      <ShopFilterDrawer
  open={filterOpen}
  onClose={() => setFilterOpen(false)}
  filters={filters}
  onApply={setFilters}
/>
    </div>
  );
}

export default Shop;