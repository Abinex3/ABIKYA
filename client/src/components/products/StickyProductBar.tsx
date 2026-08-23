import { Minus, Plus } from "lucide-react";

type StickyProductBarProps = {
  visible: boolean;
  image: string;
  name: string;
  price: number;
  purchaseType: "single" | "pair";
  quantity: number;
  stock: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onAddToCart: () => void;
};


function StickyProductBar({
  visible,
  image,
  name,
  price,
  purchaseType,
  quantity,
  stock,
  onDecrease,
  onIncrease,
  onAddToCart,
}: StickyProductBarProps) {
      return (
    <div
  className={`
    fixed
    bottom-0
    left-0
    right-0
    z-[80]

    border-t
    border-black/10

    bg-white/95
    backdrop-blur-md

    shadow-[0_-8px_30px_rgba(0,0,0,0.08)]

    transition-all
    duration-500
    ease-[cubic-bezier(0.22,1,0.36,1)]

    ${
      visible
        ? "translate-y-0 opacity-100"
        : "pointer-events-none translate-y-full opacity-0"
    }
  `}
>
      <div
        className="
          mx-auto
          flex
          max-w-[1600px]
          items-center
          justify-between
          gap-4
          px-4
          py-3

          sm:px-6

          lg:px-10
        "
      >
        {/* PRODUCT INFO */}
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              h-14
              w-14
              shrink-0
              overflow-hidden
              bg-[#f3f3f3]

              sm:h-16
              sm:w-16
            "
          >
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                truncate
                text-xs
                font-medium
                text-black

                sm:text-sm
              "
            >
              {name}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs font-medium text-black sm:text-sm">
                ₹{price.toLocaleString("en-IN")}
              </p>

              <span className="text-[9px] uppercase tracking-[0.14em] text-black/40">
                {purchaseType}
              </span>
            </div>
          </div>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          {/* QUANTITY */}
          <div
            className="
              flex
              h-12
              items-center
              border
              border-black/20
              bg-white
            "
          >
            <button
              type="button"
              onClick={onDecrease}
              disabled={quantity <= 1}
              className="
                flex
                h-full
                w-11
                items-center
                justify-center
                transition-colors
                duration-300

                hover:bg-black
                hover:text-white

                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <Minus size={14} strokeWidth={1.5} />
            </button>

            <span className="min-w-[42px] text-center text-sm">
              {quantity}
            </span>

            <button
              type="button"
              onClick={onIncrease}
              disabled={quantity >= stock}
              className="
                flex
                h-full
                w-11
                items-center
                justify-center
                transition-colors
                duration-300

                hover:bg-black
                hover:text-white

                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* ADD TO CART */}
          <button
            type="button"
            onClick={onAddToCart}
            disabled={stock <= 0}
            className="
              min-h-[48px]
              min-w-[220px]
              bg-black
              px-8
              text-[10px]
              font-medium
              uppercase
              tracking-[0.17em]
              text-white
              transition-colors
              duration-300

              hover:bg-red-600

              disabled:cursor-not-allowed
              disabled:bg-black/20
            "
          >
            {stock > 0 ? "Add to Cart" : "Sold Out"}
          </button>
        </div>

        {/* MOBILE ADD TO CART */}
        <button
          type="button"
          onClick={onAddToCart}
          disabled={stock <= 0}
          className="
            min-h-[46px]
            shrink-0
            bg-black
            px-5
            text-[9px]
            font-medium
            uppercase
            tracking-[0.14em]
            text-white

            md:hidden

            disabled:bg-black/20
          "
        >
          {stock > 0 ? "Add" : "Sold Out"}
        </button>
      </div>
    </div>
  );
}

export default StickyProductBar;