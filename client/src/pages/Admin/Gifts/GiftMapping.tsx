import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleOff,
  Clock3,
  Eye,
  Gift,
  Package,
  Pencil,
  Plus,
  Power,
  PowerOff,
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

type ProductStatus =
  | "DRAFT"
  | "ACTIVE"
  | "ARCHIVED";

type ProductType =
  | "SINGLE"
  | "COMBO";

type GiftProduct = {
  id: string;

  name: string;

  sku: string;

  stock: number | null;

  status: ProductStatus;

  productType: ProductType;
};

type GiftRule = {
  id: string;

  minimumOrderQuantity:
    number;

  minimumOrderValue:
    string | null;

  giftQuantity:
    number;

  isActive:
    boolean;

  startAt:
    string;

  endAt:
    string;

  giftProduct:
    GiftProduct;

  createdAt:
    string;

  updatedAt:
    string;
};

type Pagination = {
  page: number;

  limit: number;

  total: number;

  totalPages: number;

  hasNextPage:
    boolean;

  hasPreviousPage:
    boolean;
};

type GiftRuleStats = {
  totalGiftRules:
    number;

  activeGiftRules:
    number;

  scheduledGiftRules:
    number;

  inactiveGiftRules:
    number;
};

type GiftRulesResponse = {
  giftRules:
    GiftRule[];

  pagination:
    Pagination;

  stats:
    GiftRuleStats;
};

type EffectiveStatus =
  | "Active"
  | "Scheduled"
  | "Expired"
  | "Inactive";

/* =========================
   HELPERS
========================= */

const getEffectiveStatus = (
  giftRule: GiftRule
): EffectiveStatus => {
  if (!giftRule.isActive) {
    return "Inactive";
  }

  const now =
    Date.now();

  const start =
    new Date(
      giftRule.startAt
    ).getTime();

  const end =
    new Date(
      giftRule.endAt
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

const formatOrderValue = (
  value: string | null
) => {
  if (value === null) {
    return "No minimum";
  }

  const amount =
    Number(value);

  return `₹${amount.toLocaleString(
    "en-IN",
    {
      maximumFractionDigits:
        2,
    }
  )}`;
};

/* =========================
   PAGE
========================= */

const GiftMapping = () => {
  const navigate =
    useNavigate();

  const [
    giftRules,
    setGiftRules,
  ] = useState<
    GiftRule[]
  >([]);

  const [
    pagination,
    setPagination,
  ] = useState<Pagination>({
    page: 1,

    limit: 20,

    total: 0,

    totalPages: 1,

    hasNextPage:
      false,

    hasPreviousPage:
      false,
  });

  const [
    stats,
    setStats,
  ] = useState<
    GiftRuleStats
  >({
    totalGiftRules: 0,

    activeGiftRules: 0,

    scheduledGiftRules: 0,

    inactiveGiftRules: 0,
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
    status,
    setStatus,
  ] = useState("");

  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  /* =========================
     FETCH
  ========================= */

  useEffect(() => {
    const loadGiftRules =
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

          if (status) {
            params.set(
              "status",
              status
            );
          }

          const response =
            await fetch(
              `http://localhost:5000/api/admin/gift-rules?${params.toString()}`,
              {
                method:
                  "GET",

                credentials:
                  "include",
              }
            );

          const data:
            GiftRulesResponse & {
              message?: string;
            } =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              data.message ||
                "Unable to load gift rules."
            );
          }

          if (
            pagination.page >
            data.pagination
              .totalPages
          ) {
            setPagination(
              (
                current
              ) => ({
                ...current,

                page:
                  data.pagination
                    .totalPages,
              })
            );

            return;
          }

          setGiftRules(
            data.giftRules ??
              []
          );

          setPagination(
            data.pagination
          );

          setStats(
            data.stats
          );
        } catch (
          error
        ) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load gift rules."
          );
        } finally {
          setLoading(false);
        }
      };

    void loadGiftRules();
  }, [
    pagination.page,

    pagination.limit,

    status,

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
      (
        current
      ) => ({
        ...current,

        page,
      })
    );

    window.scrollTo({
      top: 0,

      behavior:
        "smooth",
    });
  };

  const resetFilterPage =
    () => {
      setPagination(
        (
          current
        ) => ({
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

  /* =========================
     STATUS UPDATE
  ========================= */

  const updateStatus =
    async (
      giftRule:
        GiftRule,

      isActive:
        boolean
    ) => {
      const csrfToken =
        sessionStorage.getItem(
          "admin_csrf_token"
        );

      if (
        !csrfToken
      ) {
        setError(
          "Your admin session is missing the security token. Please sign in again."
        );

        return;
      }

      try {
        setError("");

        const response =
          await fetch(
            `http://localhost:5000/api/admin/gift-rules/${giftRule.id}/status`,
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

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
              "Unable to update gift rule status."
          );
        }

        setRefreshKey(
          (
            current
          ) =>
            current +
            1
        );
      } catch (
        error
      ) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to update gift rule status."
        );
      }
    };

  /* =========================
     UI
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

            border
            border-[#f3ccd3]

            bg-[#fff4f5]

            px-4
            py-3

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
            flex
            flex-col

            gap-3

            border-b
            border-[#e4dcf2]

            p-4

            sm:flex-row

            sm:items-center

            sm:justify-end
          "
        >
          <div className="flex items-center gap-2">
            {/* STATUS */}

            <SelectFilter
              value={
                status
              }

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

            {/* ADD */}

            <button
              type="button"

              onClick={() =>
                navigate(
                  "/admin/gift-mapping/new"
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

              <span className="hidden sm:inline">
                Add Gift Rule
              </span>

              <span className="sm:hidden">
                Add
              </span>
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
                <Gift
                  size={17}
                />
              }

              label="Total Gift Rules"

              value={String(
                stats.totalGiftRules
              )}

              description="All configured gift rules"

              tone="violet"

              badge="ALL"
            />

            <SummaryItem
              icon={
                <Sparkles
                  size={17}
                />
              }

              label="Active Rules"

              value={String(
                stats.activeGiftRules
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
                stats.scheduledGiftRules
              )}

              description="Upcoming gift rules"

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
                stats.inactiveGiftRules
              )}

              description="Currently disabled"

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
                Loading gift rules...
              </p>
            </div>
          </div>
        )}

        {/* =========================
            EMPTY
        ========================== */}

        {!loading &&
          giftRules.length ===
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
              <div
                className="
                  flex

                  h-14
                  w-14

                  items-center

                  justify-center

                  rounded-2xl

                  bg-white

                  text-[#725aff]

                  shadow-[0_6px_18px_rgba(112,87,245,0.10)]
                "
              >
                <Gift
                  size={24}
                />
              </div>

              <h3 className="mt-4 text-[15px] font-bold text-[#332d3b]">
                {status
                  ? "No gift rules found"
                  : "No gift rules yet"}
              </h3>

              <p className="mt-1 max-w-[360px] text-[12px] leading-5 text-[#9a92a2]">
                {status
                  ? "No gift rules match the selected status."
                  : "Create your first gift rule to map free products to order conditions."}
              </p>

              {!status && (
                <button
                  type="button"

                  onClick={() =>
                    navigate(
                      "/admin/gift-mapping/new"
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

                  Add Gift Rule
                </button>
              )}
            </div>
          )}

        {/* =========================
            DESKTOP TABLE
        ========================== */}

        {!loading &&
          giftRules.length >
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
                          Gift Product
                        </TableHeading>

                        <TableHeading>
                          Minimum Qty
                        </TableHeading>

                        <TableHeading>
                          Minimum Value
                        </TableHeading>

                        <TableHeading>
                          Gift Qty
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
                      {giftRules.map(
                        (
                          giftRule
                        ) => {
                          const effectiveStatus =
                            getEffectiveStatus(
                              giftRule
                            );

                          return (
                            <tr
                              key={
                                giftRule.id
                              }

                              className="
                                group

                                bg-white

                                transition-colors
                                duration-150

                                hover:bg-[#f8f5ff]
                              "
                            >
                              {/* GIFT PRODUCT */}

                              <td className="px-5 py-4">
                                <div className="flex min-w-[220px] items-center gap-3">
                                  <div
                                    className="
                                      flex
                                      h-10
                                      w-10

                                      shrink-0

                                      items-center
                                      justify-center

                                      rounded-xl

                                      bg-[#eee9ff]

                                      text-[#725aff]
                                    "
                                  >
                                    <Package
                                      size={17}
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="max-w-[230px] truncate text-[15px] font-bold text-[#292430]">
                                      {
                                        giftRule
                                          .giftProduct
                                          .name
                                      }
                                    </p>

                                    <p className="mt-1 text-[13px] text-[#aaa3b2]">
                                      {
                                        giftRule
                                          .giftProduct
                                          .sku
                                      }
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* MIN QTY */}

                              <td className="px-5 py-4">
                                <span className="text-[15px] font-bold text-[#292430]">
                                  {
                                    giftRule.minimumOrderQuantity
                                  }
                                </span>

                                <span className="ml-1 text-[13px] text-[#9c95a5]">
                                  items
                                </span>
                              </td>

                              {/* MIN VALUE */}

                              <td className="px-5 py-4">
                                <span className="text-[15px] text-[#625b6c]">
                                  {formatOrderValue(
                                    giftRule.minimumOrderValue
                                  )}
                                </span>
                              </td>

                              {/* GIFT QTY */}

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
                                  {
                                    giftRule.giftQuantity
                                  }{" "}
                                  free
                                </span>
                              </td>

                              {/* SCHEDULE */}

                              <td className="px-5 py-4">
                                <div className="flex min-w-[175px] items-center gap-2">
                                  <CalendarDays
                                    size={15}

                                    className="shrink-0 text-[#9b92a5]"
                                  />

                                  <div className="text-[13px] leading-5 text-[#625b6c]">
                                    <p>
                                      {formatDate(
                                        giftRule.startAt
                                      )}
                                    </p>

                                    <p className="text-[#aaa3b2]">
                                      to{" "}

                                      {formatDate(
                                        giftRule.endAt
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* STATUS */}

                              <td className="px-5 py-4">
                                <GiftRuleStatusBadge
                                  status={
                                    effectiveStatus
                                  }
                                />
                              </td>

                              {/* ACTIONS */}

                              <td className="px-5 py-4">
                                <GiftRuleActions
                                  giftRule={
                                    giftRule
                                  }

                                  onView={() =>
                                    navigate(
                                      `/admin/gift-mapping/${giftRule.id}/view`
                                    )
                                  }

                                  onEdit={() =>
                                    navigate(
                                      `/admin/gift-mapping/${giftRule.id}/edit`
                                    )
                                  }

                                  onStatusChange={(
                                    nextActive
                                  ) => {
                                    const confirmed =
                                      window.confirm(
                                        nextActive
                                          ? `Enable gift rule for "${giftRule.giftProduct.name}"?`
                                          : `Disable gift rule for "${giftRule.giftProduct.name}"?`
                                      );

                                    if (
                                      !confirmed
                                    ) {
                                      return;
                                    }

                                    void updateStatus(
                                      giftRule,

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
            MOBILE
        ========================== */}

        {!loading &&
          giftRules.length >
            0 && (
            <div
              className={`
                ${carlitoFont}

                divide-y

                divide-[#e6def0]

                lg:hidden
              `}
            >
              {giftRules.map(
                (
                  giftRule
                ) => {
                  const effectiveStatus =
                    getEffectiveStatus(
                      giftRule
                    );

                  return (
                    <div
                      key={
                        giftRule.id
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
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <div
                            className="
                              flex

                              h-10
                              w-10

                              shrink-0

                              items-center

                              justify-center

                              rounded-xl

                              bg-[#eee9ff]

                              text-[#725aff]
                            "
                          >
                            <Package
                              size={17}
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-bold text-[#292430]">
                              {
                                giftRule
                                  .giftProduct
                                  .name
                              }
                            </p>

                            <p className="mt-1 text-[13px] text-[#a29aaa]">
                              {
                                giftRule
                                  .giftProduct
                                  .sku
                              }
                            </p>
                          </div>
                        </div>

                        <GiftRuleActions
                          giftRule={
                            giftRule
                          }

                          onView={() =>
                            navigate(
                              `/admin/gift-mapping/${giftRule.id}/view`
                            )
                          }

                          onEdit={() =>
                            navigate(
                              `/admin/gift-mapping/${giftRule.id}/edit`
                            )
                          }

                          onStatusChange={(
                            nextActive
                          ) => {
                            const confirmed =
                              window.confirm(
                                nextActive
                                  ? `Enable gift rule for "${giftRule.giftProduct.name}"?`
                                  : `Disable gift rule for "${giftRule.giftProduct.name}"?`
                              );

                            if (
                              !confirmed
                            ) {
                              return;
                            }

                            void updateStatus(
                              giftRule,

                              nextActive
                            );
                          }}
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <GiftRuleStatusBadge
                          status={
                            effectiveStatus
                          }
                        />

                        <span className="rounded-lg bg-[#f3efff] px-2 py-1 text-[12px] font-bold text-[#7058df]">
                          {
                            giftRule.giftQuantity
                          }{" "}
                          free
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <MobileDetail
                          label="Minimum Qty"

                          value={`${giftRule.minimumOrderQuantity} items`}
                        />

                        <MobileDetail
                          label="Minimum Value"

                          value={formatOrderValue(
                            giftRule.minimumOrderValue
                          )}
                        />
                      </div>

                      <div className="mt-4 flex items-center gap-2 border-t border-[#f0edf3] pt-3 text-[13px] text-[#777080]">
                        <CalendarDays
                          size={14}
                        />

                        {formatDate(
                          giftRule.startAt
                        )}

                        {" — "}

                        {formatDate(
                          giftRule.endAt
                        )}
                      </div>

                      <div className="mt-3 rounded-xl bg-[#f8f5ff] px-3 py-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#aaa3b2]">
                          Gift Product Stock
                        </p>

                        <p
                          className={`
                            mt-1
                            text-[13px]
                            font-bold

                            ${
                              (giftRule
                                .giftProduct
                                .stock ??
                                0) === 0
                                ? "text-[#df5c6d]"
                                : "text-[#554e5e]"
                            }
                          `}
                        >
                          {
                            giftRule
                              .giftProduct
                              .stock ??
                            0
                          }{" "}
                          units
                        </p>
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
                  gift rules
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
  value:
    string;

  onChange: (
    value: string
  ) => void;

  label:
    string;

  options: {
    value:
      string;

    label:
      string;
  }[];
}) => {
  return (
    <div className="relative shrink-0">
      <select
        value={
          value
        }

        onChange={(
          event
        ) =>
          onChange(
            event.target
              .value
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

  tone =
    "violet",

  badge,
}: {
  icon:
    ReactNode;

  label:
    string;

  value:
    string;

  description:
    string;

  tone?:
    SummaryTone;

  badge:
    string;
}) => {
  const tones: Record<
    SummaryTone,
    {
      icon:
        string;

      accent:
        string;

      badge:
        string;
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
   STATUS BADGE
========================= */

const GiftRuleStatusBadge = ({
  status,
}: {
  status:
    EffectiveStatus;
}) => {
  const styles =
    status ===
    "Active"
      ? "bg-[#eaf8ef] text-[#39975b]"
      : status ===
          "Scheduled"
        ? "bg-[#eef2ff] text-[#6570c9]"
        : status ===
            "Expired"
          ? "bg-[#fff0f2] text-[#df5c6d]"
          : "bg-[#f2eff5] text-[#77707f]";

  const dot =
    status ===
    "Active"
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

const GiftRuleActions = ({
  giftRule,

  onView,

  onEdit,

  onStatusChange,
}: {
  giftRule:
    GiftRule;

  onView:
    () => void;

  onEdit:
    () => void;

  onStatusChange: (
    active:
      boolean
  ) => void;
}) => {
  return (
    <div className="flex items-center gap-1.5">
      {/* VIEW */}

      <button
        type="button"

        title="View gift rule"

        aria-label={`View gift rule for ${giftRule.giftProduct.name}`}

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

        title="Edit gift rule"

        aria-label={`Edit gift rule for ${giftRule.giftProduct.name}`}

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

      {giftRule.isActive ? (
        <button
          type="button"

          title="Disable gift rule"

          aria-label={`Disable gift rule for ${giftRule.giftProduct.name}`}

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

          title="Enable gift rule"

          aria-label={`Enable gift rule for ${giftRule.giftProduct.name}`}

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
  label:
    string;

  value:
    string;
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

  active?:
    boolean;

  disabled?:
    boolean;

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

export default GiftMapping;