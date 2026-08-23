import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export type ShopFilters = {
  inStock: boolean;
  outOfStock: boolean;
  minPrice: number;
  maxPrice: number;
  piercings: string[];
  collections: string[];
  saleOnly: boolean;
};

type ShopFilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  filters: ShopFilters;
  onApply: (filters: ShopFilters) => void;
};

const piercingOptions = [
  "Lobe",
  "Bugadi",
  "Belly Button",
  "Nose",
  "Eyebrow",
  "Tongue",
  "Upper Lobe",
  "Flat",
  "Helix",
  "Snug",
  "Conch",
  "Tragus",
  "Daith",
];

const collectionOptions = [
  "Best Sellers",
  "New Arrivals",
  "Minimal",
  "Statement",
  "Tattoo Collection",
];

function ShopFilterDrawer({
  open,
  onClose,
  filters,
  onApply,
}: ShopFilterDrawerProps) {
  const [localFilters, setLocalFilters] =
    useState<ShopFilters>(filters);

  const [openSections, setOpenSections] = useState({
    availability: true,
    price: true,
    piercing: true,
    collection: false,
    offers: false,
  });

  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, filters]);

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

  const toggleSection = (
    section: keyof typeof openSections
  ) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const togglePiercing = (piercing: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      piercings: prev.piercings.includes(piercing)
        ? prev.piercings.filter(
            (item) => item !== piercing
          )
        : [...prev.piercings, piercing],
    }));
  };

  const toggleCollection = (collection: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      collections: prev.collections.includes(collection)
        ? prev.collections.filter(
            (item) => item !== collection
          )
        : [...prev.collections, collection],
    }));
  };

  const resetFilters = () => {
    setLocalFilters({
      inStock: false,
      outOfStock: false,
      minPrice: 0,
      maxPrice: 3000,
      piercings: [],
      collections: [],
      saleOnly: false,
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-[90]
          bg-black/55
          backdrop-blur-[1px]
          transition-opacity
          duration-300

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
          left-0
          top-0
          z-[100]

          flex
          h-dvh
          w-[92%]
          max-w-[440px]
          flex-col

          bg-[#f7f7f7]

          shadow-2xl

          transition-transform
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-6">
          <h2 className="text-3xl tracking-tight">
            Filters
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="
              flex h-10 w-10
              items-center justify-center

              transition-transform
              duration-300

              hover:rotate-90
            "
          >
            <X size={25} strokeWidth={1.5} />
          </button>
        </div>

        {/* FILTER CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {/* AVAILABILITY */}
          <FilterSection
            title="Availability"
            open={openSections.availability}
            onToggle={() =>
              toggleSection("availability")
            }
          >
            <div className="space-y-4">
              <CheckboxRow
                label="In stock"
                checked={localFilters.inStock}
                onChange={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    inStock: !prev.inStock,
                  }))
                }
              />

              <CheckboxRow
                label="Out of stock"
                checked={localFilters.outOfStock}
                onChange={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    outOfStock: !prev.outOfStock,
                  }))
                }
              />
            </div>
          </FilterSection>

          {/* PRICE */}
          <FilterSection
            title="Price"
            open={openSections.price}
            onToggle={() => toggleSection("price")}
          >
            <div>
              {/* PRICE RANGE */}
              <div className="relative mb-8 h-6">
                <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-black/20" />

                <div
                  className="absolute top-1/2 h-[2px] -translate-y-1/2 bg-black"
                  style={{
                    left: `${
                      (localFilters.minPrice / 3000) * 100
                    }%`,
                    right: `${
                      100 -
                      (localFilters.maxPrice / 3000) * 100
                    }%`,
                  }}
                />

                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={localFilters.minPrice}
                  onChange={(event) => {
                    const value = Number(
                      event.target.value
                    );

                    setLocalFilters((prev) => ({
                      ...prev,
                      minPrice: Math.min(
                        value,
                        prev.maxPrice - 50
                      ),
                    }));
                  }}
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    h-full
                    w-full
                    appearance-none
                    bg-transparent

                    [&::-webkit-slider-thumb]:pointer-events-auto
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-black

                    [&::-moz-range-thumb]:pointer-events-auto
                    [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:w-5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:bg-black
                  "
                />

                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={localFilters.maxPrice}
                  onChange={(event) => {
                    const value = Number(
                      event.target.value
                    );

                    setLocalFilters((prev) => ({
                      ...prev,
                      maxPrice: Math.max(
                        value,
                        prev.minPrice + 50
                      ),
                    }));
                  }}
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    h-full
                    w-full
                    appearance-none
                    bg-transparent

                    [&::-webkit-slider-thumb]:pointer-events-auto
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-black

                    [&::-moz-range-thumb]:pointer-events-auto
                    [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:w-5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:bg-black
                  "
                />
              </div>

              {/* PRICE INPUTS */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <PriceInput
                  value={localFilters.minPrice}
                  onChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      minPrice: Math.min(
                        value,
                        prev.maxPrice
                      ),
                    }))
                  }
                />

                <span className="text-sm text-black/50">
                  To
                </span>

                <PriceInput
                  value={localFilters.maxPrice}
                  onChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      maxPrice: Math.max(
                        value,
                        prev.minPrice
                      ),
                    }))
                  }
                />
              </div>
            </div>
          </FilterSection>

          {/* PIERCING */}
          <FilterSection
            title="Piercing Type"
            open={openSections.piercing}
            onToggle={() =>
              toggleSection("piercing")
            }
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {piercingOptions.map((piercing) => (
                <CheckboxRow
                  key={piercing}
                  label={piercing}
                  checked={localFilters.piercings.includes(
                    piercing
                  )}
                  onChange={() =>
                    togglePiercing(piercing)
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* COLLECTION */}
          <FilterSection
            title="Collection"
            open={openSections.collection}
            onToggle={() =>
              toggleSection("collection")
            }
          >
            <div className="space-y-4">
              {collectionOptions.map((collection) => (
                <CheckboxRow
                  key={collection}
                  label={collection}
                  checked={localFilters.collections.includes(
                    collection
                  )}
                  onChange={() =>
                    toggleCollection(collection)
                  }
                />
              ))}
            </div>
          </FilterSection>

          {/* OFFERS */}
          <FilterSection
            title="Special Offers"
            open={openSections.offers}
            onToggle={() => toggleSection("offers")}
          >
            <CheckboxRow
              label="Special Prices"
              checked={localFilters.saleOnly}
              onChange={() =>
                setLocalFilters((prev) => ({
                  ...prev,
                  saleOnly: !prev.saleOnly,
                }))
              }
            />
          </FilterSection>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="grid grid-cols-2 border-t border-black/10 bg-white">
          <button
            type="button"
            onClick={resetFilters}
            className="
              min-h-[64px]
              border-r border-black/10

              text-[10px]
              font-medium
              uppercase
              tracking-[0.16em]

              transition-colors
              duration-300

              hover:bg-[#eeeeee]
            "
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="
              min-h-[64px]
              bg-black

              text-[10px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-white

              transition-colors
              duration-300

              hover:bg-red-600
            "
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
}

type FilterSectionProps = {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-black/10 px-6 py-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between"
      >
        <span className="text-[17px] font-medium">
          {title}
        </span>

        {open ? (
          <ChevronUp size={18} strokeWidth={1.5} />
        ) : (
          <ChevronDown
            size={18}
            strokeWidth={1.5}
          />
        )}
      </button>

      <div
        className={`
          grid transition-all duration-300
          ${
            open
              ? "grid-rows-[1fr] pt-6 opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

type CheckboxRowProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

function CheckboxRow({
  label,
  checked,
  onChange,
}: CheckboxRowProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      <span
        className={`
          flex h-5 w-5
          shrink-0
          items-center
          justify-center
          border
          transition-all
          duration-200

          ${
            checked
              ? "border-black bg-black"
              : "border-black/25 bg-transparent"
          }
        `}
      >
        {checked && (
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

      <span className="text-sm text-black/75">
        {label}
      </span>
    </label>
  );
}

type PriceInputProps = {
  value: number;
  onChange: (value: number) => void;
};

function PriceInput({
  value,
  onChange,
}: PriceInputProps) {
  return (
    <div className="flex h-14 items-center border border-black/25 bg-white px-4">
      <span className="mr-3 text-sm">₹</span>

      <input
        type="number"
        min="0"
        max="3000"
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="
          min-w-0
          flex-1
          bg-transparent
          text-right
          text-sm
          outline-none
        "
      />
    </div>
  );
}

export default ShopFilterDrawer;