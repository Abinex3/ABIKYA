import ProductCard, {
  type ProductCardData,
} from "../../components/products/ProductCard";

import minimalProduct from "../../assets/men/mens-minimal-product.png";
import minimalWorn from "../../assets/men/mens-minimal-worn.png";

import geometricProduct from "../../assets/men/mens-geometric-product.png";
import geometricWorn from "../../assets/men/mens-geometric-worn.png";

import barProduct from "../../assets/men/mens-bar-product.png";
import barWorn from "../../assets/men/mens-bar-worn.png";

import statementProduct from "../../assets/men/mens-statement-product.png";
import statementWorn from "../../assets/men/mens-statement-worn.png";

import mensMain from "../../assets/men/mens-main.png";

const menProducts: ProductCardData[] = [
  {
    id: 1,
    name: "Minimal Crystal Stud",
    slug: "minimal-crystal-stud",
    price: 999,
    material: "925 Silver",
    image: minimalProduct,
    hoverImage: minimalWorn,
    isNew: true,
  },
  {
    id: 2,
    name: "Geometric Silver Stud",
    slug: "geometric-silver-stud",
    price: 1199,
    material: "925 Silver",
    image: geometricProduct,
    hoverImage: geometricWorn,
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
  },
];

function Men() {
  return (
    <div className="w-full bg-white">
      {/* PAGE HEADER */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-16 lg:py-14">
          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-black/45">
            ABIKYATATTOOS / MEN
          </p>

          <h1 className="text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            MEN'S STUDS
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-black/50">
            Minimal. Strong. Made for everyday wear.
          </p>
        </div>
      </section>

      {/* FIRST ROW */}
      <section>
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-16 lg:py-12">
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            <ProductCard product={menProducts[0]} />

            <ProductCard product={menProducts[1]} />

            {/* BIG CAMPAIGN IMAGE */}
            <div className="group relative col-span-2 min-h-[520px] overflow-hidden bg-black">
              <img
                src={mensMain}
                alt="Men's piercing campaign"
                className="
                  absolute inset-0
                  h-full w-full
                  object-cover
                  object-center
                  transition-transform
                  duration-[1000ms]
                  ease-out
                  group-hover:scale-[1.03]
                "
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/60">
                  ABIKYATATTOOS MEN
                </p>

                <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
                  BUILT DIFFERENT.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
                  Clean silver forms made for everyday wear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REMAINING PRODUCTS */}
      <section className="border-t border-black/10">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-8 lg:px-16 lg:py-14">
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-14">
            {menProducts.slice(2).map((product) => (
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

export default Men;