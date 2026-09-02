import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleOff,
  Eye,
  Layers3,
  Package,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Search,
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

type Collection = {
  id: string;

  name: string;

  slug: string;

  description:
    string | null;

  isActive: boolean;

  productCount: number;

  promotionCount: number;

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

type CollectionStats = {
  totalCollections: number;

  activeCollections: number;

  inactiveCollections: number;
};

type CollectionsResponse = {
  collections:
    Collection[];

  pagination:
    Pagination;

  stats:
    CollectionStats;
};

/* =========================
   HELPERS
========================= */

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

const Collections = () => {
  const navigate =
    useNavigate();

  const [
    collections,
    setCollections,
  ] = useState<
    Collection[]
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
  ] = useState<
    CollectionStats
  >({
    totalCollections: 0,

    activeCollections: 0,

    inactiveCollections: 0,
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
    const loadCollections =
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

          const response =
            await fetch(
              `http://localhost:5000/api/admin/collections?${params.toString()}`,
              {
                method:
                  "GET",

                credentials:
                  "include",
              }
            );

          const data:
            CollectionsResponse & {
              message?: string;
            } =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              data.message ||
                "Unable to load collections."
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

          setCollections(
            data.collections ??
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
              : "Unable to load collections."
          );
        } finally {
          setLoading(false);
        }
      };

    void loadCollections();
  }, [
    pagination.page,

    pagination.limit,

    debouncedSearch,

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
      collection:
        Collection,

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
            `http://localhost:5000/api/admin/collections/${collection.id}/status`,
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
              "Unable to update collection status."
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
            : "Unable to update collection status."
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

            sm:justify-between
          "
        >
          {/* SEARCH */}

          <div className="relative w-full sm:max-w-[360px]">
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

              value={
                search
              }

              onChange={(
                event
              ) => {
                setSearch(
                  event.target
                    .value
                );

                resetFilterPage();
              }}

              placeholder="Search collection..."

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

          {/* FILTER + ADD */}

          <div className="flex items-center gap-2">
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
                    "INACTIVE",

                  label:
                    "Inactive",
                },
              ]}
            />

            <button
              type="button"

              onClick={() =>
                navigate(
                  "/admin/collections/new"
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
                Add Collection
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SummaryItem
              icon={
                <Layers3
                  size={17}
                />
              }

              label="Total Collections"

              value={String(
                stats.totalCollections
              )}

              description="All merchandising groups"

              tone="violet"

              badge="ALL"
            />

            <SummaryItem
              icon={
                <Sparkles
                  size={17}
                />
              }

              label="Active Collections"

              value={String(
                stats.activeCollections
              )}

              description="Visible and available"

              tone="green"

              badge="LIVE"
            />

            <SummaryItem
              icon={
                <CircleOff
                  size={17}
                />
              }

              label="Inactive Collections"

              value={String(
                stats.inactiveCollections
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
                Loading collections...
              </p>
            </div>
          </div>
        )}

        {/* =========================
            EMPTY
        ========================== */}

        {!loading &&
          collections.length ===
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
                <Layers3
                  size={24}
                />
              </div>

              <h3 className="mt-4 text-[15px] font-bold text-[#332d3b]">
                {search ||
                status
                  ? "No collections found"
                  : "No collections yet"}
              </h3>

              <p className="mt-1 max-w-[340px] text-[12px] leading-5 text-[#9a92a2]">
                {search ||
                status
                  ? "Try changing your search or status filter."
                  : "Create your first collection to group products for merchandising."}
              </p>

              {!search &&
                !status && (
                  <button
                    type="button"

                    onClick={() =>
                      navigate(
                        "/admin/collections/new"
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

                    Add Collection
                  </button>
                )}
            </div>
          )}

        {/* =========================
            DESKTOP TABLE
        ========================== */}

        {!loading &&
          collections.length >
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

                      min-w-[1050px]

                      border-collapse
                    `}
                  >
                    <thead>
                      <tr className="bg-[linear-gradient(135deg,#7c5cfa_0%,#6c4cf0_100%)]">
                        <TableHeading>
                          Collection
                        </TableHeading>

                        <TableHeading>
                          Slug
                        </TableHeading>

                        <TableHeading>
                          Products
                        </TableHeading>

                        <TableHeading>
                          Promotions
                        </TableHeading>

                        <TableHeading>
                          Updated
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
                      {collections.map(
                        (
                          collection
                        ) => (
                          <tr
                            key={
                              collection.id
                            }

                            className="
                              group

                              bg-white

                              transition-colors
                              duration-150

                              hover:bg-[#f8f5ff]
                            "
                          >
                            {/* COLLECTION */}

                            <td className="px-5 py-4">
                              <div className="min-w-[200px]">
                                <p className="max-w-[260px] truncate text-[15px] font-bold text-[#292430]">
                                  {
                                    collection.name
                                  }
                                </p>

                                <p className="mt-1 max-w-[280px] truncate text-[13px] text-[#aaa3b2]">
                                  {collection.description ||
                                    "No description"}
                                </p>
                              </div>
                            </td>

                            {/* SLUG */}

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
                                /
                                {
                                  collection.slug
                                }
                              </span>
                            </td>

                            {/* PRODUCTS */}

                            <td className="px-5 py-4">
                              <CountValue
                                icon={
                                  <Package
                                    size={14}
                                  />
                                }

                                value={
                                  collection.productCount
                                }
                              />
                            </td>

                            {/* PROMOTIONS */}

                            <td className="px-5 py-4">
                              <span className="text-[15px] font-bold text-[#625b6c]">
                                {
                                  collection.promotionCount
                                }
                              </span>
                            </td>

                            {/* UPDATED */}

                            <td className="px-5 py-4">
                              <span className="whitespace-nowrap text-[13px] text-[#777080]">
                                {formatDate(
                                  collection.updatedAt
                                )}
                              </span>
                            </td>

                            {/* STATUS */}

                            <td className="px-5 py-4">
                              <CollectionStatusBadge
                                isActive={
                                  collection.isActive
                                }
                              />
                            </td>

                            {/* ACTIONS */}

                            <td className="px-5 py-4">
                              <CollectionActions
                                collection={
                                  collection
                                }

                                onView={() =>
                                  navigate(
                                    `/admin/collections/${collection.id}/view`
                                  )
                                }

                                onEdit={() =>
                                  navigate(
                                    `/admin/collections/${collection.id}/edit`
                                  )
                                }

                                onStatusChange={(
                                  nextActive
                                ) => {
                                  const confirmed =
                                    window.confirm(
                                      nextActive
                                        ? `Enable "${collection.name}"?`
                                        : `Disable "${collection.name}"?`
                                    );

                                  if (
                                    !confirmed
                                  ) {
                                    return;
                                  }

                                  void updateStatus(
                                    collection,

                                    nextActive
                                  );
                                }}
                              />
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
            MOBILE
        ========================== */}

        {!loading &&
          collections.length >
            0 && (
            <div
              className={`
                ${carlitoFont}

                divide-y

                divide-[#e6def0]

                lg:hidden
              `}
            >
              {collections.map(
                (
                  collection
                ) => (
                  <div
                    key={
                      collection.id
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
                            collection.name
                          }
                        </p>

                        <p className="mt-1 truncate text-[13px] text-[#a29aaa]">
                          /
                          {
                            collection.slug
                          }
                        </p>
                      </div>

                      <CollectionActions
                        collection={
                          collection
                        }

                        onView={() =>
                          navigate(
                            `/admin/collections/${collection.id}/view`
                          )
                        }

                        onEdit={() =>
                          navigate(
                            `/admin/collections/${collection.id}/edit`
                          )
                        }

                        onStatusChange={(
                          nextActive
                        ) => {
                          const confirmed =
                            window.confirm(
                              nextActive
                                ? `Enable "${collection.name}"?`
                                : `Disable "${collection.name}"?`
                            );

                          if (
                            !confirmed
                          ) {
                            return;
                          }

                          void updateStatus(
                            collection,

                            nextActive
                          );
                        }}
                      />
                    </div>

                    <div className="mt-3">
                      <CollectionStatusBadge
                        isActive={
                          collection.isActive
                        }
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <MobileDetail
                        label="Products"

                        value={String(
                          collection.productCount
                        )}
                      />

                      <MobileDetail
                        label="Promotions"

                        value={String(
                          collection.promotionCount
                        )}
                      />
                    </div>

                    {collection.description && (
                      <p className="mt-4 line-clamp-2 border-t border-[#f0edf3] pt-3 text-[13px] leading-5 text-[#777080]">
                        {
                          collection.description
                        }
                      </p>
                    )}

                    <p className="mt-3 text-[12px] text-[#aaa3b2]">
                      Updated{" "}

                      {formatDate(
                        collection.updatedAt
                      )}
                    </p>
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
                  collections
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
  | "slate";

const SummaryItem = ({
  icon,

  label,

  value,

  description,

  tone = "violet",

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
   STATUS
========================= */

const CollectionStatusBadge =
  ({
    isActive,
  }: {
    isActive:
      boolean;
  }) => {
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

          ${
            isActive
              ? "bg-[#eaf8ef] text-[#39975b]"
              : "bg-[#f2eff5] text-[#77707f]"
          }
        `}
      >
        <span
          className={`
            mr-1.5

            h-1.5

            w-1.5

            rounded-full

            ${
              isActive
                ? "bg-[#4caf6b]"
                : "bg-[#918a99]"
            }
          `}
        />

        {isActive
          ? "Active"
          : "Inactive"}
      </span>
    );
  };

/* =========================
   COUNT
========================= */

const CountValue = ({
  icon,

  value,
}: {
  icon:
    ReactNode;

  value:
    number;
}) => {
  return (
    <div className="inline-flex items-center gap-2 text-[15px] font-bold text-[#625b6c]">
      <span className="text-[#9b92a5]">
        {icon}
      </span>

      {value}
    </div>
  );
};

/* =========================
   ACTIONS
========================= */

const CollectionActions = ({
  collection,

  onView,

  onEdit,

  onStatusChange,
}: {
  collection:
    Collection;

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

        title="View collection"

        aria-label={`View ${collection.name}`}

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

        title="Edit collection"

        aria-label={`Edit ${collection.name}`}

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

      {collection.isActive ? (
        <button
          type="button"

          title="Disable collection"

          aria-label={`Disable ${collection.name}`}

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

          title="Enable collection"

          aria-label={`Enable ${collection.name}`}

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

export default Collections;