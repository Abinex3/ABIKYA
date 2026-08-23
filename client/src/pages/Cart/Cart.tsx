import { useMemo, useState } from "react";
import { Minus, Plus, Gift, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import ProductCard, {
  type ProductCardData,
} from "../../components/products/ProductCard";

// TEMP CART PRODUCT
import cartProductImage from "../../assets/categories/lobe-product.png";

// RELATED PRODUCTS
import noseProduct from "../../assets/categories/nose-product.png";
import noseWorn from "../../assets/categories/nose-worn.png";

import helixProduct from "../../assets/categories/helix-product.png";
import helixWorn from "../../assets/categories/helix-worn.png";

import tragusProduct from "../../assets/categories/tragus-product.png";
import tragusWorn from "../../assets/categories/tragus-worn.png";

import conchProduct from "../../assets/categories/conch-product.png";
import conchWorn from "../../assets/categories/conch-worn.png";

type CartItem = {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  purchaseType: "single" | "pair";
  material: string;
  gift: boolean;
};

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: "Celestial Lobe Stud",
    slug: "celestial-lobe-stud",
    image: cartProductImage,
    price: 1299,
    quantity: 1,
    purchaseType: "single",
    material: "925 Silver",
    gift: false,
  },
];

const relatedProducts: ProductCardData[] = [
  {
    id: 101,
    name: "Luna Nose Stud",
    slug: "luna-nose-stud",
    price: 899,
    material: "925 Silver",
    image: noseProduct,
    hoverImage: noseWorn,
    isNew: true,
  },
  {
    id: 102,
    name: "Orbit Helix Stud",
    slug: "orbit-helix-stud",
    price: 1499,
    material: "925 Silver",
    image: helixProduct,
    hoverImage: helixWorn,
  },
  {
    id: 103,
    name: "Halo Tragus Stud",
    slug: "halo-tragus-stud",
    price: 1099,
    material: "925 Silver",
    image: tragusProduct,
    hoverImage: tragusWorn,
  },
  {
    id: 104,
    name: "Starlight Conch Stud",
    slug: "starlight-conch-stud",
    price: 1599,
    material: "925 Silver",
    image: conchProduct,
    hoverImage: conchWorn,
    isSale: true,
    originalPrice: 1899,
  },
];

function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>(
    initialCartItems
  );

  const increaseQuantity = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const toggleGift = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              gift: !item.gift,
            }
          : item
      )
    );
  };

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [items]);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="w-full bg-white">
      {/* =======================================
          CART HEADER
      ======================================= */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-[1600px] px-5 py-10 text-center sm:px-8 lg:px-16 lg:py-14">
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
            Your Selection
          </p>

          <h1 className="mt-2 text-3xl tracking-tight text-black sm:text-4xl lg:text-5xl">
            SHOPPING CART
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
              Your Shopping Cart
            </span>
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-black/40">
            {totalItems}{" "}
            {totalItems === 1 ? "item" : "items"}
          </p>
        </div>
      </section>

      {/* =======================================
          CART BODY
      ======================================= */}
      <section>
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-16 lg:py-12">
          {items.length > 0 ? (
            <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
              {/* =================================
                  CART ITEMS
              ================================= */}
              <div>
                {/* DESKTOP HEADERS */}
                <div className="hidden grid-cols-[1.6fr_0.6fr_0.7fr_0.6fr] border-b border-black/15 pb-5 text-[11px] font-medium uppercase tracking-[0.12em] lg:grid">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span className="text-right">
                    Total
                  </span>
                </div>

                {/* PRODUCT LIST */}
                <div className="divide-y divide-black/10">
                  {items.map((item) => {
                    const itemTotal =
                      item.price * item.quantity;

                    return (
                      <article
                        key={item.id}
                        className="
                          grid
                          gap-6
                          py-7

                          lg:grid-cols-[1.6fr_0.6fr_0.7fr_0.6fr]
                          lg:items-center
                          lg:py-8
                        "
                      >
                        {/* PRODUCT */}
                        <div className="flex gap-4 sm:gap-5">
                          <Link
                            to={`/product/${item.slug}`}
                            className="
                              h-[145px]
                              w-[115px]
                              shrink-0
                              overflow-hidden
                              bg-[#f4f4f4]

                              sm:h-[170px]
                              sm:w-[135px]
                            "
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </Link>

                          <div className="flex min-w-0 flex-col">
                            <Link
                              to={`/product/${item.slug}`}
                              className="w-fit"
                            >
                              <h2 className="text-sm font-medium text-black transition-opacity duration-300 hover:opacity-60 sm:text-base">
                                {item.name}
                              </h2>
                            </Link>

                            <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-black/40">
                              {item.purchaseType}
                            </p>

                            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-black/40">
                              {item.material}
                            </p>

                            {/* MOBILE PRICE */}
                            <p className="mt-3 text-sm font-medium lg:hidden">
                              ₹
                              {item.price.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            {/* GIFT */}
                            <label className="mt-4 flex w-fit cursor-pointer items-center gap-3">
                              <input
                                type="checkbox"
                                checked={item.gift}
                                onChange={() =>
                                  toggleGift(item.id)
                                }
                                className="sr-only"
                              />

                              <span
                                className={`
                                  flex h-5 w-5
                                  items-center
                                  justify-center
                                  border
                                  transition-all
                                  duration-200

                                  ${
                                    item.gift
                                      ? "border-black bg-black"
                                      : "border-black/25 bg-white"
                                  }
                                `}
                              >
                                {item.gift && (
                                  <svg
                                    viewBox="0 0 12 12"
                                    className="h-3 w-3"
                                    fill="none"
                                  >
                                    <path
                                      d="M2 6.2 4.6 9 10 3"
                                      stroke="white"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </span>

                              <span className="flex items-center gap-2 text-xs text-black/60">
                                <Gift
                                  size={14}
                                  strokeWidth={1.4}
                                />

                                Make it a gift
                              </span>
                            </label>

                            {/* REMOVE */}
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(item.id)
                              }
                              className="
                                mt-4
                                w-fit
                                border-b
                                border-black/30
                                text-[10px]
                                uppercase
                                tracking-[0.1em]
                                text-black/50
                                transition-colors
                                duration-300

                                hover:border-red-600
                                hover:text-red-600
                              "
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* DESKTOP PRICE */}
                        <div className="hidden lg:block">
                          <p className="text-sm font-medium">
                            ₹
                            {item.price.toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>

                        {/* QUANTITY */}
                        <div>
                          <div className="mb-2 text-[9px] uppercase tracking-[0.14em] text-black/40 lg:hidden">
                            Quantity
                          </div>

                          <div className="flex h-12 w-[150px] items-center border border-black/20">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                              disabled={
                                item.quantity <= 1
                              }
                              className="
                                flex h-full w-12
                                items-center
                                justify-center
                                transition-all
                                duration-300

                                hover:bg-black
                                hover:text-white

                                disabled:cursor-not-allowed
                                disabled:opacity-25
                              "
                            >
                              <Minus
                                size={14}
                                strokeWidth={1.5}
                              />
                            </button>

                            <span className="flex-1 text-center text-sm">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                              className="
                                flex h-full w-12
                                items-center
                                justify-center
                                transition-all
                                duration-300

                                hover:bg-black
                                hover:text-white
                              "
                            >
                              <Plus
                                size={14}
                                strokeWidth={1.5}
                              />
                            </button>
                          </div>
                        </div>

                        {/* TOTAL */}
                        <div className="lg:text-right">
                          <div className="mb-2 text-[9px] uppercase tracking-[0.14em] text-black/40 lg:hidden">
                            Total
                          </div>

                          <p className="text-sm font-medium">
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* CONTINUE SHOPPING */}
                <div className="border-t border-black/10 pt-6">
                  <Link
                    to="/shop"
                    className="
                      group
                      inline-flex
                      items-center
                      gap-3
                      border-b
                      border-black
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
              </div>

              {/* =================================
                  ORDER SUMMARY
              ================================= */}
              <aside className="h-fit border border-black/10 bg-[#f5f5f5] p-6 lg:sticky lg:top-8">
                <p className="text-[10px] uppercase tracking-[0.18em] text-black/45">
                  Order Summary
                </p>

                <h2 className="mt-2 text-2xl tracking-tight">
                  Cart Total
                </h2>

                <div className="mt-6 space-y-4 border-y border-black/10 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/55">
                      Subtotal
                    </span>

                    <span className="font-medium">
                      ₹
                      {subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/55">
                      Shipping
                    </span>

                    <span className="text-black/45">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-black/55">
                      Tax
                    </span>

                    <span className="text-black/45">
                      Included
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5">
                  <span className="text-base font-medium">
                    Total
                  </span>

                  <span className="text-xl font-medium">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <p className="mt-3 text-[10px] leading-5 text-black/45">
                  Final shipping charges are calculated
                  during checkout.
                </p>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="
                    mt-6
                    min-h-[58px]
                    w-full
                    bg-black
                    px-6
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
                  Checkout
                </button>

                <div className="mt-5 border-t border-black/10 pt-5">
                  <p className="text-center text-[9px] uppercase tracking-[0.16em] text-black/40">
                    Secure checkout · 925 Silver · Easy
                    returns
                  </p>
                </div>
              </aside>
            </div>
          ) : (
            /* =====================================
               EMPTY CART
            ===================================== */
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                Your Cart
              </p>

              <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
                YOUR CART IS EMPTY
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-black/50">
                Your next piercing stack is waiting.
                Explore the collection and find something
                made for you.
              </p>

              <Link
                to="/shop"
                className="
                  mt-8
                  bg-black
                  px-8
                  py-4
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
                Shop Studs
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =======================================
          RELATED PRODUCTS
      ======================================= */}
      <section className="border-t border-black/10 bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-8 lg:px-16 lg:py-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-black/45">
                Complete your stack
              </p>

              <h2 className="text-3xl tracking-tight text-black sm:text-4xl">
                YOU MAY ALSO LIKE
              </h2>

              <p className="mt-3 max-w-lg text-xs leading-6 text-black/50 sm:text-sm">
                A few more pieces that pair well with
                what’s already in your cart.
              </p>
            </div>

            <Link
              to="/shop"
              className="
                group
                hidden
                items-center
                gap-3
                border-b
                border-black
                pb-1
                text-[10px]
                font-medium
                uppercase
                tracking-[0.15em]

                sm:flex
              "
            >
              View All

              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-center sm:hidden">
            <Link
              to="/shop"
              className="
                flex min-w-[180px]
                items-center
                justify-center
                gap-3
                bg-black
                px-6
                py-4
                text-[10px]
                uppercase
                tracking-[0.16em]
                text-white
              "
            >
              View All

              <ArrowRight
                size={14}
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cart;