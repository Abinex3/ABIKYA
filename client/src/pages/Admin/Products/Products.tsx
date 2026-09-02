import {
  AlertTriangle,
  Archive,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers3,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";

/* =========================
   TYPOGRAPHY
   Headings -> Poppins
   Body -> Google Sans
   Inputs -> Sora
========================= */

const headingFont = "font-['Poppins']";

const carlitoFont = "font-['Carlito']";

const statsFont = "font-['Poppins']";



/* =========================
   TYPES
========================= */

type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Collection = {
  id: string;
  name: string;
  slug: string;
};

type ProductCollection = {
  id: string;
  name: string;
  slug: string;
};

type ProductColor = {
  id: string;
  name: string;
  hexCode: string;
};

type ProductMaterial = {
  id: string;
  name: string;
};

type ProductImage = {
  id: string;
  type: "PRODUCT" | "WORN";
  url: string;
  storagePath: string;
};

type ComboItem = {
  productId: string;
  name: string;
  sku: string;
  stock: number | null;
  quantity: number;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;

  productType: "SINGLE" | "COMBO";

  jewelleryType:
    | "STUD"
    | "RING"
    | "HOOP"
    | "BARBELL"
    | "CURVED_BARBELL"
    | "OTHER";

  price: string;
  salePrice: string | null;

  stock: number | null;

  status:
    | "DRAFT"
    | "ACTIVE"
    | "ARCHIVED";

  antiRust: boolean;

  gauge: string | null;
  diameter: string | null;

  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;

  color: ProductColor | null;
  material: ProductMaterial | null;

  categories: ProductCategory[];
  collections: ProductCollection[];

  images: {
    product: ProductImage | null;
    worn: ProductImage | null;
  };

  comboItems: ComboItem[];

  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type ProductStats = {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  lowStockProducts: number;
};

type ProductsResponse = {
  products: Product[];
  pagination: Pagination;
  stats: ProductStats;
};

/* =========================
   HELPERS
========================= */

const formatJewelleryType = (
  value: Product["jewelleryType"]
) => {
  const labels: Record<
    Product["jewelleryType"],
    string
  > = {
    STUD: "Stud",
    RING: "Ring",
    HOOP: "Hoop",
    BARBELL: "Barbell",
    CURVED_BARBELL:
      "Curved Barbell",
    OTHER: "Other",
  };

  return labels[value];
};

const formatProductType = (
  product: Product
) => {
  if (
    product.productType === "COMBO"
  ) {
    return "Combo";
  }

  return formatJewelleryType(
    product.jewelleryType
  );
};

const formatStatus = (
  status: Product["status"],
  stock: number | null,
  productType: Product["productType"]
) => {
  if (
    productType === "SINGLE" &&
    stock === 0
  ) {
    return "Out of Stock";
  }

  if (status === "ACTIVE") {
    return "Active";
  }

  if (status === "DRAFT") {
    return "Draft";
  }

  return "Archived";
};

const getCategoryText = (
  product: Product
) => {
  if (
    product.categories.length === 0
  ) {
    return "—";
  }

  if (
    product.categories.length === 1
  ) {
    return product.categories[0].name;
  }

  return `${product.categories[0].name} +${
    product.categories.length - 1
  }`;
};

const getCollectionText = (
  product: Product
) => {
  if (
    product.collections.length === 0
  ) {
    return "—";
  }

  if (
    product.collections.length === 1
  ) {
    return product.collections[0].name;
  }

  return `${
    product.collections[0].name
  } +${
    product.collections.length - 1
  }`;
};

/* =========================
   PAGE
========================= */

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [pagination, setPagination] =
    useState<Pagination>({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    });

    const [refreshKey, setRefreshKey] =
  useState(0);

  const [stats, setStats] =
    useState<ProductStats>({
      totalProducts: 0,
      activeProducts: 0,
      draftProducts: 0,
      lowStockProducts: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

    const [openActionId, setOpenActionId] =
  useState<string | null>(null);

    const [debouncedSearch, setDebouncedSearch] =
  useState("");

  const [status, setStatus] = useState("");

  const [categories, setCategories] =
  useState<Category[]>([]);

const [categoryId, setCategoryId] =
  useState("");

  const [collections, setCollections] =
  useState<Collection[]>([]);

const [collectionId, setCollectionId] =
  useState("");

const [productType, setProductType] =
  useState("");

const [jewelleryType, setJewelleryType] =
  useState("");

const [moreFiltersOpen, setMoreFiltersOpen] =
  useState(false);

  /* =========================
   DEBOUNCED SEARCH
========================= */

useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    setDebouncedSearch(search.trim());
  }, 350);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, [search]);

  /* =========================
     FETCH PRODUCTS
  ========================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
  page: String(pagination.page),
  limit: String(pagination.limit),
});

if (debouncedSearch) {
  params.set(
    "search",
    debouncedSearch
  );
}

if (categoryId) {
  params.set(
    "categoryId",
    categoryId
  );
}

if (status) {
  params.set(
    "status",
    status
  );
}

if (collectionId) {
  params.set(
    "collectionId",
    collectionId
  );
}

if (productType) {
  params.set(
    "productType",
    productType
  );
}

if (jewelleryType) {
  params.set(
    "jewelleryType",
    jewelleryType
  );
}

const response = await fetch(
  `http://localhost:5000/api/admin/products?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

if (!response.ok) {
  throw new Error(
    data.message ||
      "Unable to load products."
  );
}

if (
  pagination.page >
  data.pagination.totalPages
) {
  setPagination((current) => ({
    ...current,
    page: data.pagination.totalPages,
  }));

  return;
}

setProducts(
  data.products ?? []
);

setPagination(
  data.pagination
);

setStats(
  data.stats
);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
}, [
  pagination.page,
  pagination.limit,
  debouncedSearch,
  categoryId,
  status,
  collectionId,
  productType,
  jewelleryType,
  refreshKey,
]);

useEffect(() => {
  const loadLookups = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/products/lookups",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load categories."
        );
      }

      setCategories(
  data.categories ?? []
);

setCollections(
  data.collections ?? []
);
    } catch (error) {
      console.error(
        "Failed to load product lookups:",
        error
      );
    }
  };

  void loadLookups();
}, []);

  /* =========================
     PAGINATION
  ========================= */

  const goToPage = (
    page: number
  ) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.page
    ) {
      return;
    }

    setPagination((current) => ({
      ...current,
      page,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const startItem =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) *
          pagination.limit +
        1;

  const endItem = Math.min(
    pagination.page *
      pagination.limit,
    pagination.total
  );

  

  const resetFilterPage = () => {
  setPagination((current) => ({
    ...current,
    page: 1,
  }));
};

const hasMoreFilters =
  Boolean(collectionId) ||
  Boolean(productType) ||
  Boolean(jewelleryType);

  const archiveProduct = async (
  productId: string
) => {
  const csrfToken =
    sessionStorage.getItem(
      "admin_csrf_token"
    );

  if (!csrfToken) {
    setError(
      "Your admin session is missing the security token. Please sign in again."
    );
    return;
  }

  try {
    setError("");

    const response = await fetch(
      `http://localhost:5000/api/admin/products/${productId}/status`,
      {
        method: "PATCH",
        credentials: "include",

        headers: {
          "Content-Type":
            "application/json",

          "x-csrf-token":
            csrfToken,
        },

        body: JSON.stringify({
          status: "ARCHIVED",
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to archive product."
      );
    }

    setOpenActionId(null);

    /*
     * Refresh current list by removing
     * the archived row immediately.
     *
     * If your current Status filter is
     * ARCHIVED, don't remove it.
     */
    if (status !== "ARCHIVED") {
      setOpenActionId(null);

setRefreshKey(
  (current) => current + 1
);
    }
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unable to archive product."
    );
  }
};

const restoreProduct = async (
  productId: string
) => {
  const csrfToken =
    sessionStorage.getItem(
      "admin_csrf_token"
    );

  if (!csrfToken) {
    setError(
      "Your admin session is missing the security token. Please sign in again."
    );
    return;
  }

  try {
    setError("");

    const response = await fetch(
      `http://localhost:5000/api/admin/products/${productId}/status`,
      {
        method: "PATCH",
        credentials: "include",

        headers: {
          "Content-Type":
            "application/json",

          "x-csrf-token":
            csrfToken,
        },

        body: JSON.stringify({
          status: "DRAFT",
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to restore product."
      );
    }

    setOpenActionId(null);

    setRefreshKey(
      (current) => current + 1
    );
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unable to restore product."
    );
  }
};

  return (
    <div className="w-full pb-10">


      
      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-[#f3ccd3] bg-[#fff4f5] px-4 py-3 text-[12px] font-medium text-[#d95c70]">
          {error}
        </div>
      )}

      {/* =========================
          MAIN PANEL
      ========================== */}

      <section
  className="
    overflow-hidden
    rounded-[20px]
    border border-[#e6def8]
    bg-[linear-gradient(120deg,#f4efff_0%,#ede4fd_55%,#f7f2ff_100%)]
    shadow-[0_8px_30px_rgba(53,42,78,0.035)]
  "
>
        {/* Toolbar */}

        <div
          className="
            flex flex-col gap-3
            border-b border-[#eeeaf3]
            p-4
            xl:flex-row
            xl:items-center
            xl:justify-between
          "
        >
          {/* Search */}

          <div className="relative w-full xl:max-w-[360px]">
            <Search
              size={17}
              strokeWidth={2}
              className="
                pointer-events-none
                absolute left-3.5
                top-1/2
                -translate-y-1/2
                text-[#aaa3b4]
              "
            />

            <input
  type="text"
  value={search}
  onChange={(event) => {
    setSearch(event.target.value);

    setPagination((current) => ({
      ...current,
      page: 1,
    }));
  }}
  placeholder="Search product or SKU..."
  className={`
    ${carlitoFont}
    h-11 w-full
    rounded-xl
    border border-[#e8e3ee]
    bg-[#fbfaff]
    pl-10 pr-4
    text-[15px]
    text-[#2a2531]
    outline-none
    transition
    placeholder:text-[#aaa4b3]
    focus:border-[#a997ff]
    focus:bg-white
    focus:ring-4
    focus:ring-[#735cff]/[0.07]
  `}
/>
          </div>

          {/* Filters */}

          {/* Filters + Add Product */}
<div
  className="
    flex w-full gap-2
    overflow-x-auto pb-1
    xl:w-auto
    xl:items-center
    xl:overflow-visible
    xl:pb-0
  "
>
  {/* Category */}
  <div className="relative">
    <select
      value={categoryId}
      onChange={(event) => {
        setCategoryId(event.target.value);

        setPagination((current) => ({
          ...current,
          page: 1,
        }));
      }}
     className={`
  ${carlitoFont}
  h-11 appearance-none
  cursor-pointer
  rounded-xl
  border border-[#e8e3ee]
  bg-white
  pl-4 pr-9
  text-[15px]
  font-normal
  text-[#655e6f]
  outline-none
  transition-all duration-200

  hover:border-[#9d88f7]
  hover:bg-[#faf8ff]
  hover:text-[#7057f5]
  hover:shadow-[0_5px_15px_rgba(112,87,245,0.10)]

  focus:border-[#7057f5]
  focus:ring-4
  focus:ring-[#7057f5]/10
`}
    >
      <option value="">Category</option>

      {categories.map((category) => (
        <option
          key={category.id}
          value={category.id}
        >
          {category.name}
        </option>
      ))}
    </select>

    <ChevronDown
      size={15}
      className="
        pointer-events-none
        absolute right-3 top-1/2
        -translate-y-1/2
        text-[#aaa3b2]
      "
    />
  </div>

  {/* Status */}
  <div className="relative">
    <select
      value={status}
      onChange={(event) => {
        setStatus(event.target.value);

        setPagination((current) => ({
          ...current,
          page: 1,
        }));
      }}
    className={`
  ${carlitoFont}
  h-11 appearance-none
  cursor-pointer
  rounded-xl
  border border-[#e8e3ee]
  bg-white
  pl-4 pr-9
  text-[15px]
  font-normal
  text-[#655e6f]
  outline-none
  transition-all duration-200

  hover:border-[#9d88f7]
  hover:bg-[#faf8ff]
  hover:text-[#7057f5]
  hover:shadow-[0_5px_15px_rgba(112,87,245,0.10)]

  focus:border-[#7057f5]
  focus:ring-4
  focus:ring-[#7057f5]/10
`}
    >
      <option value="">Status</option>
      <option value="ACTIVE">Active</option>
      <option value="DRAFT">Draft</option>
      <option value="ARCHIVED">Archived</option>
    </select>

    <ChevronDown
      size={15}
      className="
        pointer-events-none
        absolute right-3 top-1/2
        -translate-y-1/2
        text-[#aaa3b2]
      "
    />
  </div>

{/* More Filters */}
<div className="relative">
  <button
    type="button"
    onClick={() =>
      setMoreFiltersOpen(
        (current) => !current
      )
    }
    className={`
      ${carlitoFont}
      inline-flex h-11
      shrink-0 items-center
      gap-2 rounded-xl
      border px-4
      text-[15px]
      font-bold
      cursor-pointer
      transition-all duration-200

      ${
        moreFiltersOpen || hasMoreFilters
          ? `
            border-[#9d88f7]
            bg-[#f3efff]
            text-[#7057f5]
            shadow-[0_5px_15px_rgba(112,87,245,0.10)]
          `
          : `
            border-[#e8e3ee]
            bg-white
            text-[#655e6f]
            hover:-translate-y-[1px]
            hover:border-[#9d88f7]
            hover:bg-[#f8f5ff]
            hover:text-[#7057f5]
            hover:shadow-[0_5px_15px_rgba(112,87,245,0.10)]
          `
      }
    `}
  >
    <SlidersHorizontal size={16} />

    <span>More Filters</span>

    {hasMoreFilters && (
      <span className="h-1.5 w-1.5 rounded-full bg-[#7057f5]" />
    )}

    <ChevronDown
      size={15}
      className={`
        transition-transform duration-200
        ${moreFiltersOpen ? "rotate-180" : ""}
      `}
    />
  </button>

  {/* More Filters Dropdown */}
  {moreFiltersOpen && (
    <div
      className={`
        ${carlitoFont}
        absolute right-0 top-[calc(100%+8px)]
        z-50
        w-[320px]
        rounded-[16px]
        border border-[#e5def3]
        bg-white
        p-4
        shadow-[0_16px_40px_rgba(53,42,78,0.16)]
      `}
    >
      <div className="mb-4">
        <p className="text-[15px] font-bold text-[#292430]">
          More Filters
        </p>

        <p className="mt-0.5 text-[12px] text-[#9991a2]">
          Refine the product list
        </p>
      </div>

      <div className="space-y-3">
        {/* Collection */}
        <div>
          <label className="mb-1.5 block text-[12px] font-bold text-[#625b6c]">
            Collection
          </label>

          <div className="relative">
            <select
              value={collectionId}
              onChange={(event) => {
                setCollectionId(
                  event.target.value
                );

                resetFilterPage();
              }}
              className="
                h-11 w-full
                cursor-pointer
                appearance-none
                rounded-xl
                border border-[#e8e3ee]
                bg-white
                pl-3.5 pr-9
                text-[14px]
                text-[#655e6f]
                outline-none
                transition-all duration-200

                hover:border-[#9d88f7]
                hover:bg-[#faf8ff]

                focus:border-[#7057f5]
                focus:ring-4
                focus:ring-[#7057f5]/10
              "
            >
              <option value="">
                All Collections
              </option>

              {collections.map(
                (collection) => (
                  <option
                    key={collection.id}
                    value={collection.id}
                  >
                    {collection.name}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={15}
              className="
                pointer-events-none
                absolute right-3 top-1/2
                -translate-y-1/2
                text-[#aaa3b2]
              "
            />
          </div>
        </div>

        {/* Product Type */}
        <div>
          <label className="mb-1.5 block text-[12px] font-bold text-[#625b6c]">
            Product Type
          </label>

          <div className="relative">
            <select
              value={productType}
              onChange={(event) => {
                setProductType(
                  event.target.value
                );

                resetFilterPage();
              }}
              className="
                h-11 w-full
                cursor-pointer
                appearance-none
                rounded-xl
                border border-[#e8e3ee]
                bg-white
                pl-3.5 pr-9
                text-[14px]
                text-[#655e6f]
                outline-none
                transition-all duration-200

                hover:border-[#9d88f7]
                hover:bg-[#faf8ff]

                focus:border-[#7057f5]
                focus:ring-4
                focus:ring-[#7057f5]/10
              "
            >
              <option value="">
                All Product Types
              </option>

              <option value="SINGLE">
                Single
              </option>

              <option value="COMBO">
                Combo
              </option>
            </select>

            <ChevronDown
              size={15}
              className="
                pointer-events-none
                absolute right-3 top-1/2
                -translate-y-1/2
                text-[#aaa3b2]
              "
            />
          </div>
        </div>

        {/* Jewellery Type */}
        <div>
          <label className="mb-1.5 block text-[12px] font-bold text-[#625b6c]">
            Jewellery Type
          </label>

          <div className="relative">
            <select
              value={jewelleryType}
              onChange={(event) => {
                setJewelleryType(
                  event.target.value
                );

                resetFilterPage();
              }}
              className="
                h-11 w-full
                cursor-pointer
                appearance-none
                rounded-xl
                border border-[#e8e3ee]
                bg-white
                pl-3.5 pr-9
                text-[14px]
                text-[#655e6f]
                outline-none
                transition-all duration-200

                hover:border-[#9d88f7]
                hover:bg-[#faf8ff]

                focus:border-[#7057f5]
                focus:ring-4
                focus:ring-[#7057f5]/10
              "
            >
              <option value="">
                All Jewellery Types
              </option>

              <option value="STUD">
                Stud
              </option>

              <option value="RING">
                Ring
              </option>

              <option value="HOOP">
                Hoop
              </option>

              <option value="BARBELL">
                Barbell
              </option>

              <option value="CURVED_BARBELL">
                Curved Barbell
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>

            <ChevronDown
              size={15}
              className="
                pointer-events-none
                absolute right-3 top-1/2
                -translate-y-1/2
                text-[#aaa3b2]
              "
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-[#eeeaf3] pt-4">
        <button
          type="button"
          onClick={() => {
            setCollectionId("");
            setProductType("");
            setJewelleryType("");
            resetFilterPage();
          }}
          className="
            cursor-pointer
            text-[13px]
            font-bold
            text-[#8c8496]
            transition-colors
            hover:text-[#df5c6d]
          "
        >
          Clear Filters
        </button>

        <button
          type="button"
          onClick={() =>
            setMoreFiltersOpen(false)
          }
          className="
            inline-flex h-9
            cursor-pointer
            items-center justify-center
            rounded-lg
            bg-[#7057f5]
            px-4
            text-[13px]
            font-bold
            text-white
            transition-all duration-200

            hover:-translate-y-[1px]
            hover:bg-[#5f47e8]
            hover:shadow-[0_6px_16px_rgba(112,87,245,0.24)]

            active:translate-y-0
            active:scale-[0.98]
          "
        >
          Done
        </button>
      </div>
    </div>
  )}
</div>

  {/* Add Product */}
  <button
  type="button"
  onClick={() =>
    navigate("/admin/products/new")
  }
  className={`
  ${carlitoFont}
  inline-flex h-11
  shrink-0 items-center
  justify-center gap-2
  cursor-pointer
  rounded-xl
  border border-[#7057F5]
  bg-[#7057F5]
  px-5
  text-[15px]
  font-bold
  text-white
  shadow-[0_8px_20px_rgba(112,87,245,0.20)]
  transition-all duration-200

  hover:-translate-y-[2px]
  hover:bg-[#5f47e8]
  hover:border-[#5f47e8]
  hover:shadow-[0_12px_26px_rgba(112,87,245,0.30)]

  active:translate-y-0
  active:scale-[0.98]
`}
>
  <Plus size={18} strokeWidth={2} />

  Add Product
</button>
</div>
        </div>

{/* =========================
    STATS
========================== */}

<div className="bg-[#f3efff] px-4 py-5">
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    <SummaryItem
      icon={<Package size={17} />}
      label="Total Products"
      value={String(stats.totalProducts)}
      description="Products in catalog"
      tone="violet"
    />

    <SummaryItem
      icon={<Layers3 size={17} />}
      label="Active Products"
      value={String(stats.activeProducts)}
      description="Currently available"
      tone="green"
    />

    <SummaryItem
      icon={<AlertTriangle size={17} />}
      label="Low Stock"
      value={String(stats.lowStockProducts)}
      description="Require attention"
      tone="orange"
    />

    <SummaryItem
      icon={<Package size={17} />}
      label="Draft Products"
      value={String(stats.draftProducts)}
      description="Not published yet"
      tone="slate"
    />
  </div>
</div>

        {/* =========================
            LOADING
        ========================== */}

        {loading && (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ded5f8] border-t-[#725aff]" />

              <p className="mt-3 text-[12px] text-[#91899a]">
                Loading products...
              </p>
            </div>
          </div>
        )}

        {/* =========================
            EMPTY
        ========================== */}

        {!loading &&
          products.length === 0 && (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee9ff] text-[#725aff]">
                <Package size={24} />
              </div>

              <h3
                className={`${headingFont} mt-4 text-[14px] font-semibold text-[#332d3b]`}
              >
                {search
                  ? "No products found"
                  : "No products yet"}
              </h3>

              <p className="mt-1 max-w-[340px] text-[11px] leading-5 text-[#9a92a2]">
                {search
                  ? "Try another product name or SKU."
                  : "Create your first product to start building the ABIKYA catalog."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/products/new"
                    )
                  }
                  className={`
  ${carlitoFont}
  mt-4 inline-flex h-9
  items-center gap-2
  rounded-xl
  bg-[#eee6ff]
  px-4
  text-[12px]
  font-bold
  text-[#6750d4]
`}
                >
                  <Plus size={14} />
                  Add Product
                </button>
              )}
            </div>
          )}

        {/* =========================
            DESKTOP TABLE
        ========================== */}

        {!loading &&
          products.length > 0 && (
<div className="hidden px-4 pb-4 lg:block">
  <div
    className="
      overflow-hidden
      rounded-[18px]
      border border-[#e5def3]
      bg-white
      shadow-[0_8px_24px_rgba(64,48,105,0.06)]
    "
  >
    <div className="overflow-x-auto">
      <table
        className={`
          ${carlitoFont}
          w-full
          min-w-[1050px]
          border-collapse
        `}
      >
                <thead>
                  <tr className="bg-[linear-gradient(135deg,#7c5cfa_0%,#6c4cf0_100%)]">
                    <TableHeading>
                      Product
                    </TableHeading>

                    <TableHeading>
                      Type
                    </TableHeading>

                    <TableHeading>
                      Category
                    </TableHeading>

                    <TableHeading>
                      Collection
                    </TableHeading>

                    <TableHeading>
                      Price
                    </TableHeading>

                    <TableHeading>
                      Stock
                    </TableHeading>

                    <TableHeading>
                      Status
                    </TableHeading>

                    <th className="w-[230px] px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
  Actions
</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0edf3] bg-white">
                  {products.map(
                    (product) => {
                      const status =
                        formatStatus(
                          product.status,
                          product.stock,
                          product.productType
                        );

                      const price =
                        Number(
                          product.price
                        );

                      const salePrice =
                        product.salePrice
                          ? Number(
                              product.salePrice
                            )
                          : null;

                      return (
                        <tr
                          key={
                            product.id
                          }
                          className="
  group
  bg-white
  transition-colors
  duration-150
  hover:bg-[#f8f5ff]
"
                        >
                          {/* Product */}

                          <td className="px-5 py-4">
                            <div className="flex min-w-[220px] items-center gap-3">
                              <ProductThumbnail
                                product={
                                  product
                                }
                              />

                              <div className="min-w-0">
                                <p className="max-w-[220px] truncate text-[15px] font-bold text-[#292430]">
                                  {
                                    product.name
                                  }
                                </p>

<p className="mt-1 text-[13px] text-[#aaa3b2]">
                                  {
                                    product.sku
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Type */}

                          <td className="px-5 py-4">
                            <span className="text-sm text-[#625b6c]">
                              {formatProductType(
                                product
                              )}
                            </span>
                          </td>

                          {/* Category */}

                          <td className="px-5 py-4">
                            <span className="text-sm text-[#625b6c]">
                              {getCategoryText(
                                product
                              )}
                            </span>
                          </td>

                          {/* Collection */}

                          <td className="px-5 py-4">
                            {product
                              .collections
                              .length >
                            0 ? (
                              <span
                                className="
                                  inline-flex
                                  rounded-lg
                                  bg-[#f3efff]
                                  px-2.5 py-1.5
                                  text-xs
                                  font-medium
                                  text-[#7058df]
                                "
                              >
                                {getCollectionText(
                                  product
                                )}
                              </span>
                            ) : (
                              <span className="text-xs text-[#aaa3b2]">
                                —
                              </span>
                            )}
                          </td>

                          {/* Price */}

                          <td className="px-5 py-4">
                            {salePrice !==
                            null ? (
                              <div>
                                <span className="text-sm font-semibold text-[#292430]">
                                  ₹
                                  {salePrice.toLocaleString(
                                    "en-IN"
                                  )}
                                </span>

                                <span className="ml-2 text-xs text-[#aaa3b2] line-through">
                                  ₹
                                  {price.toLocaleString(
                                    "en-IN"
                                  )}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm font-semibold text-[#292430]">
                                ₹
                                {price.toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            )}
                          </td>

                          {/* Stock */}

                          <td className="px-5 py-4">
                            {product.productType ===
                            "COMBO" ? (
                              <span className="text-xs font-medium text-[#8e8698]">
                                Calculated
                              </span>
                            ) : product.stock ===
                              0 ? (
                              <span className="font-semibold text-[#ef6072]">
                                0
                              </span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm font-semibold ${
                                    product.stock !==
                                      null &&
                                    product.stock <=
                                      5
                                      ? "text-[#e58a43]"
                                      : "text-[#292430]"
                                  }`}
                                >
                                  {
                                    product.stock
                                  }
                                </span>

                                {product.stock !==
                                  null &&
                                  product.stock <=
                                    5 && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#f0a257]" />
                                  )}
                              </div>
                            )}
                          </td>

                          {/* Status */}

                          <td className="px-5 py-4">
                            <StatusBadge
                              status={
                                status
                              }
                            />
                          </td>

                          {/* Actions */}

<td className="px-5 py-4">
 <div className="flex items-center gap-1.5">
  {/* View */}
  <button
    type="button"
    title="View product"
    aria-label={`View ${product.name}`}
    onClick={() =>
      navigate(`/admin/products/${product.id}/view`)
    }
    className="
  flex h-9 w-9
  cursor-pointer
  items-center justify-center
  rounded-lg
  border border-[#e5e0ee]
  bg-white
  text-[#625b6c]
  transition-all duration-200

  hover:-translate-y-[1px]
  hover:border-[#7057f5]
  hover:bg-[#7057f5]
  hover:text-white
  hover:shadow-[0_5px_14px_rgba(112,87,245,0.22)]

  active:translate-y-0
  active:scale-95
"
  >
    <Eye size={16} strokeWidth={1.9} />
  </button>

  {/* Edit */}
  <button
    type="button"
    title="Edit product"
    aria-label={`Edit ${product.name}`}
    onClick={() =>
      navigate(`/admin/products/${product.id}/edit`)
    }
    className="
  flex h-9 w-9
  cursor-pointer
  items-center justify-center
  rounded-lg
  border border-[#ddd4ff]
  bg-[#eee9ff]
  text-[#7057f5]
  transition-all duration-200

  hover:-translate-y-[1px]
  hover:border-[#7057f5]
  hover:bg-[#7057f5]
  hover:text-white
  hover:shadow-[0_5px_14px_rgba(112,87,245,0.22)]

  active:translate-y-0
  active:scale-95
"
  >
    <Pencil size={16} strokeWidth={1.9} />
  </button>

  {/* Archive / Restore */}
  {product.status === "ARCHIVED" ? (
    <button
      type="button"
      title="Restore product"
      aria-label={`Restore ${product.name}`}
      onClick={() => {
        const confirmed = window.confirm(
          `Restore "${product.name}" to Draft?`
        );

        if (!confirmed) return;

        void restoreProduct(product.id);
      }}
      className="
  flex h-9 w-9
  cursor-pointer
  items-center justify-center
  rounded-lg
  border border-[#ccefd9]
  bg-[#eaf8ef]
  text-[#39975b]
  transition-all duration-200

  hover:-translate-y-[1px]
  hover:border-[#39975b]
  hover:bg-[#39975b]
  hover:text-white
  hover:shadow-[0_5px_14px_rgba(57,151,91,0.20)]

  active:translate-y-0
  active:scale-95
"
    >
      <RotateCcw size={16} strokeWidth={1.9} />
    </button>
  ) : (
    <button
      type="button"
      title="Archive product"
      aria-label={`Archive ${product.name}`}
      onClick={() => {
        const confirmed = window.confirm(
          `Archive "${product.name}"?`
        );

        if (!confirmed) return;

        void archiveProduct(product.id);
      }}
      className="
  flex h-9 w-9
  cursor-pointer
  items-center justify-center
  rounded-lg
  border border-[#ffd9df]
  bg-[#fff0f2]
  text-[#df5c6d]
  transition-all duration-200

  hover:-translate-y-[1px]
  hover:border-[#df5c6d]
  hover:bg-[#df5c6d]
  hover:text-white
  hover:shadow-[0_5px_14px_rgba(223,92,109,0.20)]

  active:translate-y-0
  active:scale-95
"
    >
      <Archive size={16} strokeWidth={1.9} />
    </button>
  )}
</div>
</td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
      </table>
    </div>
  </div>
</div>
)}

        {/* =========================
            MOBILE / TABLET
        ========================== */}

        {!loading &&
          products.length > 0 && (
            <div
  className={`
    ${carlitoFont}
    divide-y divide-[#eeeaf3]
    lg:hidden
  `}
>
              {products.map(
                (product) => {
                  const status =
                    formatStatus(
                      product.status,
                      product.stock,
                      product.productType
                    );

                  const price =
                    Number(
                      product.price
                    );

                  const salePrice =
                    product.salePrice
                      ? Number(
                          product.salePrice
                        )
                      : null;

                  return (
                    <div
                      key={product.id}
                      className="
                        p-4
                        transition-colors
                        hover:bg-[#fcfbff]
                      "
                    >
                      <div className="flex items-start gap-3">
                        <ProductThumbnail
                          product={
                            product
                          }
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#292430]">
                                {
                                  product.name
                                }
                              </p>

                              <p className="mt-1 text-xs text-[#a29aaa]">
                                {
                                  product.sku
                                }
                              </p>
                            </div>

                         <div className="flex items-center gap-2">
  {/* View */}
  <button
    type="button"
    onClick={() => {
      navigate(
        `/admin/products/${product.id}/view`
      );
    }}
    className="
      inline-flex h-9 items-center
      justify-center gap-1.5
      rounded-lg
      border border-[#e5e0ee]
      bg-white
      px-3
      text-[11px]
      font-semibold
      text-[#625b6c]
      transition-all duration-200

      hover:border-[#cfc4ee]
      hover:bg-[#f8f5ff]
      hover:text-[#7057f5]
    "
  >
    <Eye
      size={14}
      strokeWidth={1.9}
    />
    View
  </button>

  {/* Edit */}
  <button
    type="button"
    onClick={() => {
      navigate(
        `/admin/products/${product.id}/edit`
      );
    }}
    className="
      inline-flex h-9 items-center
      justify-center gap-1.5
      rounded-lg
      bg-[#eee9ff]
      px-3
      text-[11px]
      font-semibold
      text-[#7057f5]
      transition-all duration-200

      hover:bg-[#7057f5]
      hover:text-white
    "
  >
    <Pencil
      size={14}
      strokeWidth={1.9}
    />
    Edit
  </button>

  {/* Archive / Restore */}
  {product.status === "ARCHIVED" ? (
    <button
      type="button"
      onClick={() => {
        const confirmed =
          window.confirm(
            `Restore "${product.name}" to Draft?`
          );

        if (!confirmed) return;

        void restoreProduct(
          product.id
        );
      }}
      className="
        inline-flex h-9 items-center
        justify-center gap-1.5
        rounded-lg
        bg-[#eaf8ef]
        px-3
        text-[11px]
        font-semibold
        text-[#39975b]
        transition-all duration-200

        hover:bg-[#39975b]
        hover:text-white
      "
    >
      <RotateCcw
        size={14}
        strokeWidth={1.9}
      />
      Restore
    </button>
  ) : (
    <button
      type="button"
      onClick={() => {
        const confirmed =
          window.confirm(
            `Archive "${product.name}"?`
          );

        if (!confirmed) return;

        void archiveProduct(
          product.id
        );
      }}
      className="
        inline-flex h-9 items-center
        justify-center gap-1.5
        rounded-lg
        bg-[#fff0f2]
        px-3
        text-[11px]
        font-semibold
        text-[#df5c6d]
        transition-all duration-200

        hover:bg-[#df5c6d]
        hover:text-white
      "
    >
      <Archive
        size={14}
        strokeWidth={1.9}
      />
      Archive
    </button>
  )}
</div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusBadge
                              status={
                                status
                              }
                            />

                            {product
                              .collections
                              .length >
                              0 && (
                              <span className="rounded-lg bg-[#f3efff] px-2 py-1 text-[11px] font-medium text-[#7058df]">
                                {getCollectionText(
                                  product
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <MobileDetail
                          label="Type"
                          value={formatProductType(
                            product
                          )}
                        />

                        <MobileDetail
                          label="Category"
                          value={getCategoryText(
                            product
                          )}
                        />

                        <MobileDetail
                          label="Stock"
                          value={
                            product.productType ===
                            "COMBO"
                              ? "Auto"
                              : String(
                                  product.stock ??
                                    0
                                )
                          }
                          warning={
                            product.productType ===
                              "SINGLE" &&
                            product.stock !==
                              null &&
                            product.stock <=
                              5
                          }
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#f0edf3] pt-3">
                        <span className="text-xs font-medium text-[#9c95a5]">
                          Selling Price
                        </span>

                        <div>
                          {salePrice !==
                          null ? (
                            <>
                              <span className="text-sm font-semibold text-[#28232f]">
                                ₹
                                {salePrice.toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                              <span className="ml-2 text-xs text-[#aaa3b2] line-through">
                                ₹
                                {price.toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-[#28232f]">
                              ₹
                              {price.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

        {/* =========================
            PAGINATION
        ========================== */}

        {!loading &&
          pagination.total > 0 && (
            <div
  className={`
    ${carlitoFont}
    flex flex-col gap-3
    border-t border-[#eeeaf3]
    px-4 py-4
    sm:flex-row
    sm:items-center
    sm:justify-between
    sm:px-5
  `}
>
              <p className="text-xs text-[#9991a2]">
                Showing{" "}
                <span className="font-medium text-[#5e5768]">
                  {startItem}–
                  {endItem}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[#5e5768]">
                  {
                    pagination.total
                  }{" "}
                  products
                </span>
              </p>

              <div className="flex flex-wrap items-center gap-1">
                <PaginationButton
                  disabled={
                    !pagination.hasPreviousPage
                  }
                  onClick={() =>
                    goToPage(
                      pagination.page -
                        1
                    )
                  }
                >
                  <ChevronLeft
                    size={16}
                  />
                </PaginationButton>

                {Array.from(
                  {
                    length:
                      pagination.totalPages,
                  },
                  (_, index) =>
                    index + 1
                )
                  .slice(
                    Math.max(
                      0,
                      pagination.page -
                        3
                    ),
                    Math.min(
                      pagination.totalPages,
                      pagination.page +
                        2
                    )
                  )
                  .map((page) => (
                    <PaginationButton
                      key={page}
                      active={
                        page ===
                        pagination.page
                      }
                      onClick={() =>
                        goToPage(
                          page
                        )
                      }
                    >
                      {page}
                    </PaginationButton>
                  ))}

                <PaginationButton
                  disabled={
                    !pagination.hasNextPage
                  }
                  onClick={() =>
                    goToPage(
                      pagination.page +
                        1
                    )
                  }
                >
                  <ChevronRight
                    size={16}
                  />
                </PaginationButton>
              </div>
            </div>
          )}
      </section>
    </div>
  );
};

/* =========================
   THUMBNAIL
========================= */

const ProductThumbnail = ({
  product,
}: {
  product: Product;
}) => {
  const image =
    product.images.product;

  if (image) {
    return (
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#eee9f5] bg-[#f8f5ff]">
        <img
          src={image.url}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className="
        flex h-12 w-12
        shrink-0
        items-center
        justify-center
        rounded-xl
        border border-[#eee9f5]
        bg-[linear-gradient(145deg,#f8f5ff,#f0ebff)]
        text-[#8068f7]
      "
    >
      <Package
        size={20}
        strokeWidth={1.8}
      />
    </div>
  );
};

/* =========================
   FILTER BUTTON
========================= */

const FilterButton = ({
  label,
}: {
  label: string;
}) => {
  return (
    <button
      type="button"
      className={`
  ${carlitoFont}
  inline-flex h-11
  shrink-0 items-center
  gap-2 rounded-xl
  border border-[#e8e3ee]
  bg-white px-4
  text-[15px]
  font-bold
  text-[#655e6f]
  transition
  hover:border-[#d8d0e5]
  hover:bg-[#faf8ff]
`}
    >
      {label}

      <ChevronDown
        size={15}
        className="text-[#aaa3b2]"
      />
    </button>
  );
};

/* =========================
   SUMMARY CARD
========================= */

type SummaryTone =
  | "violet"
  | "green"
  | "orange"
  | "slate";

const SummaryItem = ({
  icon,
  label,
  value,
  description,
  tone = "violet",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  tone?: SummaryTone;
}) => {
  const tones: Record<
    SummaryTone,
    {
      icon: string;
      accent: string;
      badge: string;
    }
  > = {
    violet: {
      icon: "bg-[#eee9ff] text-[#7057f5]",
      accent: "bg-[#7057f5]",
      badge: "bg-[#eee9ff] text-[#7057f5]",
    },

    green: {
      icon: "bg-[#e9f9f1] text-[#3eaa79]",
      accent: "bg-[#49c68e]",
      badge: "bg-[#e9f9f1] text-[#39986d]",
    },

    orange: {
      icon: "bg-[#fff1e5] text-[#ef8b3e]",
      accent: "bg-[#ff9b50]",
      badge: "bg-[#fff1e5] text-[#df7d34]",
    },

    slate: {
      icon: "bg-[#f0eef4] text-[#777080]",
      accent: "bg-[#aaa3b3]",
      badge: "bg-[#f0eef4] text-[#777080]",
    },
  };

  const currentTone = tones[tone];

  return (
    <div
  className={`
    ${statsFont}
    group relative
    min-h-[118px]
    overflow-hidden
    rounded-[18px]
    border border-white/80
    bg-white
    p-4
    shadow-[0_8px_24px_rgba(79,61,126,0.08)]
    transition-all duration-200
    hover:-translate-y-0.5
    hover:shadow-[0_12px_30px_rgba(79,61,126,0.12)]
  `}
>
      {/* Right accent */}
      <div
        className={`
          absolute
          -right-[34px]
          top-1/2
          h-[76px]
          w-[76px]
          -translate-y-1/2
          rounded-full
          opacity-90
          ${currentTone.accent}
        `}
      />

      {/* Soft accent glow */}
      <div
        className={`
          absolute
          -right-[15px]
          top-1/2
          h-[86px]
          w-[86px]
          -translate-y-1/2
          rounded-full
          opacity-[0.08]
          blur-xl
          ${currentTone.accent}
        `}
      />

      <div className="relative z-10">
        {/* Top */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={`
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              ${currentTone.icon}
            `}
          >
            {icon}
          </div>

          <span
            className={`
              mr-3 rounded-full
              px-2 py-1
              text-[9px]
              font-semibold
              ${currentTone.badge}
            `}
          >
            {label === "Active Products"
              ? "LIVE"
              : label === "Low Stock"
                ? "CHECK"
                : label === "Draft Products"
                  ? "DRAFT"
                  : "ALL"}
          </span>
        </div>

        {/* Content */}
        <div className="mt-3">
          <p className="text-[10px] font-medium text-[#91899c]">
            {label}
          </p>

          <div className="mt-0.5 flex items-end gap-2">
            <span
  className="
    text-[22px]
    font-semibold
    leading-none
    tracking-[-0.04em]
    text-[#211d29]
  "
>
  {value}
</span>
          </div>

          <p className="mt-1.5 text-[9px] text-[#aaa3b2]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================
   TABLE HEADING
========================= */

const TableHeading = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <th
      className="
        whitespace-nowrap
        px-5 py-3.5
        text-left
        text-[12px]
        font-bold
        uppercase
        tracking-[0.06em]
        text-white
      "
    >
      {children}
    </th>
  );
};

/* =========================
   STATUS BADGE
========================= */

const StatusBadge = ({
  status,
}: {
  status: string;
}) => {
  const styles =
    status === "Active"
      ? "bg-[#eaf8ef] text-[#39975b]"
      : status === "Draft"
        ? "bg-[#f2eff5] text-[#77707f]"
        : status ===
            "Out of Stock"
          ? "bg-[#fff0f2] text-[#df5c6d]"
          : "bg-[#f3efff] text-[#7661cc]";

  const dot =
    status === "Active"
      ? "bg-[#4caf6b]"
      : status === "Draft"
        ? "bg-[#918a99]"
        : status ===
            "Out of Stock"
          ? "bg-[#eb6576]"
          : "bg-[#8068df]";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5 py-1
        text-[11px]
        font-semibold
        ${styles}
      `}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dot}`}
      />

      {status}
    </span>
  );
};

/* =========================
   MOBILE DETAIL
========================= */

const MobileDetail = ({
  label,
  value,
  warning = false,
}: {
  label: string;
  value: string;
  warning?: boolean;
}) => {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#aaa3b2]">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-xs font-medium ${
          warning
            ? "text-[#e18642]"
            : "text-[#554e5e]"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

/* =========================
   PAGINATION
========================= */

const PaginationButton = ({
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        flex h-8 min-w-8
        items-center
        justify-center
        rounded-lg px-2
        text-xs font-medium
        transition
        disabled:cursor-not-allowed
        disabled:opacity-35
        ${
          active
            ? "bg-[#725aff] text-white shadow-[0_5px_14px_rgba(114,90,255,0.22)]"
            : "text-[#756e7e] hover:bg-[#f2eeff] hover:text-[#6e59ff]"
        }
      `}
    >
      {children}
    </button>
  );
};

export default Products;