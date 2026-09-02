import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleOff,
  History,
  Package,
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

import {
  useNavigate,
} from "react-router-dom";

/* =========================
   TYPOGRAPHY
========================= */

const carlitoFont =
  "font-['Carlito']";

const statsFont =
  "font-['Poppins']";

/* =========================
   TYPES
========================= */

type ProductStatus =
  | "DRAFT"
  | "ACTIVE"
  | "ARCHIVED";

type JewelleryType =
  | "STUD"
  | "RING"
  | "HOOP"
  | "BARBELL"
  | "CURVED_BARBELL"
  | "OTHER";

type StockStatus =
  | "LOW"
  | "OUT"
  | "IN_STOCK";

type InventoryImage = {
  id: string;
  url: string;
};

type InventoryProduct = {
  id: string;
  name: string;
  sku: string;

  stock: number;

  lowStockThreshold: number;

  status: ProductStatus;

  jewelleryType: JewelleryType;

  stockStatus: StockStatus;

  image: InventoryImage | null;

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

type InventoryStats = {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
};

type InventoryResponse = {
  products: InventoryProduct[];
  pagination: Pagination;
  stats: InventoryStats;
};

/* =========================
   HELPERS
========================= */

const formatJewelleryType = (
  value: JewelleryType
) => {
  const labels: Record<
    JewelleryType,
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

const formatProductStatus = (
  status: ProductStatus
) => {
  if (status === "ACTIVE") {
    return "Active";
  }

  if (status === "DRAFT") {
    return "Draft";
  }

  return "Archived";
};

const formatStockStatus = (
  status: StockStatus
) => {
  if (status === "OUT") {
    return "Out of Stock";
  }

  if (status === "LOW") {
    return "Low Stock";
  }

  return "In Stock";
};

/* =========================
   PAGE
========================= */

const Inventory = () => {
  const navigate =
    useNavigate();

  const [
    products,
    setProducts,
  ] = useState<
    InventoryProduct[]
  >([]);

  const [
    pagination,
    setPagination,
  ] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [
    stats,
    setStats,
  ] = useState<InventoryStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    stockStatus,
    setStockStatus,
  ] = useState("");

  const [
    moreFiltersOpen,
    setMoreFiltersOpen,
  ] = useState(false);

  /* =========================
     DEBOUNCED SEARCH
  ========================= */

  useEffect(() => {
    const timeoutId =
      window.setTimeout(
        () => {
          setDebouncedSearch(
            search.trim()
          );
        },
        350
      );

    return () => {
      window.clearTimeout(
        timeoutId
      );
    };
  }, [search]);

  /* =========================
     FETCH INVENTORY
  ========================= */

  useEffect(() => {
    const loadInventory =
      async () => {
        try {
          setLoading(true);
          setError("");

          const params =
            new URLSearchParams({
              page: String(
                pagination.page
              ),

              limit: String(
                pagination.limit
              ),
            });

          if (
            debouncedSearch
          ) {
            params.set(
              "search",
              debouncedSearch
            );
          }

          if (status) {
            params.set(
              "status",
              status
            );
          }

          if (
            stockStatus
          ) {
            params.set(
              "stockStatus",
              stockStatus
            );
          }

          const response =
            await fetch(
              `http://localhost:5000/api/admin/inventory?${params.toString()}`,
              {
                method: "GET",

                credentials:
                  "include",
              }
            );

          const data =
            (await response.json()) as
              | InventoryResponse
              | {
                  message?: string;
                };

          if (!response.ok) {
            throw new Error(
              "message" in data &&
              data.message
                ? data.message
                : "Unable to load inventory."
            );
          }

          const inventoryData =
            data as InventoryResponse;

          if (
            pagination.page >
            inventoryData
              .pagination
              .totalPages
          ) {
            setPagination(
              (current) => ({
                ...current,

                page:
                  inventoryData
                    .pagination
                    .totalPages,
              })
            );

            return;
          }

          setProducts(
            inventoryData.products ??
              []
          );

          setPagination(
            inventoryData.pagination
          );

          setStats(
            inventoryData.stats
          );
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load inventory."
          );
        } finally {
          setLoading(false);
        }
      };

    void loadInventory();
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    status,
    stockStatus,
  ]);

  /* =========================
     PAGINATION
  ========================= */

  const goToPage = (
    page: number
  ) => {
    if (
      page < 1 ||
      page >
        pagination.totalPages ||
      page ===
        pagination.page
    ) {
      return;
    }

    setPagination(
      (current) => ({
        ...current,
        page,
      })
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetFilterPage =
    () => {
      setPagination(
        (current) => ({
          ...current,
          page: 1,
        })
      );
    };

  const startItem =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) *
          pagination.limit +
        1;

  const endItem =
    Math.min(
      pagination.page *
        pagination.limit,
      pagination.total
    );

  const hasMoreFilters =
    Boolean(status);

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="w-full pb-10">
      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div
          className={`
            ${carlitoFont}
            mb-5
            rounded-xl
            border border-[#f3ccd3]
            bg-[#fff4f5]
            px-4 py-3
            text-[13px]
            font-bold
            text-[#d95c70]
          `}
        >
          {error}
        </div>
      )}

      {/* =========================
          MAIN PANEL
      ========================== */}

      <section
        className="
          overflow-visible
          rounded-[20px]
          border
          border-[#e6def8]

          bg-[linear-gradient(120deg,#f4efff_0%,#ede4fd_55%,#f7f2ff_100%)]

          shadow-[0_8px_30px_rgba(53,42,78,0.035)]
        "
      >
        {/* =========================
            TOOLBAR
        ========================== */}

        <div
          className="
            flex flex-col
            gap-3

            border-b
            border-[#e4dcf2]

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

                absolute
                left-3.5
                top-1/2

                -translate-y-1/2

                text-[#aaa3b4]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(
                event
              ) => {
                setSearch(
                  event.target.value
                );

                resetFilterPage();
              }}
              placeholder="Search product or SKU..."
              className={`
                ${carlitoFont}

                h-11
                w-full

                rounded-xl

                border
                border-[#e8e3ee]

                bg-white

                pl-10
                pr-4

                text-[15px]
                text-[#2a2531]

                outline-none

                transition-all
                duration-200

                placeholder:text-[#aaa4b3]

                hover:border-[#9d88f7]
                hover:bg-[#faf8ff]

                focus:border-[#7057f5]
                focus:bg-white
                focus:ring-4
                focus:ring-[#7057f5]/10
              `}
            />
          </div>

          {/* FILTERS */}

          <div
            className="
              flex
              w-full
              gap-2

              overflow-x-auto
              pb-1

              xl:w-auto
              xl:items-center
              xl:overflow-visible
              xl:pb-0
            "
          >
            {/* STOCK STATUS */}

            <SelectFilter
              value={
                stockStatus
              }
              onChange={(
                value
              ) => {
                setStockStatus(
                  value
                );

                resetFilterPage();
              }}
              label="Stock Status"
              options={[
                {
                  value:
                    "IN_STOCK",

                  label:
                    "In Stock",
                },

                {
                  value:
                    "LOW",

                  label:
                    "Low Stock",
                },

                {
                  value:
                    "OUT",

                  label:
                    "Out of Stock",
                },
              ]}
            />

            {/* MORE FILTERS */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setMoreFiltersOpen(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                className={`
                  ${carlitoFont}

                  inline-flex
                  h-11

                  shrink-0

                  cursor-pointer

                  items-center

                  gap-2

                  rounded-xl

                  border

                  px-4

                  text-[15px]
                  font-bold

                  transition-all
                  duration-200

                  ${
                    moreFiltersOpen ||
                    hasMoreFilters
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
                <SlidersHorizontal
                  size={16}
                />

                More Filters

                {hasMoreFilters && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7057f5]" />
                )}

                <ChevronDown
                  size={15}
                  className={`
                    transition-transform
                    duration-200

                    ${
                      moreFiltersOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {/* MORE FILTER DROPDOWN */}

              {moreFiltersOpen && (
                <div
                  className={`
                    ${carlitoFont}

                    absolute
                    right-0
                    top-[calc(100%+8px)]

                    z-[80]

                    w-[300px]

                    rounded-[16px]

                    border
                    border-[#e5def3]

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
                      Refine inventory products
                    </p>
                  </div>

                  <PopupSelect
                    label="Product Status"
                    value={status}
                    onChange={(
                      value
                    ) => {
                      setStatus(
                        value
                      );

                      resetFilterPage();
                    }}
                    options={[
                      {
                        value:
                          "ACTIVE",

                        label:
                          "Active",
                      },

                      {
                        value:
                          "DRAFT",

                        label:
                          "Draft",
                      },

                      {
                        value:
                          "ARCHIVED",

                        label:
                          "Archived",
                      },
                    ]}
                  />

                  <div className="mt-4 flex items-center justify-between border-t border-[#eeeaf3] pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStatus(
                          ""
                        );

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
                        setMoreFiltersOpen(
                          false
                        )
                      }
                      className="
                        inline-flex
                        h-9

                        cursor-pointer

                        items-center
                        justify-center

                        rounded-lg

                        bg-[#7057f5]

                        px-4

                        text-[13px]
                        font-bold

                        text-white

                        transition-all
                        duration-200

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
          </div>
        </div>

        {/* =========================
            STATS
        ========================== */}

        <div className="bg-[#f3efff] px-4 py-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryItem
              icon={
                <Package
                  size={17}
                />
              }
              label="Inventory Products"
              value={String(
                stats.totalProducts
              )}
              description="Products tracked in stock"
              tone="violet"
              badge="ALL"
            />

            <SummaryItem
              icon={
                <AlertTriangle
                  size={17}
                />
              }
              label="Low Stock"
              value={String(
                stats.lowStockProducts
              )}
              description="Require stock attention"
              tone="orange"
              badge="CHECK"
            />

            <SummaryItem
              icon={
                <CircleOff
                  size={17}
                />
              }
              label="Out of Stock"
              value={String(
                stats.outOfStockProducts
              )}
              description="Currently unavailable"
              tone="red"
              badge="OUT"
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

              <p
                className={`
                  ${carlitoFont}

                  mt-3

                  text-[13px]

                  text-[#91899a]
                `}
              >
                Loading inventory...
              </p>
            </div>
          </div>
        )}

        {/* =========================
            EMPTY
        ========================== */}

        {!loading &&
          products.length ===
            0 && (
            <div
              className={`
                ${carlitoFont}

                flex

                min-h-[320px]

                flex-col

                items-center
                justify-center

                px-5

                text-center
              `}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee9ff] text-[#725aff]">
                <Package
                  size={24}
                />
              </div>

              <h3 className="mt-4 text-[15px] font-bold text-[#332d3b]">
                No inventory products found
              </h3>

              <p className="mt-1 max-w-[340px] text-[12px] leading-5 text-[#9a92a2]">
                Try another product name,
                SKU, or stock filter.
              </p>
            </div>
          )}

        {/* =========================
            DESKTOP TABLE
        ========================== */}

        {!loading &&
          products.length >
            0 && (
            <div className="hidden px-4 pb-4 lg:block">
              <div
                className="
                  overflow-hidden

                  rounded-[18px]

                  border
                  border-[#e5def3]

                  bg-white

                  shadow-[0_8px_24px_rgba(64,48,105,0.06)]
                "
              >
                <div className="overflow-x-auto">
                  <table
                    className={`
                      ${carlitoFont}

                      w-full

                      min-w-[1100px]

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
                          Current Stock
                        </TableHeading>

                        <TableHeading>
                          Threshold
                        </TableHeading>

                        <TableHeading>
                          Stock Status
                        </TableHeading>

                        <TableHeading>
                          Product Status
                        </TableHeading>

                        <TableHeading>
                          Last Updated
                        </TableHeading>

                        <TableHeading>
                          Action
                        </TableHeading>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#f0edf3] bg-white">
                      {products.map(
                        (
                          product
                        ) => (
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
                            {/* PRODUCT */}

                            <td className="px-5 py-4">
                              <div className="flex min-w-[220px] items-center gap-3">
                                <InventoryThumbnail
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

                            {/* TYPE */}

                            <td className="px-5 py-4">
                              <span className="text-[15px] text-[#625b6c]">
                                {formatJewelleryType(
                                  product.jewelleryType
                                )}
                              </span>
                            </td>

                            {/* CURRENT STOCK */}

                            <td className="px-5 py-4">
                              <span
                                className={`
                                  text-[15px]
                                  font-bold

                                  ${
                                    product.stockStatus ===
                                    "OUT"
                                      ? "text-[#df5c6d]"
                                      : product.stockStatus ===
                                          "LOW"
                                        ? "text-[#e18642]"
                                        : "text-[#292430]"
                                  }
                                `}
                              >
                                {
                                  product.stock
                                }
                              </span>
                            </td>

                            {/* THRESHOLD */}

                            <td className="px-5 py-4">
                              <span className="text-[15px] text-[#625b6c]">
                                {
                                  product.lowStockThreshold
                                }
                              </span>
                            </td>

                            {/* STOCK STATUS */}

                            <td className="px-5 py-4">
                              <StockStatusBadge
                                status={
                                  product.stockStatus
                                }
                              />
                            </td>

                            {/* PRODUCT STATUS */}

                            <td className="px-5 py-4">
                              <ProductStatusBadge
                                status={
                                  product.status
                                }
                              />
                            </td>

                            {/* LAST UPDATED */}

                            <td className="px-5 py-4">
                              <span className="whitespace-nowrap text-[13px] text-[#8f8798]">
                                {new Date(
                                  product.updatedAt
                                ).toLocaleString(
                                  "en-IN",
                                  {
                                    dateStyle:
                                      "medium",

                                    timeStyle:
                                      "short",
                                  }
                                )}
                              </span>
                            </td>

                            {/* ACTION */}

                            <td className="px-5 py-4">
                              <button
                                type="button"
                                title="Manage inventory"
                                aria-label={`Manage inventory for ${product.name}`}
                                onClick={() =>
                                  navigate(
                                    `/admin/inventory/${product.id}`
                                  )
                                }
                                className="
                                  flex
                                  h-9
                                  w-9

                                  cursor-pointer

                                  items-center
                                  justify-center

                                  rounded-lg

                                  border
                                  border-[#ddd4ff]

                                  bg-[#eee9ff]

                                  text-[#7057f5]

                                  transition-all
                                  duration-200

                                  hover:-translate-y-[1px]

                                  hover:border-[#7057f5]

                                  hover:bg-[#7057f5]

                                  hover:text-white

                                  hover:shadow-[0_5px_14px_rgba(112,87,245,0.22)]

                                  active:translate-y-0
                                  active:scale-95
                                "
                              >
                                <History
                                  size={16}
                                  strokeWidth={1.9}
                                />
                              </button>
                            </td>
                          </tr>
                        )
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
          products.length >
            0 && (
            <div
              className={`
                ${carlitoFont}

                divide-y
                divide-[#e6def0]

                lg:hidden
              `}
            >
              {products.map(
                (
                  product
                ) => (
                  <div
                    key={
                      product.id
                    }
                    className="
                      bg-white/60

                      p-4

                      transition-colors
                      duration-200

                      hover:bg-white
                    "
                  >
                    <div className="flex items-start gap-3">
                      <InventoryThumbnail
                        product={
                          product
                        }
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-bold text-[#292430]">
                              {
                                product.name
                              }
                            </p>

                            <p className="mt-1 text-[13px] text-[#a29aaa]">
                              {
                                product.sku
                              }
                            </p>
                          </div>

                          <StockStatusBadge
                            status={
                              product.stockStatus
                            }
                          />
                        </div>

                        <div className="mt-3">
                          <ProductStatusBadge
                            status={
                              product.status
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <MobileDetail
                        label="Type"
                        value={formatJewelleryType(
                          product.jewelleryType
                        )}
                      />

                      <MobileDetail
                        label="Stock"
                        value={String(
                          product.stock
                        )}
                        warning={
                          product.stockStatus ===
                          "LOW"
                        }
                        danger={
                          product.stockStatus ===
                          "OUT"
                        }
                      />

                      <MobileDetail
                        label="Threshold"
                        value={String(
                          product.lowStockThreshold
                        )}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#f0edf3] pt-3">
                      <span className="text-[12px] text-[#9c95a5]">
                        Updated{" "}

                        {new Date(
                          product.updatedAt
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </span>

                      <button
                        type="button"
                        title="Manage inventory"
                        aria-label={`Manage inventory for ${product.name}`}
                        onClick={() =>
                          navigate(
                            `/admin/inventory/${product.id}`
                          )
                        }
                        className="
                          flex
                          h-9
                          w-9

                          cursor-pointer

                          items-center
                          justify-center

                          rounded-lg

                          border
                          border-[#ddd4ff]

                          bg-[#eee9ff]

                          text-[#7057f5]

                          transition-all
                          duration-200

                          hover:border-[#7057f5]

                          hover:bg-[#7057f5]

                          hover:text-white

                          active:scale-95
                        "
                      >
                        <History
                          size={16}
                        />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

        {/* =========================
            PAGINATION
        ========================== */}

        {!loading &&
          pagination.total >
            0 && (
            <div
              className={`
                ${carlitoFont}

                flex
                flex-col

                gap-3

                border-t
                border-[#e6def0]

                px-4
                py-4

                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
              `}
            >
              <p className="text-[13px] text-[#9991a2]">
                Showing{" "}

                <span className="font-bold text-[#5e5768]">
                  {
                    startItem
                  }
                  –
                  {
                    endItem
                  }
                </span>{" "}

                of{" "}

                <span className="font-bold text-[#5e5768]">
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
                  (
                    _,
                    index
                  ) =>
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
                  .map(
                    (
                      page
                    ) => (
                      <PaginationButton
                        key={
                          page
                        }
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
                        {
                          page
                        }
                      </PaginationButton>
                    )
                  )}

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
   SELECT FILTER
========================= */

const SelectFilter = ({
  value,
  onChange,
  label,
  options,
}: {
  value: string;

  onChange: (
    value: string
  ) => void;

  label: string;

  options: {
    value: string;
    label: string;
  }[];
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className={`
          ${carlitoFont}

          h-11

          cursor-pointer

          appearance-none

          rounded-xl

          border
          border-[#e8e3ee]

          bg-white

          pl-4
          pr-9

          text-[15px]

          text-[#655e6f]

          outline-none

          transition-all
          duration-200

          hover:border-[#9d88f7]

          hover:bg-[#faf8ff]

          hover:text-[#7057f5]

          hover:shadow-[0_5px_15px_rgba(112,87,245,0.10)]

          focus:border-[#7057f5]

          focus:ring-4

          focus:ring-[#7057f5]/10
        `}
      >
        <option value="">
          {label}
        </option>

        {options.map(
          (
            option
          ) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {
                option.label
              }
            </option>
          )
        )}
      </select>

      <ChevronDown
        size={15}
        className="
          pointer-events-none

          absolute
          right-3
          top-1/2

          -translate-y-1/2

          text-[#aaa3b2]
        "
      />
    </div>
  );
};

/* =========================
   POPUP SELECT
========================= */

const PopupSelect = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;

  value: string;

  onChange: (
    value: string
  ) => void;

  options: {
    value: string;
    label: string;
  }[];
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-bold text-[#625b6c]">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="
            h-11
            w-full

            cursor-pointer

            appearance-none

            rounded-xl

            border
            border-[#e8e3ee]

            bg-white

            pl-3.5
            pr-9

            text-[14px]

            text-[#655e6f]

            outline-none

            transition-all
            duration-200

            hover:border-[#9d88f7]

            hover:bg-[#faf8ff]

            focus:border-[#7057f5]

            focus:ring-4

            focus:ring-[#7057f5]/10
          "
        >
          <option value="">
            All Statuses
          </option>

          {options.map(
            (
              option
            ) => (
              <option
                key={
                  option.value
                }
                value={
                  option.value
                }
              >
                {
                  option.label
                }
              </option>
            )
          )}
        </select>

        <ChevronDown
          size={15}
          className="
            pointer-events-none

            absolute
            right-3
            top-1/2

            -translate-y-1/2

            text-[#aaa3b2]
          "
        />
      </div>
    </div>
  );
};

/* =========================
   THUMBNAIL
========================= */

const InventoryThumbnail = ({
  product,
}: {
  product:
    InventoryProduct;
}) => {
  if (
    product.image
  ) {
    return (
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#eee9f5] bg-[#f8f5ff]">
        <img
          src={
            product.image.url
          }
          alt={
            product.name
          }
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className="
        flex
        h-12
        w-12

        shrink-0

        items-center
        justify-center

        rounded-xl

        border
        border-[#eee9f5]

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
   SUMMARY CARD
========================= */

type SummaryTone =
  | "violet"
  | "orange"
  | "red";

const SummaryItem = ({
  icon,
  label,
  value,
  description,
  tone = "violet",
  badge,
}: {
  icon: ReactNode;

  label: string;

  value: string;

  description: string;

  tone?:
    SummaryTone;

  badge: string;
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
      icon:
        "bg-[#eee9ff] text-[#7057f5]",

      accent:
        "bg-[#7057f5]",

      badge:
        "bg-[#eee9ff] text-[#7057f5]",
    },

    orange: {
      icon:
        "bg-[#fff1e5] text-[#ef8b3e]",

      accent:
        "bg-[#ff9b50]",

      badge:
        "bg-[#fff1e5] text-[#df7d34]",
    },

    red: {
      icon:
        "bg-[#fff0f2] text-[#df5c6d]",

      accent:
        "bg-[#e76779]",

      badge:
        "bg-[#fff0f2] text-[#df5c6d]",
    },
  };

  const currentTone =
    tones[tone];

  return (
    <div
      className={`
        ${statsFont}

        group
        relative

        min-h-[118px]

        overflow-hidden

        rounded-[18px]

        border
        border-white/80

        bg-white

        p-4

        shadow-[0_8px_24px_rgba(79,61,126,0.08)]

        transition-all
        duration-200

        hover:-translate-y-0.5

        hover:shadow-[0_12px_30px_rgba(79,61,126,0.12)]
      `}
    >
      {/* RIGHT ACCENT */}

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

      {/* SOFT GLOW */}

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
        <div className="flex items-start justify-between gap-3">
          <div
            className={`
              flex
              h-9
              w-9

              items-center
              justify-center

              rounded-xl

              ${currentTone.icon}
            `}
          >
            {icon}
          </div>

          <span
            className={`
              mr-3

              rounded-full

              px-2
              py-1

              text-[9px]
              font-semibold

              ${currentTone.badge}
            `}
          >
            {badge}
          </span>
        </div>

        <div className="mt-3">
          <p className="text-[10px] font-medium text-[#91899c]">
            {label}
          </p>

          <span
            className="
              mt-0.5

              block

              text-[22px]

              font-semibold

              leading-none

              tracking-[-0.04em]

              text-[#211d29]
            "
          >
            {value}
          </span>

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
  children:
    ReactNode;
}) => {
  return (
    <th
      className="
        whitespace-nowrap

        px-5
        py-3.5

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
   STOCK STATUS BADGE
========================= */

const StockStatusBadge = ({
  status,
}: {
  status:
    StockStatus;
}) => {
  const styles =
    status ===
    "IN_STOCK"
      ? "bg-[#eaf8ef] text-[#39975b]"
      : status ===
          "LOW"
        ? "bg-[#fff4e9] text-[#df873f]"
        : "bg-[#fff0f2] text-[#df5c6d]";

  const dot =
    status ===
    "IN_STOCK"
      ? "bg-[#4caf6b]"
      : status ===
          "LOW"
        ? "bg-[#e99a54]"
        : "bg-[#eb6576]";

  return (
    <span
      className={`
        inline-flex

        items-center

        rounded-full

        px-2.5
        py-1

        text-[12px]

        font-bold

        ${styles}
      `}
    >
      <span
        className={`
          mr-1.5

          h-1.5
          w-1.5

          rounded-full

          ${dot}
        `}
      />

      {formatStockStatus(
        status
      )}
    </span>
  );
};

/* =========================
   PRODUCT STATUS BADGE
========================= */

const ProductStatusBadge = ({
  status,
}: {
  status:
    ProductStatus;
}) => {
  const styles =
    status ===
    "ACTIVE"
      ? "bg-[#eaf8ef] text-[#39975b]"
      : status ===
          "DRAFT"
        ? "bg-[#f2eff5] text-[#77707f]"
        : "bg-[#f3efff] text-[#7661cc]";

  const dot =
    status ===
    "ACTIVE"
      ? "bg-[#4caf6b]"
      : status ===
          "DRAFT"
        ? "bg-[#918a99]"
        : "bg-[#8068df]";

  return (
    <span
      className={`
        inline-flex

        items-center

        rounded-full

        px-2.5
        py-1

        text-[12px]

        font-bold

        ${styles}
      `}
    >
      <span
        className={`
          mr-1.5

          h-1.5
          w-1.5

          rounded-full

          ${dot}
        `}
      />

      {formatProductStatus(
        status
      )}
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
  danger = false,
}: {
  label: string;

  value: string;

  warning?: boolean;

  danger?: boolean;
}) => {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#aaa3b2]">
        {label}
      </p>

      <p
        className={`
          mt-1

          truncate

          text-[13px]

          font-bold

          ${
            danger
              ? "text-[#df5c6d]"
              : warning
                ? "text-[#e18642]"
                : "text-[#554e5e]"
          }
        `}
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
  children:
    ReactNode;

  active?: boolean;

  disabled?: boolean;

  onClick?:
    () => void;
}) => {
  return (
    <button
      type="button"
      disabled={
        disabled
      }
      onClick={
        onClick
      }
      className={`
        flex

        h-9
        min-w-9

        items-center
        justify-center

        rounded-lg

        border

        px-2

        text-[13px]

        font-bold

        transition-all
        duration-200

        disabled:cursor-not-allowed
        disabled:opacity-35

        ${
          active
            ? `
              border-[#7057f5]

              bg-[#7057f5]

              text-white

              shadow-[0_5px_14px_rgba(112,90,255,0.22)]
            `
            : `
              cursor-pointer

              border-[#e6e1ec]

              bg-white

              text-[#696171]

              hover:border-[#7057f5]

              hover:bg-[#f3efff]

              hover:text-[#7057f5]

              active:scale-95

              disabled:hover:border-[#e6e1ec]

              disabled:hover:bg-white

              disabled:hover:text-[#696171]
            `
        }
      `}
    >
      {children}
    </button>
  );
};

export default Inventory;