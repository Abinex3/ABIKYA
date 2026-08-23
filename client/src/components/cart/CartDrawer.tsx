import { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import cartImage from "../../assets/categories/lobe-product.png";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type CartItem = {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  purchaseType: "single" | "pair";
};

function CartDrawer({ open, onClose }: CartDrawerProps) {
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Celestial Lobe Stud",
      slug: "celestial-lobe-stud",
      image: cartImage,
      price: 1299,
      quantity: 1,
      purchaseType: "single",
    },
  ]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

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

  const subtotal = items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleViewCart = () => {
    onClose();
    navigate("/cart");
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-[110]
          bg-black/55
          transition-opacity duration-300

          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* DRAWER */}
      <aside
        className={`
          fixed
          right-0
          top-0
          z-[120]

          flex
          h-dvh
          w-full
          max-w-[480px]
          flex-col

          bg-white
          shadow-2xl

          transition-transform
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${
            open
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-5 sm:px-6">
          <div>
            <h2 className="text-xl tracking-tight text-black">
              Shopping Cart
            </h2>

            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-black/45">
              {items.length}{" "}
              {items.length === 1 ? "item" : "items"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="
              flex h-10 w-10
              items-center justify-center
              text-black
              transition-transform duration-300
              hover:rotate-90
            "
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* CART CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {items.length > 0 ? (
            <div className="divide-y divide-black/10">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 px-5 py-6 sm:px-6"
                >
                  {/* IMAGE */}
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={onClose}
                    className="
                      h-[130px]
                      w-[105px]
                      shrink-0
                      overflow-hidden
                      bg-[#f3f3f3]

                      sm:h-[145px]
                      sm:w-[120px]
                    "
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  {/* INFO */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={onClose}
                      className="pr-4"
                    >
                      <h3 className="text-sm leading-5 text-black transition-opacity duration-300 hover:opacity-60">
                        {item.name}
                      </h3>
                    </Link>

                    <p className="mt-2 text-sm font-medium">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-black/40">
                      {item.purchaseType}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
                      {/* QUANTITY */}
                      <div className="flex h-10 items-center border border-black/20">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          disabled={item.quantity <= 1}
                          className="
                            flex h-full w-10
                            items-center justify-center
                            transition-colors duration-300

                            hover:bg-black
                            hover:text-white

                            disabled:cursor-not-allowed
                            disabled:opacity-25
                          "
                        >
                          <Minus
                            size={13}
                            strokeWidth={1.5}
                          />
                        </button>

                        <span className="min-w-[38px] text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          className="
                            flex h-full w-10
                            items-center justify-center
                            transition-colors duration-300

                            hover:bg-black
                            hover:text-white
                          "
                        >
                          <Plus
                            size={13}
                            strokeWidth={1.5}
                          />
                        </button>
                      </div>

                      {/* REMOVE */}
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.id)
                        }
                        className="
                          border-b
                          border-black/40
                          text-[10px]
                          uppercase
                          tracking-[0.1em]
                          text-black/55

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
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <p className="text-2xl tracking-tight">
                Your cart is empty.
              </p>

              <p className="mt-3 max-w-xs text-sm leading-6 text-black/50">
                Find a piece you love and add it to your
                piercing stack.
              </p>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate("/shop");
                }}
                className="
                  mt-7
                  bg-black
                  px-7 py-4
                  text-[10px]
                  uppercase
                  tracking-[0.17em]
                  text-white
                "
              >
                Shop Studs
              </button>
            </div>
          )}
        </div>

        {/* CART FOOTER */}
        {items.length > 0 && (
          <div className="border-t border-black/10 bg-[#f5f5f5] px-5 py-5 sm:px-6">
            {/* SUBTOTAL */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Subtotal
              </span>

              <span className="text-lg font-medium">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="mt-2 text-[10px] leading-5 text-black/45">
              Shipping and final charges are calculated at
              checkout.
            </p>

            {/* CHECKOUT */}
            <button
              type="button"
              onClick={handleCheckout}
              className="
                mt-5
                min-h-[56px]
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

            {/* VIEW CART */}
            <button
              type="button"
              onClick={handleViewCart}
              className="
                mx-auto
                mt-4
                block
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
              View Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;