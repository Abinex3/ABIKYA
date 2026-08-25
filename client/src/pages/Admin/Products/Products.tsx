import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers3,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  CSSProperties,
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
const bodyFont = "font-['Google_Sans']";
const inputFont = "font-['Sora']";

const inputFontStyle: CSSProperties = {
  fontFamily: "'Sora', sans-serif",
};

/* =========================
   TYPES
========================= */

type ProductCategory = {
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

  /* =========================
     FETCH PRODUCTS
  ========================= */

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/admin/products?page=${pagination.page}&limit=${pagination.limit}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data =
          (await response.json()) as
            | ProductsResponse
            | {
                message?: string;
              };

        if (!response.ok) {
          throw new Error(
            "message" in data &&
              data.message
              ? data.message
              : "Unable to load products."
          );
        }

        const result =
          data as ProductsResponse;

        setProducts(
          result.products ?? []
        );

        setPagination(
          result.pagination
        );

        setStats(result.stats);
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
  ]);

  /* =========================
     TEMP CLIENT SEARCH

     Backend search comes next.
  ========================= */

  const visibleProducts =
    useMemo(() => {
      const value = search
        .trim()
        .toLowerCase();

      if (!value) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(value) ||
          product.sku
            .toLowerCase()
            .includes(value)
      );
    }, [products, search]);

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
            Catalog
          </p>

          <h1
            className={`${headingFont} text-[25px] font-semibold tracking-[-0.03em] text-[#211d29]`}
          >
            Products
          </h1>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/products/new"
            )
          }
          className="
            inline-flex h-11
            shrink-0 items-center
            justify-center gap-2
            rounded-xl
            bg-[linear-gradient(135deg,#6e59ff,#8c63f5)]
            px-5
            text-sm font-medium
            text-white
            shadow-[0_10px_26px_rgba(110,89,255,0.22)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:shadow-[0_14px_30px_rgba(110,89,255,0.28)]
            active:translate-y-0
          "
        >
          <Plus
            size={18}
            strokeWidth={2.2}
          />

          <span className="hidden sm:inline">
            Add Product
          </span>

          <span className="sm:hidden">
            Add
          </span>
        </button>
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
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search product or SKU..."
              className={`
                ${inputFont}
                h-11 w-full
                rounded-xl
                border border-[#e8e3ee]
                bg-[#fbfaff]
                pl-10 pr-4
                text-sm text-[#2a2531]
                outline-none
                transition
                placeholder:text-[#aaa4b3]
                focus:border-[#a997ff]
                focus:bg-white
                focus:ring-4
                focus:ring-[#735cff]/[0.07]
              `}
              style={inputFontStyle}
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
            <FilterButton label="Category" />

            <FilterButton label="Status" />

            <button
              type="button"
              className="
                inline-flex h-11
                shrink-0 items-center
                gap-2 rounded-xl
                border border-[#e8e3ee]
                bg-white px-4
                text-sm font-medium
                text-[#655e6f]
                transition
                hover:border-[#d8d0e5]
                hover:bg-[#faf8ff]
                hover:text-[#6e59ff]
              "
            >
              <SlidersHorizontal
                size={16}
              />

              More Filters
            </button>
          </div>
        </div>

        {/* =========================
            STATS
        ========================== */}

        <div className="grid grid-cols-2 gap-3 border-b border-[#eeeaf3] bg-[#faf8ff] p-4 sm:grid-cols-4">
          <SummaryItem
            icon={
              <Package size={16} />
            }
            label="Products"
            value={String(
              stats.totalProducts
            )}
          />

          <SummaryItem
            icon={
              <Layers3 size={16} />
            }
            label="Active"
            value={String(
              stats.activeProducts
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
              <Package size={16} />
            }
            label="Draft"
            value={String(
              stats.draftProducts
            )}
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
                Loading products...
              </p>
            </div>
          </div>
        )}

        {/* =========================
            EMPTY
        ========================== */}

        {!loading &&
          visibleProducts.length ===
            0 && (
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
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl bg-[#eee6ff] px-4 text-[12px] font-semibold text-[#6750d4]"
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
          visibleProducts.length >
            0 && (
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px] border-collapse">
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

                    <th className="w-[64px] px-4 py-3.5" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0edf3]">
                  {visibleProducts.map(
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
                            transition-colors
                            duration-150
                            hover:bg-[#fcfbff]
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

                          {/* Action */}

                          <td className="px-4 py-4">
                            <button
                              type="button"
                              aria-label={`Actions for ${product.name}`}
                              className="
                                flex h-9 w-9
                                items-center
                                justify-center
                                rounded-lg
                                text-[#9a93a3]
                                transition
                                hover:bg-[#f2eeff]
                                hover:text-[#6e59ff]
                              "
                            >
                              <MoreHorizontal
                                size={
                                  19
                                }
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}

        {/* =========================
            MOBILE / TABLET
        ========================== */}

        {!loading &&
          visibleProducts.length >
            0 && (
            <div className="divide-y divide-[#eeeaf3] lg:hidden">
              {visibleProducts.map(
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

                            <button
                              type="button"
                              aria-label={`Actions for ${product.name}`}
                              className="
                                flex h-8 w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-[#9991a2]
                                hover:bg-[#f2eeff]
                                hover:text-[#6e59ff]
                              "
                            >
                              <MoreHorizontal
                                size={
                                  18
                                }
                              />
                            </button>
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
      className="
        inline-flex h-11
        shrink-0 items-center
        gap-2 rounded-xl
        border border-[#e8e3ee]
        bg-white px-4
        text-sm font-medium
        text-[#655e6f]
        transition
        hover:border-[#d8d0e5]
        hover:bg-[#faf8ff]
      "
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

const SummaryItem = ({
  icon,
  label,
  value,
  warning = false,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  warning?: boolean;
}) => {
  return (
    <div
      className={`
        relative overflow-hidden
        rounded-2xl
        border
        p-4
        shadow-[0_8px_22px_rgba(76,60,120,0.06)]
        ${
          warning
            ? "border-[#f6dfc8] bg-[linear-gradient(135deg,#fffaf6,#fff2e8)]"
            : "border-[#e9e2fb] bg-[linear-gradient(135deg,#ffffff,#f5f1ff)]"
        }
      `}
    >
      <div
        className={`
          absolute -right-5 -top-5
          h-16 w-16
          rounded-full
          ${
            warning
              ? "bg-[#ffb66b]/10"
              : "bg-[#8a70ff]/10"
          }
        `}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div
          className={`
            flex h-9 w-9
            items-center
            justify-center
            rounded-xl
            ${
              warning
                ? "bg-[#fff0e2] text-[#e58a43]"
                : "bg-[#eee9ff] text-[#6e59ff]"
            }
          `}
        >
          {icon}
        </div>

        <span
          className={`
            ${headingFont}
            text-lg font-semibold
            ${
              warning
                ? "text-[#d97a36]"
                : "text-[#292430]"
            }
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