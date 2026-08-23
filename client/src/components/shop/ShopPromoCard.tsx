import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type ShopPromoCardProps = {
  image: string;
};

function ShopPromoCard({ image }: ShopPromoCardProps) {
  return (
    <Link
      to="/shop"
      className="
        group relative
        col-span-2
        block
        min-h-[520px]
        overflow-hidden
        bg-black

        md:min-h-[600px]
      "
    >
      <img
        src={image}
        alt="ABIKYATATTOOS piercing campaign"
        className="
          absolute inset-0
          h-full w-full
          object-cover
          transition-transform
          duration-[1000ms]
          ease-out

          group-hover:scale-[1.03]
        "
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/65">
          ABIKYATATTOOS
        </p>

        <h3 className="mt-3 max-w-md text-3xl leading-tight tracking-tight sm:text-4xl">
          EXPRESS YOUR EDGE
        </h3>

        <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">
          Discover studs designed for every piercing and every version of you.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 border-b border-white pb-1 text-[10px] uppercase tracking-[0.16em]">
          Shop Now

          <ArrowRight
            size={15}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

export default ShopPromoCard;