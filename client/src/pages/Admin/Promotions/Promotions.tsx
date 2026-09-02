import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleOff,
  Clock3,
  Eye,
  Percent,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Search,
  SlidersHorizontal,
  Sparkles,
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

  const start = new Date(
    promotion.startAt
  ).getTime();

  const end = new Date(
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
  ).format(
    new Date(value)
  );
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

          if (
            discountType
          ) {
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
              method:
                "PATCH",

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
    <div className="w-full pb-10">
      {/* ERROR */}

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

      {/* MAIN PANEL */}

      <section
        className="
          overflow-visible
          rounded-[20px]
          border border-[#e6def8]
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
              placeholder="Search promotion..."
              className={`
                ${carlitoFont}

                h-11 w-full
                rounded-xl
                border
                border-[#e8e3ee]
                bg-white
                pl-10 pr-4

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
              flex w-full
              gap-2
              overflow-x-auto
              pb-1

              xl:w-auto
              xl:items-center
              xl:overflow-visible
              xl:pb-0
            "
          >
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
                setStatus(
                  value
                );

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

              {/* DROPDOWN */}

              {moreFiltersOpen && (
                <div
                  className={`
                    ${carlitoFont}

                    absolute
                    right-0
                    top-[calc(100%+8px)]
                    z-[80]

                    w-[320px]

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
                      Refine promotion results
                    </p>
                  </div>

                  <div className="space-y-3">
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
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#eeeaf3] pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setDiscountType(
                          ""
                        );

                        setScope(
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

            {/* ADD PROMOTION */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/promotions/new"
                )
              }
              className={`
                ${carlitoFont}

                inline-flex
                h-11
                shrink-0
                cursor-pointer
                items-center
                justify-center
                gap-2

                rounded-xl
                border
                border-[#7057F5]
                bg-[#7057F5]

                px-5

                text-[15px]
                font-bold
                text-white

                shadow-[0_8px_20px_rgba(112,87,245,0.20)]

                transition-all
                duration-200

                hover:-translate-y-[2px]
                hover:border-[#5f47e8]
                hover:bg-[#5f47e8]
                hover:shadow-[0_12px_26px_rgba(112,87,245,0.30)]

                active:translate-y-0
                active:scale-[0.98]
              `}
            >
              <Plus
                size={18}
                strokeWidth={2}
              />

              Add Promotion
            </button>
          </div>
        </div>

        {/* =========================
            STATS
        ========================== */}

        <div className="bg-[#f3efff] px-4 py-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryItem
              icon={
                <Sparkles
                  size={17}
                />
              }
              label="Total Promotions"
              value={String(
                stats.totalPromotions
              )}
              description="All promotional campaigns"
              tone="violet"
              badge="ALL"
            />

            <SummaryItem
              icon={
                <Percent
                  size={17}
                />
              }
              label="Active Promotions"
              value={String(
                stats.activePromotions
              )}
              description="Currently running"
              tone="green"
              badge="LIVE"
            />

            <SummaryItem
              icon={
                <Clock3
                  size={17}
                />
              }
              label="Scheduled"
              value={String(
                stats.scheduledPromotions
              )}
              description="Upcoming campaigns"
              tone="orange"
              badge="SOON"
            />

            <SummaryItem
              icon={
                <CircleOff
                  size={17}
                />
              }
              label="Inactive"
              value={String(
                stats.inactivePromotions
              )}
              description="Disabled campaigns"
              tone="slate"
              badge="OFF"
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
                Loading promotions...
              </p>
            </div>
          </div>
        )}

        {/* =========================
            EMPTY
        ========================== */}

        {!loading &&
          promotions.length ===
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
                <Percent
                  size={24}
                />
              </div>

              <h3 className="mt-4 text-[15px] font-bold text-[#332d3b]">
                {search
                  ? "No promotions found"
                  : "No promotions yet"}
              </h3>

              <p className="mt-1 max-w-[340px] text-[12px] leading-5 text-[#9a92a2]">
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
                  className="
                    mt-4
                    inline-flex
                    h-9
                    cursor-pointer
                    items-center
                    gap-2

                    rounded-xl
                    bg-[#7057f5]
                    px-4

                    text-[13px]
                    font-bold
                    text-white

                    transition-all
                    duration-200

                    hover:-translate-y-[1px]
                    hover:bg-[#5f47e8]
                  "
                >
                  <Plus
                    size={14}
                  />

                  Add Promotion
                </button>
              )}
            </div>
          )}

        {/* =========================
            DESKTOP TABLE
        ========================== */}

        {!loading &&
          promotions.length >
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
                      min-w-[1080px]
                      border-collapse
                    `}
                  >
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

                        <TableHeading>
                          Actions
                        </TableHeading>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#f0edf3] bg-white">
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
                                bg-white

                                transition-colors
                                duration-150

                                hover:bg-[#f8f5ff]
                              "
                            >
                              {/* PROMOTION */}

                              <td className="px-5 py-4">
                                <div className="min-w-[190px]">
                                  <p className="max-w-[230px] truncate text-[15px] font-bold text-[#292430]">
                                    {
                                      promotion.name
                                    }
                                  </p>

                                  <p className="mt-1 text-[13px] text-[#aaa3b2]">
                                    {formatScope(
                                      promotion.scope
                                    )}
                                  </p>
                                </div>
                              </td>

                              {/* TYPE */}

                              <td className="px-5 py-4">
                                <span className="text-[15px] text-[#625b6c]">
                                  {formatPromotionType(
                                    promotion.type
                                  )}
                                </span>
                              </td>

                              {/* DISCOUNT */}

                              <td className="px-5 py-4">
                                <span className="text-[15px] font-bold text-[#292430]">
                                  {formatDiscount(
                                    promotion
                                  )}
                                </span>
                              </td>

                              {/* SCOPE */}

                              <td className="px-5 py-4">
                                <span
                                  className="
                                    inline-flex
                                    rounded-lg
                                    bg-[#f3efff]
                                    px-2.5
                                    py-1.5

                                    text-[13px]
                                    font-bold
                                    text-[#7058df]
                                  "
                                >
                                  {formatScope(
                                    promotion.scope
                                  )}
                                </span>
                              </td>

                              {/* SCHEDULE */}

                              <td className="px-5 py-4">
                                <div className="flex min-w-[175px] items-center gap-2">
                                  <CalendarDays
                                    size={
                                      15
                                    }
                                    className="shrink-0 text-[#9b92a5]"
                                  />

                                  <div className="text-[13px] leading-5 text-[#625b6c]">
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

                              {/* STATUS */}

                              <td className="px-5 py-4">
                                <PromotionStatusBadge
                                  status={
                                    effectiveStatus
                                  }
                                />
                              </td>

                              {/* ACTIONS */}

                              <td className="px-5 py-4">
                                <PromotionActions
                                  promotion={
                                    promotion
                                  }
                                  onView={() =>
                                    navigate(
                                      `/admin/promotions/${promotion.id}/view`
                                    )
                                  }
                                  onEdit={() =>
                                    navigate(
                                      `/admin/promotions/${promotion.id}/edit`
                                    )
                                  }
                                  onStatusChange={(
                                    nextActive
                                  ) => {
                                    const confirmed =
                                      window.confirm(
                                        nextActive
                                          ? `Enable "${promotion.name}"?`
                                          : `Disable "${promotion.name}"?`
                                      );

                                    if (
                                      !confirmed
                                    ) {
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
              </div>
            </div>
          )}

        {/* =========================
            MOBILE / TABLET
        ========================== */}

        {!loading &&
          promotions.length >
            0 && (
            <div
              className={`
                ${carlitoFont}
                divide-y
                divide-[#e6def0]
                lg:hidden
              `}
            >
              {promotions.map(
                (
                  promotion
                ) => {
                  const effectiveStatus =
                    getEffectiveStatus(
                      promotion
                    );

                  return (
                    <div
                      key={
                        promotion.id
                      }
                      className="
                        bg-white/60
                        p-4

                        transition-colors
                        duration-200

                        hover:bg-white
                      "
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-bold text-[#292430]">
                            {
                              promotion.name
                            }
                          </p>

                          <p className="mt-1 text-[13px] text-[#a29aaa]">
                            {formatPromotionType(
                              promotion.type
                            )}
                          </p>
                        </div>

                        <PromotionActions
                          promotion={
                            promotion
                          }
                          onView={() =>
                            navigate(
                              `/admin/promotions/${promotion.id}/view`
                            )
                          }
                          onEdit={() =>
                            navigate(
                              `/admin/promotions/${promotion.id}/edit`
                            )
                          }
                          onStatusChange={(
                            nextActive
                          ) => {
                            const confirmed =
                              window.confirm(
                                nextActive
                                  ? `Enable "${promotion.name}"?`
                                  : `Disable "${promotion.name}"?`
                              );

                            if (
                              !confirmed
                            ) {
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

                        <span className="rounded-lg bg-[#f3efff] px-2 py-1 text-[12px] font-bold text-[#7058df]">
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

                      <div className="mt-4 flex items-center gap-2 border-t border-[#f0edf3] pt-3 text-[13px] text-[#777080]">
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

        {/* =========================
            PAGINATION
        ========================== */}

        {!loading &&
          pagination.total >
            0 && (
            <div
              className={`
                ${carlitoFont}

                flex flex-col
                gap-3
                border-t
                border-[#e6def0]

                px-4 py-4

                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
              `}
            >
              <p className="text-[13px] text-[#9991a2]">
                Showing{" "}

                <span className="font-bold text-[#5e5768]">
                  {startItem}–
                  {endItem}
                </span>{" "}

                of{" "}

                <span className="font-bold text-[#5e5768]">
                  {
                    pagination.total
                  }{" "}
                  promotions
                </span>
              </p>

              <div className="flex flex-wrap items-center gap-1">
                <PaginationButton
                  disabled={
                    !pagination
                      .hasPreviousPage
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
                    !pagination
                      .hasNextPage
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

          pl-4 pr-9

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
   SUMMARY
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
  badge,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  tone?: SummaryTone;
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

    green: {
      icon:
        "bg-[#e9f9f1] text-[#3eaa79]",

      accent:
        "bg-[#49c68e]",

      badge:
        "bg-[#e9f9f1] text-[#39986d]",
    },

    orange: {
      icon:
        "bg-[#fff1e5] text-[#ef8b3e]",

      accent:
        "bg-[#ff9b50]",

      badge:
        "bg-[#fff1e5] text-[#df7d34]",
    },

    slate: {
      icon:
        "bg-[#f0eef4] text-[#777080]",

      accent:
        "bg-[#aaa3b3]",

      badge:
        "bg-[#f0eef4] text-[#777080]",
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
      {/* ACCENT */}

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
  children: ReactNode;
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
   STATUS
========================= */

const PromotionStatusBadge = ({
  status,
}: {
  status:
    EffectiveStatus;
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

      {status}
    </span>
  );
};

/* =========================
   ACTIONS
========================= */

const PromotionActions = ({
  promotion,
  onView,
  onEdit,
  onStatusChange,
}: {
  promotion: Promotion;

  onView:
    () => void;

  onEdit:
    () => void;

  onStatusChange: (
    active: boolean
  ) => void;
}) => {
  return (
    <div className="flex items-center gap-1.5">
      {/* VIEW */}

      <button
        type="button"
        title="View promotion"
        aria-label={`View ${promotion.name}`}
        onClick={
          onView
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
          border-[#e5e0ee]

          bg-white

          text-[#625b6c]

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
        <Eye
          size={16}
          strokeWidth={1.9}
        />
      </button>

      {/* EDIT */}

      <button
        type="button"
        title="Edit promotion"
        aria-label={`Edit ${promotion.name}`}
        onClick={
          onEdit
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
        <Pencil
          size={16}
          strokeWidth={1.9}
        />
      </button>

      {/* ENABLE / DISABLE */}

      {promotion.isActive ? (
        <button
          type="button"
          title="Disable promotion"
          aria-label={`Disable ${promotion.name}`}
          onClick={() =>
            onStatusChange(
              false
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
            border-[#ffd9df]

            bg-[#fff0f2]

            text-[#df5c6d]

            transition-all
            duration-200

            hover:-translate-y-[1px]
            hover:border-[#df5c6d]
            hover:bg-[#df5c6d]
            hover:text-white
            hover:shadow-[0_5px_14px_rgba(223,92,109,0.20)]

            active:translate-y-0
            active:scale-95
          "
        >
          <PowerOff
            size={16}
            strokeWidth={1.9}
          />
        </button>
      ) : (
        <button
          type="button"
          title="Enable promotion"
          aria-label={`Enable ${promotion.name}`}
          onClick={() =>
            onStatusChange(
              true
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
            border-[#ccefd9]

            bg-[#eaf8ef]

            text-[#39975b]

            transition-all
            duration-200

            hover:-translate-y-[1px]
            hover:border-[#39975b]
            hover:bg-[#39975b]
            hover:text-white
            hover:shadow-[0_5px_14px_rgba(57,151,91,0.20)]

            active:translate-y-0
            active:scale-95
          "
        >
          <Power
            size={16}
            strokeWidth={1.9}
          />
        </button>
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
      <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#aaa3b2]">
        {label}
      </p>

      <p className="mt-1 truncate text-[13px] font-bold text-[#554e5e]">
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

export default Promotions;