import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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

import { useNavigate } from "react-router-dom";

/* =========================
   TYPOGRAPHY

   Headings -> Poppins
   Everything else -> Sans
========================= */

const headingFont = "font-['Poppins']";
const bodyFont = "font-sans";
const inputFont = "font-sans";

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
  const navigate = useNavigate();

  const [
    products,
    setProducts,
  ] =
    useState<
      InventoryProduct[]
    >([]);

  const [
    pagination,
    setPagination,
  ] =
    useState<Pagination>({
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
  ] =
    useState<InventoryStats>({
      totalProducts: 0,
      lowStockProducts: 0,
      outOfStockProducts: 0,
    });

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState("");

  const [
    stockStatus,
    setStockStatus,
  ] =
    useState("");

  const [
    moreFiltersOpen,
    setMoreFiltersOpen,
  ] =
    useState(false);

  /* =========================
     DEBOUNCED SEARCH
  ========================= */

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        setDebouncedSearch(
          search.trim()
        );
      }, 350);

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

          /*
           * Same last-page safety pattern
           * used in Products.
           */
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
      page === pagination.page
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
      : (pagination.page -
          1) *
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
    <div
      className={`w-full pb-10 ${bodyFont}`}
    >
      {/* =========================
          PAGE HEADER
      ========================== */}

      <div
        className="
          mb-6 flex flex-col gap-4
          rounded-[20px]
          border border-[#e6def8]
          bg-[linear-gradient(120deg,#f4efff_0%,#ede4fd_55%,#f7f2ff_100%)]
          p-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8368e0]">
            Stock Management
          </p>

          <h1
            className={`${headingFont} text-[25px] font-semibold tracking-[-0.03em] text-[#211d29]`}
          >
            Inventory
          </h1>
        </div>

        <div
          className="
            rounded-xl
            border border-[#ded4f7]
            bg-white/70
            px-4 py-2.5
            text-[12px]
            font-medium
            text-[#6e6479]
            shadow-sm
          "
        >
          SINGLE product stock
          management
        </div>
      </div>

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
          border border-[#e9e5ef]
          bg-white
          shadow-[0_8px_30px_rgba(53,42,78,0.035)]
        "
      >
        {/* =========================
            TOOLBAR
        ========================== */}

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
              onChange={(
                event
              ) => {
                setSearch(
                  event.target
                    .value
                );

                setPagination(
                  (
                    current
                  ) => ({
                    ...current,
                    page: 1,
                  })
                );
              }}
              placeholder="Search product or SKU..."
              className={`
                ${inputFont}
                h-11 w-full
                rounded-xl
                border border-[#e8e3ee]
                bg-[#fbfaff]
                pl-10 pr-4
                text-sm
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

          <div
            className="
              flex w-full gap-2
              overflow-x-auto pb-1
              xl:w-auto
              xl:overflow-visible
              xl:pb-0
            "
          >
            {/* Stock filter */}

            <div className="relative">
              <select
                value={
                  stockStatus
                }
                onChange={(
                  event
                ) => {
                  setStockStatus(
                    event.target
                      .value
                  );

                  resetFilterPage();
                }}
                className="
                  h-11
                  appearance-none
                  rounded-xl
                  border
                  border-[#e8e3ee]
                  bg-white
                  pl-4 pr-9
                  text-sm
                  font-medium
                  text-[#655e6f]
                  outline-none
                  transition
                  hover:border-[#d8d0e5]
                  hover:bg-[#faf8ff]
                  focus:border-[#b8a2ef]
                "
              >
                <option value="">
                  Stock Status
                </option>

                <option value="IN_STOCK">
                  In Stock
                </option>

                <option value="LOW">
                  Low Stock
                </option>

                <option value="OUT">
                  Out of Stock
                </option>
              </select>

              <ChevronDown
                size={15}
                className="
                  pointer-events-none
                  absolute right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#aaa3b2]
                "
              />
            </div>

            {/* More filters */}

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
                  inline-flex
                  h-11
                  shrink-0
                  items-center
                  gap-2
                  rounded-xl
                  border
                  bg-white
                  px-4
                  text-sm
                  font-medium
                  transition

                  ${
                    hasMoreFilters
                      ? "border-[#b8a2ef] bg-[#faf8ff] text-[#6e59ff]"
                      : "border-[#e8e3ee] text-[#655e6f] hover:border-[#d8d0e5] hover:bg-[#faf8ff] hover:text-[#6e59ff]"
                  }
                `}
              >
                <SlidersHorizontal
                  size={16}
                />

                More Filters

                {hasMoreFilters && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6e59ff]" />
                )}
              </button>

              {moreFiltersOpen && (
                <div
                  className="
                    absolute right-0
                    top-[calc(100%+8px)]
                    z-30
                    w-[260px]
                    rounded-2xl
                    border border-[#e8e3ee]
                    bg-white
                    p-4
                    shadow-[0_18px_45px_rgba(53,42,78,0.14)]
                  "
                >
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold text-[#746c7d]">
                        Product
                        Status
                      </label>

                      <select
                        value={
                          status
                        }
                        onChange={(
                          event
                        ) => {
                          setStatus(
                            event
                              .target
                              .value
                          );

                          resetFilterPage();
                        }}
                        className="
                          h-10
                          w-full
                          rounded-xl
                          border
                          border-[#e8e3ee]
                          bg-white
                          px-3
                          text-[12px]
                          text-[#655e6f]
                          outline-none
                          focus:border-[#b8a2ef]
                        "
                      >
                        <option value="">
                          All
                          Statuses
                        </option>

                        <option value="ACTIVE">
                          Active
                        </option>

                        <option value="DRAFT">
                          Draft
                        </option>

                        <option value="ARCHIVED">
                          Archived
                        </option>
                      </select>
                    </div>

                    {hasMoreFilters && (
                      <button
                        type="button"
                        onClick={() => {
                          setStatus(
                            ""
                          );

                          resetFilterPage();
                        }}
                        className="
                          h-9
                          w-full
                          rounded-xl
                          bg-[#f3efff]
                          text-[12px]
                          font-semibold
                          text-[#6e59ff]
                          transition
                          hover:bg-[#ece6ff]
                        "
                      >
                        Clear More
                        Filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================
            STATS
        ========================== */}

        <div className="grid grid-cols-1 gap-3 border-b border-[#eeeaf3] bg-[#faf8ff] p-4 sm:grid-cols-3">
          <SummaryItem
            icon={
              <Package
                size={16}
              />
            }
            label="Inventory Products"
            value={String(
              stats.totalProducts
            )}
          />

          <SummaryItem
            icon={
              <AlertTriangle
                size={16}
              />
            }
            label="Low Stock"
            value={String(
              stats.lowStockProducts
            )}
            warning
          />

          <SummaryItem
            icon={
              <Package
                size={16}
              />
            }
            label="Out of Stock"
            value={String(
              stats.outOfStockProducts
            )}
            danger
          />
        </div>

        {/* =========================
            LOADING
        ========================== */}

        {loading && (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ded5f8] border-t-[#725aff]" />

              <p className="mt-3 text-[12px] text-[#91899a]">
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
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee9ff] text-[#725aff]">
                <Package
                  size={24}
                />
              </div>

              <h3
                className={`${headingFont} mt-4 text-[14px] font-semibold text-[#332d3b]`}
              >
                No inventory
                products found
              </h3>

              <p className="mt-1 max-w-[340px] text-[11px] leading-5 text-[#9a92a2]">
                Try another
                product name,
                SKU, or stock
                filter.
              </p>
            </div>
          )}

        {/* =========================
            DESKTOP TABLE
        ========================== */}

        {!loading &&
          products.length >
            0 && (
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="bg-[linear-gradient(135deg,#7c5cfa_0%,#6c4cf0_100%)]">
                    <TableHeading>
                      Product
                    </TableHeading>

                    <TableHeading>
                      Type
                    </TableHeading>

                    <TableHeading>
                      Current
                      Stock
                    </TableHeading>

                    <TableHeading>
                      Threshold
                    </TableHeading>

                    <TableHeading>
                      Stock
                      Status
                    </TableHeading>

                    <TableHeading>
                      Product
                      Status
                    </TableHeading>

                    <TableHeading>
                      Last
                      Updated
                    </TableHeading>

                    <TableHeading>
                      Actions
                    </TableHeading>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0edf3]">
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
                          transition-colors
                          duration-150
                          hover:bg-[#fcfbff]
                        "
                      >
                        {/* Product */}

                        <td className="px-5 py-4">
                          <div className="flex min-w-[220px] items-center gap-3">
                            <InventoryThumbnail
                              product={
                                product
                              }
                            />

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate text-sm font-semibold text-[#292430]">
                                {
                                  product.name
                                }
                              </p>

                              <p className="mt-1 text-xs font-medium tracking-[0.02em] text-[#aaa3b2]">
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
                            {formatJewelleryType(
                              product.jewelleryType
                            )}
                          </span>
                        </td>

                        {/* Stock */}

                        <td className="px-5 py-4">
                          <span
                            className={`text-sm font-semibold ${
                              product.stockStatus ===
                              "OUT"
                                ? "text-[#df5c6d]"
                                : product.stockStatus ===
                                    "LOW"
                                  ? "text-[#e18642]"
                                  : "text-[#292430]"
                            }`}
                          >
                            {
                              product.stock
                            }
                          </span>
                        </td>

                        {/* Threshold */}

                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-[#625b6c]">
                            {
                              product.lowStockThreshold
                            }
                          </span>
                        </td>

                        {/* Stock status */}

                        <td className="px-5 py-4">
                          <StockStatusBadge
                            status={
                              product.stockStatus
                            }
                          />
                        </td>

                        {/* Product status */}

                        <td className="px-5 py-4">
                          <ProductStatusBadge
                            status={
                              product.status
                            }
                          />
                        </td>

                        {/* Updated */}

                        <td className="px-5 py-4">
                          <span className="whitespace-nowrap text-xs text-[#8f8798]">
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

                        {/* Action */}

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/inventory/${product.id}`
                              )
                            }
                            className="
                              inline-flex
                              h-9
                              items-center
                              gap-2
                              rounded-xl
                              border
                              border-[#e8e3ee]
                              bg-white
                              px-3
                              text-[12px]
                              font-semibold
                              text-[#655e6f]
                              transition
                              hover:border-[#cdbff0]
                              hover:bg-[#f8f5ff]
                              hover:text-[#6e59ff]
                            "
                          >
                            <History
                              size={
                                14
                              }
                            />

                            Manage
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

        {/* =========================
            MOBILE / TABLET
        ========================== */}

        {!loading &&
          products.length >
            0 && (
            <div className="divide-y divide-[#eeeaf3] lg:hidden">
              {products.map(
                (
                  product
                ) => (
                  <div
                    key={
                      product.id
                    }
                    className="
                      p-4
                      transition-colors
                      hover:bg-[#fcfbff]
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
                      <span className="text-[11px] text-[#9c95a5]">
                        Updated{" "}
                        {new Date(
                          product.updatedAt
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/inventory/${product.id}`
                          )
                        }
                        className="
                          inline-flex
                          h-9
                          items-center
                          gap-2
                          rounded-xl
                          bg-[#f2eeff]
                          px-3
                          text-[12px]
                          font-semibold
                          text-[#6e59ff]
                          transition
                          hover:bg-[#eae4ff]
                        "
                      >
                        <History
                          size={14}
                        />

                        Manage
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
              className="
                flex flex-col gap-3
                border-t border-[#eeeaf3]
                px-4 py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
              "
            >
              <p className="text-xs text-[#9991a2]">
                Showing{" "}
                <span className="font-medium text-[#5e5768]">
                  {
                    startItem
                  }
                  –
                  {
                    endItem
                  }
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
   THUMBNAIL
========================= */

const InventoryThumbnail = ({
  product,
}: {
  product: InventoryProduct;
}) => {
  if (product.image) {
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
   SUMMARY CARD
========================= */

const SummaryItem = ({
  icon,
  label,
  value,
  warning = false,
  danger = false,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  warning?: boolean;
  danger?: boolean;
}) => {
  const cardStyle =
    danger
      ? "border-[#f5d4d9] bg-[linear-gradient(135deg,#fffafa,#fff2f4)]"
      : warning
        ? "border-[#f6dfc8] bg-[linear-gradient(135deg,#fffaf6,#fff2e8)]"
        : "border-[#e9e2fb] bg-[linear-gradient(135deg,#ffffff,#f5f1ff)]";

  const iconStyle =
    danger
      ? "bg-[#fff0f2] text-[#df5c6d]"
      : warning
        ? "bg-[#fff0e2] text-[#e58a43]"
        : "bg-[#eee9ff] text-[#6e59ff]";

  const valueStyle =
    danger
      ? "text-[#d75b6c]"
      : warning
        ? "text-[#d97a36]"
        : "text-[#292430]";

  const bubbleStyle =
    danger
      ? "bg-[#eb6576]/10"
      : warning
        ? "bg-[#ffb66b]/10"
        : "bg-[#8a70ff]/10";

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        p-4
        shadow-[0_8px_22px_rgba(76,60,120,0.06)]
        ${cardStyle}
      `}
    >
      <div
        className={`
          absolute
          -right-5
          -top-5
          h-16
          w-16
          rounded-full
          ${bubbleStyle}
        `}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div
          className={`
            flex h-9 w-9
            items-center
            justify-center
            rounded-xl
            ${iconStyle}
          `}
        >
          {icon}
        </div>

        <span
          className={`
            ${headingFont}
            text-lg
            font-semibold
            ${valueStyle}
          `}
        >
          {value}
        </span>
      </div>

      <p className="relative z-10 mt-4 text-[11px] font-medium uppercase tracking-[0.08em] text-[#958da0]">
        {label}
      </p>
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
        text-[11px]
        font-semibold
        uppercase
        tracking-[0.08em]
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
  status: StockStatus;
}) => {
  const styles =
    status === "IN_STOCK"
      ? "bg-[#eaf8ef] text-[#39975b]"
      : status === "LOW"
        ? "bg-[#fff4e9] text-[#df873f]"
        : "bg-[#fff0f2] text-[#df5c6d]";

  const dot =
    status === "IN_STOCK"
      ? "bg-[#4caf6b]"
      : status === "LOW"
        ? "bg-[#e99a54]"
        : "bg-[#eb6576]";

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
  status: ProductStatus;
}) => {
  const styles =
    status === "ACTIVE"
      ? "bg-[#eaf8ef] text-[#39975b]"
      : status === "DRAFT"
        ? "bg-[#f2eff5] text-[#77707f]"
        : "bg-[#f3efff] text-[#7661cc]";

  const dot =
    status === "ACTIVE"
      ? "bg-[#4caf6b]"
      : status === "DRAFT"
        ? "bg-[#918a99]"
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
      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#aaa3b2]">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-xs font-medium ${
          danger
            ? "text-[#df5c6d]"
            : warning
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
        rounded-lg
        px-2
        text-xs
        font-medium
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

export default Inventory;