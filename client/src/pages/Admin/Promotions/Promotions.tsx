import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleOff,
  Clock3,
  MoreHorizontal,
  Percent,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  CSSProperties,
  ReactNode,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

/* =========================
   TYPOGRAPHY
========================= */

const headingFont =
  "font-['Poppins']";

const bodyFont =
  "font-['Google_Sans']";

const inputFont =
  "font-['Sora']";

const inputFontStyle: CSSProperties = {
  fontFamily:
    "'Sora', sans-serif",
};

/* =========================
   TYPES
========================= */

type PromotionType =
  | "WELCOME"
  | "FESTIVAL";

type DiscountType =
  | "PERCENTAGE"
  | "FLAT";

type PromotionScope =
  | "ALL_PRODUCTS"
  | "SELECTED_PRODUCTS"
  | "CATEGORIES"
  | "COLLECTIONS";

type Promotion = {
  id: string;
  name: string;

  type: PromotionType;

  discountType: DiscountType;

  discountValue: string;

  scope: PromotionScope;

  startAt: string;
  endAt: string;

  isActive: boolean;

  products: {
    id: string;
    name: string;
    sku: string;
  }[];

  categories: {
    id: string;
    name: string;
    slug: string;
  }[];

  collections: {
    id: string;
    name: string;
    slug: string;
  }[];

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

type PromotionStats = {
  totalPromotions: number;
  activePromotions: number;
  scheduledPromotions: number;
  inactivePromotions: number;
};

type PromotionsResponse = {
  promotions: Promotion[];

  pagination: Pagination;

  stats: PromotionStats;
};

type EffectiveStatus =
  | "Active"
  | "Scheduled"
  | "Expired"
  | "Inactive";

/* =========================
   HELPERS
========================= */

const formatPromotionType = (
  type: PromotionType
) => {
  return type === "WELCOME"
    ? "Welcome"
    : "Festival";
};

const formatScope = (
  scope: PromotionScope
) => {
  const labels: Record<
    PromotionScope,
    string
  > = {
    ALL_PRODUCTS:
      "All Products",

    SELECTED_PRODUCTS:
      "Selected Products",

    CATEGORIES:
      "Categories",

    COLLECTIONS:
      "Collections",
  };

  return labels[scope];
};

const formatDiscount = (
  promotion: Promotion
) => {
  const value = Number(
    promotion.discountValue
  );

  if (
    promotion.discountType ===
    "PERCENTAGE"
  ) {
    return `${value}%`;
  }

  return `₹${value.toLocaleString(
    "en-IN"
  )}`;
};

const getEffectiveStatus = (
  promotion: Promotion
): EffectiveStatus => {
  if (!promotion.isActive) {
    return "Inactive";
  }

  const now = Date.now();

  const start =
    new Date(
      promotion.startAt
    ).getTime();

  const end =
    new Date(
      promotion.endAt
    ).getTime();

  if (now < start) {
    return "Scheduled";
  }

  if (now > end) {
    return "Expired";
  }

  return "Active";
};

const formatDate = (
  value: string
) => {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(value));
};

/* =========================
   PAGE
========================= */

const Promotions = () => {
  const navigate =
    useNavigate();

  const [
    promotions,
    setPromotions,
  ] = useState<Promotion[]>([]);

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
  ] = useState<PromotionStats>({
    totalPromotions: 0,
    activePromotions: 0,
    scheduledPromotions: 0,
    inactivePromotions: 0,
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
    type,
    setType,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    discountType,
    setDiscountType,
  ] = useState("");

  const [
    scope,
    setScope,
  ] = useState("");

  const [
    moreFiltersOpen,
    setMoreFiltersOpen,
  ] = useState(false);

  const [
    openActionId,
    setOpenActionId,
  ] = useState<
    string | null
  >(null);

  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  /* =========================
     SEARCH
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
     FETCH
  ========================= */

  useEffect(() => {
    const loadPromotions =
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

          if (type) {
            params.set(
              "type",
              type
            );
          }

          if (status) {
            params.set(
              "status",
              status
            );
          }

          if (discountType) {
            params.set(
              "discountType",
              discountType
            );
          }

          if (scope) {
            params.set(
              "scope",
              scope
            );
          }

          const response =
            await fetch(
              `http://localhost:5000/api/admin/promotions?${params.toString()}`,
              {
                method: "GET",
                credentials:
                  "include",
              }
            );

          const data:
            PromotionsResponse & {
              message?: string;
            } =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Unable to load promotions."
            );
          }

          if (
            pagination.page >
            data.pagination
              .totalPages
          ) {
            setPagination(
              (current) => ({
                ...current,

                page:
                  data.pagination
                    .totalPages,
              })
            );

            return;
          }

          setPromotions(
            data.promotions ?? []
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
              : "Unable to load promotions."
          );
        } finally {
          setLoading(false);
        }
      };

    void loadPromotions();
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    type,
    status,
    discountType,
    scope,
    refreshKey,
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
    Boolean(discountType) ||
    Boolean(scope);

  /* =========================
     STATUS UPDATE
  ========================= */

  const updateStatus =
    async (
      promotion: Promotion,
      isActive: boolean
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

        const response =
          await fetch(
            `http://localhost:5000/api/admin/promotions/${promotion.id}/status`,
            {
              method: "PATCH",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",

                "x-csrf-token":
                  csrfToken,
              },

              body:
                JSON.stringify({
                  isActive,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to update promotion status."
          );
        }

        setOpenActionId(null);

        setRefreshKey(
          (current) =>
            current + 1
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to update promotion status."
        );
      }
    };

  /* =========================
     UI
  ========================= */

  return (
    <div
      className={`w-full pb-10 ${bodyFont}`}
    >
      {/* HEADER */}

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
            Marketing
          </p>

          <h1
            className={`${headingFont} text-[25px] font-semibold tracking-[-0.03em] text-[#211d29]`}
          >
            Promotions
          </h1>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/promotions/new"
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
            Add Promotion
          </span>

          <span className="sm:hidden">
            Add
          </span>
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-5 rounded-xl border border-[#f3ccd3] bg-[#fff4f5] px-4 py-3 text-[12px] font-medium text-[#d95c70]">
          {error}
        </div>
      )}

      {/* PANEL */}

      <section
        className="
          overflow-hidden
          rounded-[20px]
          border border-[#e9e5ef]
          bg-white
          shadow-[0_8px_30px_rgba(53,42,78,0.035)]
        "
      >
        {/* TOOLBAR */}

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
                  event.target.value
                );

                resetFilterPage();
              }}
              placeholder="Search promotion..."
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
              style={
                inputFontStyle
              }
            />
          </div>

          <div className="flex w-full gap-2 overflow-x-auto pb-1 xl:w-auto xl:overflow-visible xl:pb-0">
            {/* TYPE */}

            <SelectFilter
              value={type}
              onChange={(
                value
              ) => {
                setType(value);
                resetFilterPage();
              }}
              label="Type"
              options={[
                {
                  value:
                    "WELCOME",
                  label:
                    "Welcome",
                },
                {
                  value:
                    "FESTIVAL",
                  label:
                    "Festival",
                },
              ]}
            />

            {/* STATUS */}

            <SelectFilter
              value={status}
              onChange={(
                value
              ) => {
                setStatus(value);
                resetFilterPage();
              }}
              label="Status"
              options={[
                {
                  value:
                    "ACTIVE",
                  label:
                    "Active",
                },
                {
                  value:
                    "SCHEDULED",
                  label:
                    "Scheduled",
                },
                {
                  value:
                    "INACTIVE",
                  label:
                    "Inactive",
                },
                {
                  value:
                    "EXPIRED",
                  label:
                    "Expired",
                },
              ]}
            />

            {/* MORE FILTERS */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setMoreFiltersOpen(
                    (current) =>
                      !current
                  )
                }
                className={`
                  inline-flex h-11
                  shrink-0 items-center
                  gap-2 rounded-xl
                  border bg-white px-4
                  text-sm font-medium
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
                    z-30 w-[280px]
                    rounded-2xl
                    border border-[#e8e3ee]
                    bg-white p-4
                    shadow-[0_18px_45px_rgba(53,42,78,0.14)]
                  "
                >
                  <div className="space-y-4">
                    <PopupSelect
                      label="Discount Type"
                      value={
                        discountType
                      }
                      onChange={(
                        value
                      ) => {
                        setDiscountType(
                          value
                        );

                        resetFilterPage();
                      }}
                      options={[
                        {
                          value:
                            "PERCENTAGE",
                          label:
                            "Percentage",
                        },
                        {
                          value:
                            "FLAT",
                          label:
                            "Flat",
                        },
                      ]}
                    />

                    <PopupSelect
                      label="Applicability"
                      value={scope}
                      onChange={(
                        value
                      ) => {
                        setScope(
                          value
                        );

                        resetFilterPage();
                      }}
                      options={[
                        {
                          value:
                            "ALL_PRODUCTS",
                          label:
                            "All Products",
                        },
                        {
                          value:
                            "SELECTED_PRODUCTS",
                          label:
                            "Selected Products",
                        },
                        {
                          value:
                            "CATEGORIES",
                          label:
                            "Categories",
                        },
                        {
                          value:
                            "COLLECTIONS",
                          label:
                            "Collections",
                        },
                      ]}
                    />

                    {hasMoreFilters && (
                      <button
                        type="button"
                        onClick={() => {
                          setDiscountType(
                            ""
                          );

                          setScope("");

                          resetFilterPage();
                        }}
                        className="
                          h-9 w-full
                          rounded-xl
                          bg-[#f3efff]
                          text-[12px]
                          font-semibold
                          text-[#6e59ff]
                          transition
                          hover:bg-[#ece6ff]
                        "
                      >
                        Clear More Filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-2 gap-3 border-b border-[#eeeaf3] bg-[#faf8ff] p-4 sm:grid-cols-4">
          <SummaryItem
            icon={
              <Sparkles
                size={16}
              />
            }
            label="Promotions"
            value={String(
              stats.totalPromotions
            )}
          />

          <SummaryItem
            icon={
              <Percent
                size={16}
              />
            }
            label="Active"
            value={String(
              stats.activePromotions
            )}
          />

          <SummaryItem
            icon={
              <Clock3
                size={16}
              />
            }
            label="Scheduled"
            value={String(
              stats.scheduledPromotions
            )}
          />

          <SummaryItem
            icon={
              <CircleOff
                size={16}
              />
            }
            label="Inactive"
            value={String(
              stats.inactivePromotions
            )}
          />
        </div>

        {/* LOADING */}

        {loading && (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ded5f8] border-t-[#725aff]" />

              <p className="mt-3 text-[12px] text-[#91899a]">
                Loading promotions...
              </p>
            </div>
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          promotions.length ===
            0 && (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee9ff] text-[#725aff]">
                <Percent
                  size={24}
                />
              </div>

              <h3
                className={`${headingFont} mt-4 text-[14px] font-semibold text-[#332d3b]`}
              >
                {search
                  ? "No promotions found"
                  : "No promotions yet"}
              </h3>

              <p className="mt-1 max-w-[340px] text-[11px] leading-5 text-[#9a92a2]">
                {search
                  ? "Try another promotion name."
                  : "Create your first promotion to start managing offers."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/promotions/new"
                    )
                  }
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl bg-[#eee6ff] px-4 text-[12px] font-semibold text-[#6750d4]"
                >
                  <Plus
                    size={14}
                  />
                  Add Promotion
                </button>
              )}
            </div>
          )}

        {/* DESKTOP TABLE */}

        {!loading &&
          promotions.length >
            0 && (
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px] border-collapse">
                <thead>
                  <tr className="bg-[linear-gradient(135deg,#7c5cfa_0%,#6c4cf0_100%)]">
                    <TableHeading>
                      Promotion
                    </TableHeading>

                    <TableHeading>
                      Type
                    </TableHeading>

                    <TableHeading>
                      Discount
                    </TableHeading>

                    <TableHeading>
                      Scope
                    </TableHeading>

                    <TableHeading>
                      Schedule
                    </TableHeading>

                    <TableHeading>
                      Status
                    </TableHeading>

                    <th className="w-[64px] px-4 py-3.5" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0edf3]">
                  {promotions.map(
                    (
                      promotion
                    ) => {
                      const effectiveStatus =
                        getEffectiveStatus(
                          promotion
                        );

                      return (
                        <tr
                          key={
                            promotion.id
                          }
                          className="
                            group
                            transition-colors
                            duration-150
                            hover:bg-[#fcfbff]
                          "
                        >
                          <td className="px-5 py-4">
                            <div className="min-w-[190px]">
                              <p className="max-w-[230px] truncate text-sm font-semibold text-[#292430]">
                                {
                                  promotion.name
                                }
                              </p>

                              <p className="mt-1 text-xs text-[#aaa3b2]">
                                {formatScope(
                                  promotion.scope
                                )}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm text-[#625b6c]">
                              {formatPromotionType(
                                promotion.type
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm font-semibold text-[#292430]">
                              {formatDiscount(
                                promotion
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-lg bg-[#f3efff] px-2.5 py-1.5 text-xs font-medium text-[#7058df]">
                              {formatScope(
                                promotion.scope
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex min-w-[175px] items-center gap-2">
                              <CalendarDays
                                size={
                                  15
                                }
                                className="shrink-0 text-[#9b92a5]"
                              />

                              <div className="text-xs leading-5 text-[#625b6c]">
                                <p>
                                  {formatDate(
                                    promotion.startAt
                                  )}
                                </p>

                                <p className="text-[#aaa3b2]">
                                  to{" "}
                                  {formatDate(
                                    promotion.endAt
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <PromotionStatusBadge
                              status={
                                effectiveStatus
                              }
                            />
                          </td>

                          <td className="px-4 py-4">
                           <PromotionActions
  promotion={
    promotion
  }
  effectiveStatus={
    effectiveStatus
  }
  open={
    openActionId ===
    promotion.id
  }
  onToggle={() =>
    setOpenActionId(
      (
        current
      ) =>
        current ===
        promotion.id
          ? null
          : promotion.id
    )
  }
  onView={() => {
    setOpenActionId(
      null
    );

    navigate(
      `/admin/promotions/${promotion.id}/view`
    );
  }}
  onEdit={() => {
    setOpenActionId(
      null
    );

    navigate(
      `/admin/promotions/${promotion.id}/edit`
    );
  }}
  onStatusChange={(
    nextActive
  ) => {
    const confirmed =
      window.confirm(
        nextActive
          ? `Enable "${promotion.name}"?`
          : `Disable "${promotion.name}"?`
      );

    if (!confirmed) {
      return;
    }

    void updateStatus(
      promotion,
      nextActive
    );
  }}
/>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}

        {/* MOBILE */}

        {!loading &&
          promotions.length >
            0 && (
            <div className="divide-y divide-[#eeeaf3] lg:hidden">
              {promotions.map(
                (promotion) => {
                  const effectiveStatus =
                    getEffectiveStatus(
                      promotion
                    );

                  return (
                    <div
                      key={
                        promotion.id
                      }
                      className="p-4 transition-colors hover:bg-[#fcfbff]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#292430]">
                            {
                              promotion.name
                            }
                          </p>

                          <p className="mt-1 text-xs text-[#a29aaa]">
                            {formatPromotionType(
                              promotion.type
                            )}
                          </p>
                        </div>

                        <PromotionActions
  promotion={promotion}
  effectiveStatus={
    effectiveStatus
  }
  open={
    openActionId ===
    promotion.id
  }
  onToggle={() =>
    setOpenActionId(
      (current) =>
        current ===
        promotion.id
          ? null
          : promotion.id
    )
  }
  onView={() => {
    setOpenActionId(null);

    navigate(
      `/admin/promotions/${promotion.id}/view`
    );
  }}
  onEdit={() => {
    setOpenActionId(null);

    navigate(
      `/admin/promotions/${promotion.id}/edit`
    );
  }}
  onStatusChange={(
    nextActive
  ) => {
    const confirmed =
      window.confirm(
        nextActive
          ? `Enable "${promotion.name}"?`
          : `Disable "${promotion.name}"?`
      );

    if (!confirmed) {
      return;
    }

    void updateStatus(
      promotion,
      nextActive
    );
  }}
/>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <PromotionStatusBadge
                          status={
                            effectiveStatus
                          }
                        />

                        <span className="rounded-lg bg-[#f3efff] px-2 py-1 text-[11px] font-medium text-[#7058df]">
                          {formatScope(
                            promotion.scope
                          )}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <MobileDetail
                          label="Discount"
                          value={formatDiscount(
                            promotion
                          )}
                        />

                        <MobileDetail
                          label="Type"
                          value={formatPromotionType(
                            promotion.type
                          )}
                        />
                      </div>

                      <div className="mt-4 flex items-center gap-2 border-t border-[#f0edf3] pt-3 text-xs text-[#777080]">
                        <CalendarDays
                          size={14}
                        />

                        {formatDate(
                          promotion.startAt
                        )}
                        {" — "}
                        {formatDate(
                          promotion.endAt
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

        {/* PAGINATION */}

        {!loading &&
          pagination.total >
            0 && (
            <div className="flex flex-col gap-3 border-t border-[#eeeaf3] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
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
                  promotions
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
                  .map(
                    (page) => (
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
                        {page}
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
        className="
          h-11 appearance-none
          rounded-xl
          border border-[#e8e3ee]
          bg-white
          pl-4 pr-9
          text-sm font-medium
          text-[#655e6f]
          outline-none
          transition
          hover:border-[#d8d0e5]
          hover:bg-[#faf8ff]
        "
      >
        <option value="">
          {label}
        </option>

        {options.map(
          (option) => (
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
          absolute right-3
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
      <label className="mb-1.5 block text-[11px] font-semibold text-[#746c7d]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          h-10 w-full
          rounded-xl
          border border-[#e8e3ee]
          bg-white px-3
          text-[12px]
          text-[#655e6f]
          outline-none
          focus:border-[#b8a2ef]
        "
      >
        <option value="">
          All
        </option>

        {options.map(
          (option) => (
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
    </div>
  );
};

/* =========================
   SUMMARY
========================= */

const SummaryItem = ({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-2xl
        border border-[#e9e2fb]
        bg-[linear-gradient(135deg,#ffffff,#f5f1ff)]
        p-4
        shadow-[0_8px_22px_rgba(76,60,120,0.06)]
      "
    >
      <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-[#8a70ff]/10" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eee9ff] text-[#6e59ff]">
          {icon}
        </div>

        <span
          className={`${headingFont} text-lg font-semibold text-[#292430]`}
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
   STATUS
========================= */

const PromotionStatusBadge = ({
  status,
}: {
  status: EffectiveStatus;
}) => {
  const styles =
    status === "Active"
      ? "bg-[#eaf8ef] text-[#39975b]"
      : status ===
          "Scheduled"
        ? "bg-[#eef2ff] text-[#6570c9]"
        : status ===
            "Expired"
          ? "bg-[#fff0f2] text-[#df5c6d]"
          : "bg-[#f2eff5] text-[#77707f]";

  const dot =
    status === "Active"
      ? "bg-[#4caf6b]"
      : status ===
          "Scheduled"
        ? "bg-[#7884dc]"
        : status ===
            "Expired"
          ? "bg-[#eb6576]"
          : "bg-[#918a99]";

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
   ACTIONS
========================= */

const PromotionActions = ({
  promotion,
  effectiveStatus,
  open,
  onToggle,
  onView,
  onEdit,
  onStatusChange,
}: {
  promotion: Promotion;
  effectiveStatus:
    EffectiveStatus;
  open: boolean;
  onToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  onStatusChange: (
    active: boolean
  ) => void;
}) => {
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Actions for ${promotion.name}`}
        onClick={onToggle}
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
          size={19}
        />
      </button>



      {open && (
        <div
          className="
            absolute right-0
            top-[calc(100%+6px)]
            z-40 w-[150px]
            overflow-hidden
            rounded-xl
            border border-[#e8e3ee]
            bg-white py-1.5
            shadow-[0_14px_35px_rgba(53,42,78,0.14)]
          "
        >
          <button
  type="button"
  onClick={onView}
  className="
    flex w-full
    items-center
    px-3 py-2
    text-left
    text-[12px]
    font-medium
    text-[#5f5867]
    transition
    hover:bg-[#f7f4ff]
    hover:text-[#6e59ff]
  "
>
  View
</button>

<button
  type="button"
  onClick={onEdit}
  className="
    flex w-full
    items-center
    px-3 py-2
    text-left
    text-[12px]
    font-medium
    text-[#5f5867]
    transition
    hover:bg-[#f7f4ff]
    hover:text-[#6e59ff]
  "
>
  Edit
</button>

          <button
  type="button"
  onClick={() =>
    onStatusChange(
      !promotion.isActive
    )
  }
  className={`
    flex w-full
    items-center
    px-3 py-2
    text-left
    text-[12px]
    font-medium
    transition
    ${
      promotion.isActive
        ? "text-[#d95c70] hover:bg-[#fff4f5]"
        : "text-[#4f8d67] hover:bg-[#f2fbf5]"
    }
  `}
>
  {promotion.isActive
    ? effectiveStatus ===
      "Expired"
      ? "Disable Expired"
      : "Disable"
    : "Enable"}
</button>
        </div>
      )}
    </div>
  );
};

/* =========================
   MOBILE DETAIL
========================= */

const MobileDetail = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#aaa3b2]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-medium text-[#554e5e]">
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

export default Promotions;