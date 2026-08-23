import { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import ProductCard, {
  type ProductCardData,
} from "../../components/products/ProductCard";
import StickyProductBar from "../../components/products/StickyProductBar";

// TEMP IMAGES
import lobeProduct from "../../assets/categories/lobe-product.png";
import lobeWorn from "../../assets/categories/lobe-worn.png";

import noseProduct from "../../assets/categories/nose-product.png";
import noseWorn from "../../assets/categories/nose-worn.png";

import helixProduct from "../../assets/categories/helix-product.png";
import helixWorn from "../../assets/categories/helix-worn.png";

import tragusProduct from "../../assets/categories/tragus-product.png";
import tragusWorn from "../../assets/categories/tragus-worn.png";

import conchProduct from "../../assets/categories/conch-product.png";
import conchWorn from "../../assets/categories/conch-worn.png";

type ProductDetailsData = {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  material: string;
  piercing: string;
  stock: number;
  sku: string;
  images: string[];
  isBestSeller?: boolean;
  isSale?: boolean;
};

const product: ProductDetailsData = {
  id: 1,
  name: "Celestial Lobe Stud",
  slug: "celestial-lobe-stud",
  price: 1299,
  originalPrice: 1499,
  description:
    "A refined sterling silver stud designed for effortless everyday styling. Minimal enough to wear alone and versatile enough to layer into a curated piercing stack.",
  material: "925 Sterling Silver",
  piercing: "Lobe / Upper Lobe",
  stock: 12,
  sku: "ABK-LB-001",
  images: [lobeProduct, lobeWorn],
  isBestSeller: true,
  isSale: true,
};

const relatedProducts: ProductCardData[] = [
  {
    id: 2,
    name: "Luna Nose Stud",
    slug: "luna-nose-stud",
    price: 899,
    material: "925 Silver",
    image: noseProduct,
    hoverImage: noseWorn,
    isNew: true,
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
  },
  {
    id: 5,
    name: "Starlight Conch Stud",
    slug: "starlight-conch-stud",
    price: 1599,
    material: "925 Silver",
    image: conchProduct,
    hoverImage: conchWorn,
  },
];

type AccordionProps = {
  title: string;
  children: React.ReactNode;
};

function Accordion({ title, children }: AccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-black/10">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-sm font-medium uppercase tracking-[0.08em]">
          {title}
        </span>

        <ChevronDown
          size={18}
          strokeWidth={1.5}
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`
          grid transition-all duration-300
          ${
            open
              ? "grid-rows-[1fr] pb-5 opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="overflow-hidden">
          <div className="text-sm leading-7 text-black/60">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const relatedSectionRef = useRef<HTMLElement | null>(null);
const [showStickyBar, setShowStickyBar] = useState(false);

  const currentProduct = useMemo(() => {
    // Temporary until backend/API exists.
    // Later we'll fetch by slug.
    return product;
  }, [slug]);

  const [selectedImage, setSelectedImage] = useState(
    currentProduct.images[0]
  );

  const [purchaseType, setPurchaseType] = useState<"single" | "pair">("single");

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) =>
      Math.min(currentProduct.stock, prev + 1)
    );
  };

  const handleAddToCart = () => {
  console.log("Add to cart:", {
    product: currentProduct.name,
    purchaseType,
    quantity,
    price: selectedPrice,
  });
};

  const handleBuyNow = () => {
  console.log("Buy now:", {
    product: currentProduct.name,
    purchaseType,
    quantity,
    price: selectedPrice,
  });

  navigate("/checkout");
};

useEffect(() => {
  const section = relatedSectionRef.current;

  if (!section) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      setShowStickyBar(entry.isIntersecting);
    },
    {
      threshold: 0,
      rootMargin: "0px 0px -15% 0px",
    }
  );

  observer.observe(section);

  return () => {
    observer.disconnect();
  };
}, []);


  const unitPrice = currentProduct.price;

const selectedPrice =
  purchaseType === "pair"
    ? unitPrice * 2
    : unitPrice;

  return (
    <div className="w-full bg-white pb-24 md:pb-28">
      {/* PRODUCT TOP */}
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[58%_42%]">
          {/* LEFT - GALLERY */}
          <div className="border-r-0 border-black/10 lg:border-r">
            {/* MAIN IMAGE */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#f3f3f3] lg:aspect-auto lg:min-h-[820px]">
              <img
                src={selectedImage}
                alt={currentProduct.name}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* BADGES */}
              <div className="absolute left-5 top-5 flex flex-col gap-2">
                {currentProduct.isBestSeller && (
                  <span className="bg-black px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-white">
                    Best Seller
                  </span>
                )}

                {currentProduct.isSale && (
                  <span className="bg-red-600 px-3 py-2 text-[9px] uppercase tracking-[0.16em] text-white">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* THUMBNAILS */}
            <div className="grid grid-cols-2 border-t border-black/10">
              {currentProduct.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`
                    relative aspect-[4/5] overflow-hidden
                    ${
                      selectedImage === image
                        ? "border-2 border-black"
                        : "border-r border-black/10"
                    }
                  `}
                >
                  <img
                    src={image}
                    alt={`${currentProduct.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT - PRODUCT INFO */}
          <div className="px-6 py-10 sm:px-10 lg:px-12 lg:py-14 xl:px-16">
            <div className="lg:sticky lg:top-8">
              {/* BREADCRUMB */}
              <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">
                Home / Shop / {currentProduct.piercing}
              </p>

              {/* PRODUCT HEADER */}
              <div className="mt-7">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h1 className="text-3xl leading-tight tracking-tight text-black sm:text-4xl">
                      {currentProduct.name}
                    </h1>

                    <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-black/45">
                      SKU: {currentProduct.sku}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Add to wishlist"
                    onClick={() =>
                      setIsWishlisted((prev) => !prev)
                    }
                    className={`
                      flex h-11 w-11 shrink-0
                      items-center justify-center
                      rounded-full border
                      transition-all duration-300
                      ${
                        isWishlisted
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-black/20 text-black hover:bg-black hover:text-white"
                      }
                    `}
                  >
                    <Heart
                      size={19}
                      strokeWidth={1.6}
                      fill={
                        isWishlisted
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                {/* PRICE */}
                <div className="mt-6 flex items-center gap-3">
                  <p
                    className={`text-2xl ${
                      currentProduct.isSale
                        ? "text-red-600"
                        : "text-black"
                    }`}
                  >
                    ₹{selectedPrice.toLocaleString("en-IN")}
                  </p>

                  {currentProduct.originalPrice && (
                    <p className="text-sm text-black/35 line-through">
                      ₹
                      {currentProduct.originalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  )}
                </div>

                {/* STOCK */}
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      currentProduct.stock > 0
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  />

                  <span className="text-xs uppercase tracking-[0.12em] text-black/55">
                    {currentProduct.stock > 0
                      ? `In stock · ${currentProduct.stock} available`
                      : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="mt-7 text-sm leading-7 text-black/60">
                {currentProduct.description}
              </p>

              {/* PRODUCT META */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-y border-black/10 py-6">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-black/40">
                    Material
                  </p>

                  <p className="mt-2 text-sm">
                    {currentProduct.material}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-black/40">
                    Piercing
                  </p>

                  <p className="mt-2 text-sm">
                    {currentProduct.piercing}
                  </p>
                </div>
              </div>

              {/* SINGLE / PAIR SELECTOR */}
<div className="mt-8">
  <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-black/50">
    Select Quantity Type
  </p>

  <div className="grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => setPurchaseType("single")}
      className={`
        min-h-[52px]
        border
        px-5
        text-[11px]
        font-medium
        uppercase
        tracking-[0.14em]
        transition-all
        duration-300
        ${
          purchaseType === "single"
            ? "border-black bg-black text-white"
            : "border-black/20 bg-white text-black hover:border-black"
        }
      `}
    >
      Single
    </button>

    <button
      type="button"
      onClick={() => setPurchaseType("pair")}
      className={`
        min-h-[52px]
        border
        px-5
        text-[11px]
        font-medium
        uppercase
        tracking-[0.14em]
        transition-all
        duration-300
        ${
          purchaseType === "pair"
            ? "border-black bg-black text-white"
            : "border-black/20 bg-white text-black hover:border-black"
        }
      `}
    >
      Pair
    </button>
  </div>

  <p className="mt-3 text-xs text-black/45">
    {purchaseType === "single"
      ? "1 stud included"
      : "2 matching studs included"}
  </p>
</div>

{/* OFFERS BOX */}
<div className="mt-8 border border-black/10 bg-[#f7f7f7]">
  <div className="border-b border-black/10 px-5 py-4">
    <p className="text-[11px] font-medium uppercase tracking-[0.14em]">
      Available Offers
    </p>
  </div>

  <div className="divide-y divide-black/10">
    <div className="flex gap-4 px-5 py-4">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-600" />

      <div>
        <p className="text-sm font-medium">
          Prepaid Order Offer
        </p>

        <p className="mt-1 text-xs leading-5 text-black/50">
          Get free shipping on eligible prepaid orders.
        </p>
      </div>
    </div>

    <div className="flex gap-4 px-5 py-4">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-600" />

      <div>
        <p className="text-sm font-medium">
          Pair & Save
        </p>

        <p className="mt-1 text-xs leading-5 text-black/50">
          Choose Pair for a matching two-piece set.
        </p>
      </div>
    </div>

    <div className="flex gap-4 px-5 py-4">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-600" />

      <div>
        <p className="text-sm font-medium">
          Limited-Time Pricing
        </p>

        <p className="mt-1 text-xs leading-5 text-black/50">
          Special prices may apply while stocks last.
        </p>
      </div>
    </div>
  </div>
</div>

              {/* QUANTITY */}
              <div className="mt-8">
                <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-black/50">
                  Quantity
                </p>

                <div className="flex h-12 w-[150px] items-center border border-black/20">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="flex h-full w-12 items-center justify-center hover:bg-black hover:text-white"
                  >
                    <Minus
                      size={15}
                      strokeWidth={1.5}
                    />
                  </button>

                  <span className="flex-1 text-center text-sm">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="flex h-full w-12 items-center justify-center hover:bg-black hover:text-white"
                  >
                    <Plus
                      size={15}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </div>

              {/* PURCHASE BUTTONS */}
              <div className="mt-8 grid gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={currentProduct.stock <= 0}
                  className="
                    min-h-[58px]
                    bg-black
                    px-6
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-white
                    transition-colors
                    duration-300

                    hover:bg-red-600

                    disabled:cursor-not-allowed
                    disabled:bg-black/20
                  "
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={currentProduct.stock <= 0}
                  className="
                    min-h-[58px]
                    border
                    border-black
                    bg-white
                    px-6
                    text-[11px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-black
                    transition-all
                    duration-300

                    hover:bg-black
                    hover:text-white

                    disabled:cursor-not-allowed
                    disabled:border-black/10
                    disabled:text-black/30
                  "
                >
                  Buy Now
                </button>
              </div>

              {/* TRUST ROW */}
              <div className="mt-8 grid grid-cols-3 border-y border-black/10">
                <div className="flex flex-col items-center px-2 py-5 text-center">
                  <ShieldCheck
                    size={20}
                    strokeWidth={1.4}
                  />

                  <span className="mt-2 text-[9px] uppercase tracking-[0.12em] text-black/55">
                    925 Silver
                  </span>
                </div>

                <div className="flex flex-col items-center border-x border-black/10 px-2 py-5 text-center">
                  <Truck
                    size={20}
                    strokeWidth={1.4}
                  />

                  <span className="mt-2 text-[9px] uppercase tracking-[0.12em] text-black/55">
                    Fast Delivery
                  </span>
                </div>

                <div className="flex flex-col items-center px-2 py-5 text-center">
                  <RotateCcw
                    size={20}
                    strokeWidth={1.4}
                  />

                  <span className="mt-2 text-[9px] uppercase tracking-[0.12em] text-black/55">
                    Easy Returns
                  </span>
                </div>
              </div>

              {/* ACCORDIONS */}
              <div className="mt-4">
                <Accordion title="Product Details">
                  <p>
                    Designed for everyday wear with a
                    clean, premium finish. Suitable for
                    lobe and upper-lobe styling.
                  </p>
                </Accordion>

                <Accordion title="Material & Care">
                  <p>
                    Crafted in 925 sterling silver. Avoid
                    harsh chemicals and store in a dry
                    place when not in use.
                  </p>
                </Accordion>

                <Accordion title="Shipping & Delivery">
                  <p>
                    Orders are processed after payment
                    confirmation. Delivery timelines will
                    depend on location and the final
                    shipping workflow.
                  </p>
                </Accordion>

                <Accordion title="Returns & Refunds">
                  <p>
                    Returns and refunds are subject to the
                    approved hygiene and return policy.
                    Final policy content will be added
                    before launch.
                  </p>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section ref={relatedSectionRef} className="border-b border-black/10">
        <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-black/45">
              You may also like
            </p>

            <h2 className="text-3xl tracking-tight sm:text-4xl">
              RELATED PRODUCTS
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
            ))}
          </div>
        </div>
      </section>
      <StickyProductBar
  visible={showStickyBar}
  image={currentProduct.images[0]}
  name={currentProduct.name}
  price={selectedPrice}
  purchaseType={purchaseType}
  quantity={quantity}
  stock={currentProduct.stock}
  onDecrease={decreaseQuantity}
  onIncrease={increaseQuantity}
  onAddToCart={handleAddToCart}
/>
    </div>
  );
}

export default ProductDetails;