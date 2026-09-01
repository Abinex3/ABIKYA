import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleOff,
  Layers3,
  MoreHorizontal,
  Package,
  Plus,
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
   TYPES
========================= */

type Collection = {
  id: string;

  name: string;
  slug: string;

  description: string | null;

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
  collections: Collection[];

  pagination: Pagination;

  stats: CollectionStats;
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
  ).format(new Date(value));
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
  ] = useState<Collection[]>([]);

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
  ] = useState<CollectionStats>({
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
                method: "GET",

                credentials:
                  "include",
              }
            );

          const data:
            CollectionsResponse & {
              message?: string;
            } =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Unable to load collections."
            );
          }

          if (
            pagination.page >
            data.pagination.totalPages
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

          setCollections(
            data.collections ?? []
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


  /* =========================
     STATUS UPDATE
  ========================= */

  const updateStatus =
    async (
      collection: Collection,
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
            `http://localhost:5000/api/admin/collections/${collection.id}/status`,
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
              "Unable to update collection status."
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
            : "Unable to update collection status."
        );
      }
    };


  /* =========================
     UI
  ========================= */

  return (
    <div className="w-full pb-10 font-sans">

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
            Catalog
          </p>

          <h1 className="text-[25px] font-semibold tracking-[-0.03em] text-[#211d29]">
            Collections
          </h1>

          <p className="mt-1 text-[12px] text-[#8f8798]">
            Manage curated product collections and merchandising groups.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/collections/new"
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
            Add Collection
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
          overflow-visible
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
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="relative w-full sm:max-w-[360px]">
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
                setSearch(
                  event.target.value
                );

                resetFilterPage();
              }}
              placeholder="Search collection..."
              className="
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
              "
            />
          </div>

          <SelectFilter
            value={status}
            onChange={(value) => {
              setStatus(value);

              resetFilterPage();
            }}
            label="Status"
            options={[
              {
                value: "ACTIVE",
                label: "Active",
              },
              {
                value: "INACTIVE",
                label: "Inactive",
              },
            ]}
          />
        </div>


        {/* STATS */}

        <div className="grid grid-cols-1 gap-3 border-b border-[#eeeaf3] bg-[#faf8ff] p-4 sm:grid-cols-3">

          <SummaryItem
            icon={
              <Layers3
                size={16}
              />
            }
            label="Collections"
            value={String(
              stats.totalCollections
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
              stats.activeCollections
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
              stats.inactiveCollections
            )}
          />

        </div>


        {/* LOADING */}

        {loading && (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ded5f8] border-t-[#725aff]" />

              <p className="mt-3 text-[12px] text-[#91899a]">
                Loading collections...
              </p>

            </div>
          </div>
        )}


        {/* EMPTY */}

        {!loading &&
          collections.length ===
            0 && (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee9ff] text-[#725aff]">
                <Layers3
                  size={24}
                />
              </div>

              <h3 className="mt-4 text-[14px] font-semibold text-[#332d3b]">
                {search || status
                  ? "No collections found"
                  : "No collections yet"}
              </h3>

              <p className="mt-1 max-w-[340px] text-[11px] leading-5 text-[#9a92a2]">
                {search || status
                  ? "Try changing your search or filter."
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
                    className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl bg-[#eee6ff] px-4 text-[12px] font-semibold text-[#6750d4]"
                  >
                    <Plus
                      size={14}
                    />

                    Add Collection
                  </button>
                )}

            </div>
          )}


        {/* DESKTOP TABLE */}

        {!loading &&
          collections.length >
            0 && (
            <div className="hidden overflow-x-auto lg:block">

              <table className="w-full min-w-[950px] border-collapse">

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

                    <th className="w-[64px] px-4 py-3.5" />

                  </tr>
                </thead>


                <tbody className="divide-y divide-[#f0edf3]">

                  {collections.map(
                    (collection) => (
                      <tr
                        key={
                          collection.id
                        }
                        className="
                          group
                          transition-colors
                          duration-150
                          hover:bg-[#fcfbff]
                        "
                      >

                        {/* COLLECTION */}

                        <td className="px-5 py-4">
                          <div className="min-w-[200px]">

                            <p className="max-w-[260px] truncate text-sm font-semibold text-[#292430]">
                              {
                                collection.name
                              }
                            </p>

                            <p className="mt-1 max-w-[280px] truncate text-xs text-[#aaa3b2]">
                              {collection.description ||
                                "No description"}
                            </p>

                          </div>
                        </td>


                        {/* SLUG */}

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-lg bg-[#f7f5fa] px-2.5 py-1.5 text-xs font-medium text-[#706879]">
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
                          <span className="text-sm font-medium text-[#625b6c]">
                            {
                              collection.promotionCount
                            }
                          </span>
                        </td>


                        {/* UPDATED */}

                        <td className="px-5 py-4">
                          <span className="text-xs text-[#777080]">
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

                        <td className="px-4 py-4">

                          <CollectionActions
                            collection={
                              collection
                            }

                            open={
                              openActionId ===
                              collection.id
                            }

                            onToggle={() =>
                              setOpenActionId(
                                (
                                  current
                                ) =>
                                  current ===
                                  collection.id
                                    ? null
                                    : collection.id
                              )
                            }

                            onView={() => {
                              setOpenActionId(
                                null
                              );

                              navigate(
                                `/admin/collections/${collection.id}/view`
                              );
                            }}

                            onEdit={() => {
                              setOpenActionId(
                                null
                              );

                              navigate(
                                `/admin/collections/${collection.id}/edit`
                              );
                            }}

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
          )}


        {/* MOBILE */}

        {!loading &&
          collections.length >
            0 && (
            <div className="divide-y divide-[#eeeaf3] lg:hidden">

              {collections.map(
                (collection) => (
                  <div
                    key={
                      collection.id
                    }
                    className="p-4 transition-colors hover:bg-[#fcfbff]"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-[#292430]">
                          {
                            collection.name
                          }
                        </p>

                        <p className="mt-1 truncate text-xs text-[#a29aaa]">
                          /{
                            collection.slug
                          }
                        </p>

                      </div>


                      <CollectionActions
                        collection={
                          collection
                        }

                        open={
                          openActionId ===
                          collection.id
                        }

                        onToggle={() =>
                          setOpenActionId(
                            (
                              current
                            ) =>
                              current ===
                              collection.id
                                ? null
                                : collection.id
                          )
                        }

                        onView={() => {
                          setOpenActionId(
                            null
                          );

                          navigate(
                            `/admin/collections/${collection.id}/view`
                          );
                        }}

                        onEdit={() => {
                          setOpenActionId(
                            null
                          );

                          navigate(
                            `/admin/collections/${collection.id}/edit`
                          );
                        }}

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
                      <p className="mt-4 line-clamp-2 border-t border-[#f0edf3] pt-3 text-xs leading-5 text-[#777080]">
                        {
                          collection.description
                        }
                      </p>
                    )}


                    <p className="mt-3 text-[11px] text-[#aaa3b2]">
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
                </span>

                {" "}of{" "}

                <span className="font-medium text-[#5e5768]">
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
          focus:border-[#a997ff]
          focus:ring-4
          focus:ring-[#735cff]/[0.07]
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

const CollectionStatusBadge = ({
  isActive,
}: {
  isActive: boolean;
}) => {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5 py-1
        text-[11px]
        font-semibold

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
          h-1.5 w-1.5
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
  icon: ReactNode;

  value: number;
}) => {
  return (
    <div className="inline-flex items-center gap-2 text-sm font-medium text-[#625b6c]">

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
  open,
  onToggle,
  onView,
  onEdit,
  onStatusChange,
}: {
  collection: Collection;

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
        aria-label={`Actions for ${collection.name}`}
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
            z-50 w-[150px]
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
                !collection.isActive
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
                collection.isActive
                  ? "text-[#d95c70] hover:bg-[#fff4f5]"
                  : "text-[#4f8d67] hover:bg-[#f2fbf5]"
              }
            `}
          >
            {collection.isActive
              ? "Disable"
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


export default Collections;