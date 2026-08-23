import ProductCard, {
  type ProductCardData,
} from "../../components/products/ProductCard";

// EXISTING CATEGORY IMAGES

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

const womenProducts: ProductCardData[] = [
  {
    id: 301,
    name: "Celestial Lobe Stud",
    slug: "celestial-lobe-stud",
    price: 1299,
    material: "925 Silver",
    image: lobeProduct,
    hoverImage: lobeWorn,
    isNew: true,
  },
  {
    id: 302,
    name: "Traditional Bugadi Stud",
    slug: "traditional-bugadi-stud",
    price: 1499,
    material: "925 Silver",
    image: bugadiProduct,
    hoverImage: bugadiWorn,
    isNew: true,
  },
  {
    id: 303,
    name: "Crystal Belly Stud",
    slug: "crystal-belly-stud",
    price: 1399,
    material: "925 Silver",
    image: bellyButtonProduct,
    hoverImage: bellyButtonWorn,
  },
  {
    id: 304,
    name: "Luna Nose Stud",
    slug: "luna-nose-stud",
    price: 899,
    material: "925 Silver",
    image: noseProduct,
    hoverImage: noseWorn,
  },
  {
    id: 305,
    name: "Minimal Eyebrow Stud",
    slug: "minimal-eyebrow-stud",
    price: 1099,
    originalPrice: 1399,
    material: "925 Silver",
    image: eyebrowProduct,
    hoverImage: eyebrowWorn,
    isSale: true,
  },
  {
    id: 306,
    name: "Classic Tongue Stud",
    slug: "classic-tongue-stud",
    price: 1199,
    material: "925 Silver",
    image: tongueProduct,
    hoverImage: tongueWorn,
  },
  {
    id: 307,
    name: "Mini Spark Upper Lobe Stud",
    slug: "mini-spark-upper-lobe-stud",
    price: 999,
    material: "925 Silver",
    image: upperLobeProduct,
    hoverImage: upperLobeWorn,
  },
  {
    id: 308,
    name: "Nova Flat Stud",
    slug: "nova-flat-stud",
    price: 1299,
    material: "925 Silver",
    image: flatProduct,
    hoverImage: flatWorn,
  },
  {
    id: 309,
    name: "Orbit Helix Stud",
    slug: "orbit-helix-stud",
    price: 1499,
    material: "925 Silver",
    image: helixProduct,
    hoverImage: helixWorn,
    isNew: true,
  },
  {
    id: 310,
    name: "Minimal Snug Stud",
    slug: "minimal-snug-stud",
    price: 1099,
    material: "925 Silver",
    image: snugProduct,
    hoverImage: snugWorn,
  },
  {
    id: 311,
    name: "Starlight Conch Stud",
    slug: "starlight-conch-stud",
    price: 1599,
    originalPrice: 1899,
    material: "925 Silver",
    image: conchProduct,
    hoverImage: conchWorn,
    isSale: true,
  },
  {
    id: 312,
    name: "Halo Tragus Stud",
    slug: "halo-tragus-stud",
    price: 1099,
    material: "925 Silver",
    image: tragusProduct,
    hoverImage: tragusWorn,
  },
  {
    id: 313,
    name: "Midnight Daith Stud",
    slug: "midnight-daith-stud",
    price: 1399,
    material: "925 Silver",
    image: daithProduct,
    hoverImage: daithWorn,
  },
];

function Women() {
  const firstProducts = womenProducts.slice(0, 2);
  const remainingProducts = womenProducts.slice(2);

  return (
    <div className="w-full bg-white">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-16 lg:py-14">
          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-black/45">
            ABIKYATATTOOS / WOMEN
          </p>

          <h1 className="text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl">
            WOMEN'S STUDS
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-black/50">
            Small details. Personal expression. Discover studs made
            for every piercing, stack and everyday style.
          </p>
        </div>
      </section>

      {/* ==========================================
          FIRST FEATURE ROW
          2 PRODUCTS + LARGE IMAGE
      ========================================== */}
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

            {/* ======================================
                LARGE EDITORIAL IMAGE

                Reusing existing lobe worn image.
                Later replace this with original
                women's campaign photography.
            ====================================== */}
            <div
              className="
                group
                relative
                col-span-2
                min-h-[500px]
                overflow-hidden
                bg-black

                sm:min-h-[600px]
              "
            >
              <img
                src={lobeWorn}
                alt="Women's piercing collection"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  object-center

                  transition-transform
                  duration-[1000ms]
                  ease-out

                  group-hover:scale-[1.03]
                "
              />

              {/* GRADIENT */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/75
                  via-black/10
                  to-transparent
                "
              />

              {/* CONTENT */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">
                  ABIKYATATTOOS WOMEN
                </p>

                <h2 className="mt-3 text-3xl leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                  YOUR PIERCINGS.
                  <br />
                  YOUR STORY.
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
                  Build a stack that feels entirely your own.
                </p>

                <a
                  href="#women-products"
                  className="
                    mt-6
                    inline-block
                    border-b
                    border-white
                    pb-1

                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.16em]

                    transition-opacity
                    duration-300

                    hover:opacity-60
                  "
                >
                  Explore Collection →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          REMAINING PRODUCTS
      ========================================== */}
      <section
        id="women-products"
        className="border-t border-black/10"
      >
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-8 lg:px-16 lg:py-14">
          {/* SECTION HEADING */}
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-black/40">
                Explore all
              </p>

              <h2 className="text-2xl tracking-tight sm:text-3xl">
                WOMEN'S COLLECTION
              </h2>
            </div>

            <p className="hidden text-xs text-black/40 sm:block">
              {womenProducts.length} products
            </p>
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
            {remainingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Women;