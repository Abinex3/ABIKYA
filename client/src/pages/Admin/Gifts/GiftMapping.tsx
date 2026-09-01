import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleOff,
  Clock3,
  Gift,
  MoreHorizontal,
  Package,
  Plus,
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

const sansFont =
  "font-sans";

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
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type GiftRuleStats = {
  totalGiftRules: number;
  activeGiftRules: number;
  scheduledGiftRules: number;
  inactiveGiftRules: number;
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
  ] =
    useState<GiftRule[]>(
      []
    );

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
      hasPreviousPage:
        false,
    });

  const [
    stats,
    setStats,
  ] =
    useState<GiftRuleStats>({
      totalGiftRules: 0,
      activeGiftRules: 0,
      scheduledGiftRules: 0,
      inactiveGiftRules: 0,
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
    status,
    setStatus,
  ] =
    useState("");

  const [
    openActionId,
    setOpenActionId,
  ] =
    useState<
      string | null
    >(null);

  const [
    refreshKey,
    setRefreshKey,
  ] =
    useState(0);

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

          if (!response.ok) {
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
              (current) => ({
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
        } catch (error) {
          setError(
            error instanceof
              Error
              ? error.message
              : "Unable to load gift rules."
          );
        } finally {
          setLoading(
            false
          );
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
      (current) => ({
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

  /* =========================
     STATUS UPDATE
  ========================= */

  const updateStatus =
    async (
      giftRule: GiftRule,
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

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to update gift rule status."
          );
        }

        setOpenActionId(
          null
        );

        setRefreshKey(
          (current) =>
            current + 1
        );
      } catch (error) {
        setError(
          error instanceof
            Error
            ? error.message
            : "Unable to update gift rule status."
        );
      }
    };

  /* =========================
     UI
  ========================= */

  return (
    <div
      className={`w-full pb-10 ${sansFont}`}
    >
      {/* =========================
          HEADER
      ========================== */}

      <div
        className="
          mb-6
          flex
          flex-col
          gap-4
          rounded-[20px]
          border
          border-[#e6def8]
          bg-[linear-gradient(120deg,#f4efff_0%,#ede4fd_55%,#f7f2ff_100%)]
          p-5
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8368e0]">
            Order Benefits
          </p>

          <h1 className="text-[25px] font-semibold tracking-[-0.03em] text-[#211d29]">
            Gift Mapping
          </h1>

          <p className="mt-1 text-[11px] text-[#938b9c]">
            Manage free product rules
            based on order quantity
            and value.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/gift-mapping/new"
            )
          }
          className="
            inline-flex
            h-11
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[linear-gradient(135deg,#6e59ff,#8c63f5)]
            px-5
            text-sm
            font-medium
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
            strokeWidth={
              2.2
            }
          />

          <span className="hidden sm:inline">
            Add Gift Rule
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
          PANEL
      ========================== */}

      <section
        className="
          overflow-hidden
          rounded-[20px]
          border
          border-[#e9e5ef]
          bg-white
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
            border-[#eeeaf3]
            p-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <p className="text-[11px] font-semibold text-[#554e5e]">
              Gift Rules
            </p>

            <p className="mt-1 text-[10px] text-[#aaa3b2]">
              Order thresholds and
              their free gift products.
            </p>
          </div>

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
        </div>

        {/* =========================
            STATS
        ========================== */}

        <div className="grid grid-cols-2 gap-3 border-b border-[#eeeaf3] bg-[#faf8ff] p-4 sm:grid-cols-4">
          <SummaryItem
            icon={
              <Gift
                size={16}
              />
            }
            label="Total Rules"
            value={String(
              stats.totalGiftRules
            )}
          />

          <SummaryItem
            icon={
              <Sparkles
                size={16}
              />
            }
            label="Active"
            value={String(
              stats.activeGiftRules
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
              stats.scheduledGiftRules
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
              stats.inactiveGiftRules
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
                Loading gift
                rules...
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
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee9ff] text-[#725aff]">
                <Gift
                  size={24}
                />
              </div>

              <h3 className="mt-4 text-[14px] font-semibold text-[#332d3b]">
                {status
                  ? "No gift rules found"
                  : "No gift rules yet"}
              </h3>

              <p className="mt-1 max-w-[340px] text-[11px] leading-5 text-[#9a92a2]">
                {status
                  ? "No gift rules match the selected status."
                  : "Create your first gift rule to start mapping free products to order conditions."}
              </p>

              {!status && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/gift-mapping/new"
                    )
                  }
                  className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl bg-[#eee6ff] px-4 text-[12px] font-semibold text-[#6750d4]"
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
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1050px] border-collapse">
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

                    <th className="w-[64px] px-4 py-3.5" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0edf3]">
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
                            transition-colors
                            duration-150
                            hover:bg-[#fcfbff]
                          "
                        >
                          {/* GIFT PRODUCT */}

                          <td className="px-5 py-4">
                            <div className="flex min-w-[220px] items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eee9ff] text-[#725aff]">
                                <Package
                                  size={
                                    16
                                  }
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[220px] truncate text-sm font-semibold text-[#292430]">
                                  {
                                    giftRule
                                      .giftProduct
                                      .name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-[#aaa3b2]">
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
                            <span className="text-sm font-semibold text-[#292430]">
                              {
                                giftRule.minimumOrderQuantity
                              }
                            </span>

                            <span className="ml-1 text-xs text-[#9c95a5]">
                              items
                            </span>
                          </td>

                          {/* MIN VALUE */}

                          <td className="px-5 py-4">
                            <span className="text-sm font-medium text-[#625b6c]">
                              {formatOrderValue(
                                giftRule.minimumOrderValue
                              )}
                            </span>
                          </td>

                          {/* GIFT QTY */}

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-lg bg-[#f3efff] px-2.5 py-1.5 text-xs font-semibold text-[#7058df]">
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
                                size={
                                  15
                                }
                                className="shrink-0 text-[#9b92a5]"
                              />

                              <div className="text-xs leading-5 text-[#625b6c]">
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

                          <td className="px-4 py-4">
                            <GiftRuleActions
                              giftRule={
                                giftRule
                              }
                              effectiveStatus={
                                effectiveStatus
                              }
                              open={
                                openActionId ===
                                giftRule.id
                              }
                              onToggle={() =>
                                setOpenActionId(
                                  (
                                    current
                                  ) =>
                                    current ===
                                    giftRule.id
                                      ? null
                                      : giftRule.id
                                )
                              }
                              onView={() => {
                                setOpenActionId(
                                  null
                                );

                                navigate(
                                  `/admin/gift-mapping/${giftRule.id}/view`
                                );
                              }}
                              onEdit={() => {
                                setOpenActionId(
                                  null
                                );

                                navigate(
                                  `/admin/gift-mapping/${giftRule.id}/edit`
                                );
                              }}
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
          )}

        {/* =========================
            MOBILE
        ========================== */}

        {!loading &&
          giftRules.length >
            0 && (
            <div className="divide-y divide-[#eeeaf3] lg:hidden">
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
                      className="p-4 transition-colors hover:bg-[#fcfbff]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eee9ff] text-[#725aff]">
                              <Package
                                size={
                                  16
                                }
                              />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#292430]">
                                {
                                  giftRule
                                    .giftProduct
                                    .name
                                }
                              </p>

                              <p className="mt-1 text-xs text-[#a29aaa]">
                                {
                                  giftRule
                                    .giftProduct
                                    .sku
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        <GiftRuleActions
                          giftRule={
                            giftRule
                          }
                          effectiveStatus={
                            effectiveStatus
                          }
                          open={
                            openActionId ===
                            giftRule.id
                          }
                          onToggle={() =>
                            setOpenActionId(
                              (
                                current
                              ) =>
                                current ===
                                giftRule.id
                                  ? null
                                  : giftRule.id
                            )
                          }
                          onView={() => {
                            setOpenActionId(
                              null
                            );

                            navigate(
                              `/admin/gift-mapping/${giftRule.id}/view`
                            );
                          }}
                          onEdit={() => {
                            setOpenActionId(
                              null
                            );

                            navigate(
                              `/admin/gift-mapping/${giftRule.id}/edit`
                            );
                          }}
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

                        <span className="rounded-lg bg-[#f3efff] px-2 py-1 text-[11px] font-medium text-[#7058df]">
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

                      <div className="mt-4 flex items-center gap-2 border-t border-[#f0edf3] pt-3 text-xs text-[#777080]">
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

                      <div className="mt-3 rounded-xl bg-[#faf8ff] px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-[0.06em] text-[#aaa3b2]">
                          Gift Product Stock
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#554e5e]">
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
                    size={
                      16
                    }
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
                    size={
                      16
                    }
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
        value={
          value
        }
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
        className="
          h-11
          appearance-none
          rounded-xl
          border
          border-[#e8e3ee]
          bg-white
          pl-4
          pr-9
          font-sans
          text-sm
          font-medium
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

const SummaryItem = ({
  icon,
  label,
  value,
}: {
  icon?:
    ReactNode;

  label:
    string;

  value:
    string;
}) => {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-[#e9e2fb]
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

        <span className="text-lg font-semibold text-[#292430]">
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
        font-sans
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

const GiftRuleActions = ({
  giftRule,
  effectiveStatus,
  open,
  onToggle,
  onView,
  onEdit,
  onStatusChange,
}: {
  giftRule:
    GiftRule;

  effectiveStatus:
    EffectiveStatus;

  open:
    boolean;

  onToggle:
    () => void;

  onView:
    () => void;

  onEdit:
    () => void;

  onStatusChange: (
    active: boolean
  ) => void;
}) => {
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Actions for ${giftRule.giftProduct.name}`}
        onClick={
          onToggle
        }
        className="
          flex
          h-9
          w-9
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
            absolute
            right-0
            top-[calc(100%+6px)]
            z-40
            w-[160px]
            overflow-hidden
            rounded-xl
            border
            border-[#e8e3ee]
            bg-white
            py-1.5
            shadow-[0_14px_35px_rgba(53,42,78,0.14)]
          "
        >
          <button
            type="button"
            onClick={
              onView
            }
            className="
              flex
              w-full
              items-center
              px-3
              py-2
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
            onClick={
              onEdit
            }
            className="
              flex
              w-full
              items-center
              px-3
              py-2
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
                !giftRule.isActive
              )
            }
            className={`
              flex
              w-full
              items-center
              px-3
              py-2
              text-left
              text-[12px]
              font-medium
              transition

              ${
                giftRule.isActive
                  ? "text-[#d95c70] hover:bg-[#fff4f5]"
                  : "text-[#4f8d67] hover:bg-[#f2fbf5]"
              }
            `}
          >
            {giftRule.isActive
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
  label:
    string;

  value:
    string;
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
        h-8
        min-w-8
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

export default GiftMapping;