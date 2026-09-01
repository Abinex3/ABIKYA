import {
  ArrowDownToLine,
  ArrowLeft,
  CalendarDays,
  History,
  Package,
  Pencil,
  RotateCcw,
  Scale,
  ShoppingBag,
  TriangleAlert,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

const headingFont =
  "font-['Poppins']";

const bodyFont =
  "font-sans";

/* =========================
   TYPES
========================= */

type ProductStatus =
  | "DRAFT"
  | "ACTIVE"
  | "ARCHIVED";

type MovementType =
  | "RECEIVE"
  | "DAMAGE_LOSS"
  | "RETURN"
  | "MANUAL_ADJUSTMENT"
  | "SALE"
  | "ORDER_CANCEL_RETURN";

type EditableMovementType =
  | "RECEIVE"
  | "DAMAGE_LOSS"
  | "RETURN"
  | "MANUAL_ADJUSTMENT";

type HistoryPeriod =
  | "ALL"
  | "MONTH"
  | "DATE";

  type HistorySource =
  | "ALL"
  | "ADMIN"
  | "ORDER";

type InventoryProduct = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
};

type AdminActor = {
  id: string;
  email: string;
  role: string;
};

type InventoryMovement = {
  id: string;

  type:
    MovementType;

  quantityDelta:
    number;

  stockBefore:
    number;

  stockAfter:
    number;

  note:
    string | null;

  createdAt:
    string;

  admin:
    AdminActor;
};

type InventoryHistoryResponse = {
  product:
    InventoryProduct;

  movements:
    InventoryMovement[];
};

type HistoryPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};


/* =========================
   DATE HELPERS
========================= */

const padNumber = (
  value: number
) =>
  String(value).padStart(
    2,
    "0"
  );

const getLocalDateKey = (
  dateString: string
) => {
  const date =
    new Date(
      dateString
    );

  return [
    date.getFullYear(),
    padNumber(
      date.getMonth() +
        1
    ),
    padNumber(
      date.getDate()
    ),
  ].join("-");
};

const getLocalMonthKey = (
  dateString: string
) => {
  const date =
    new Date(
      dateString
    );

  return [
    date.getFullYear(),
    padNumber(
      date.getMonth() +
        1
    ),
  ].join("-");
};

const getCurrentMonthKey =
  () => {
    const now =
      new Date();

    return [
      now.getFullYear(),
      padNumber(
        now.getMonth() +
          1
      ),
    ].join("-");
  };

const getCurrentDateKey =
  () => {
    const now =
      new Date();

    return [
      now.getFullYear(),
      padNumber(
        now.getMonth() +
          1
      ),
      padNumber(
        now.getDate()
      ),
    ].join("-");
  };

const formatMonthLabel = (
  value: string
) => {
  if (!value) {
    return "";
  }

  const [
    year,
    month,
  ] =
    value.split("-");

  const date =
    new Date(
      Number(year),
      Number(month) - 1,
      1
    );

  return date.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );
};

const formatSelectedDate = (
  value: string
) => {
  if (!value) {
    return "";
  }

  const [
    year,
    month,
    day,
  ] =
    value.split("-");

  const date =
    new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
};

/* =========================
   MOVEMENT HELPERS
========================= */

const formatMovementType = (
  type: MovementType
) => {
  switch (type) {
    case "RECEIVE":
      return "Receive";

    case "DAMAGE_LOSS":
      return "Damage / Loss";

    case "RETURN":
      return "Return";

    case "MANUAL_ADJUSTMENT":
      return "Manual Adjustment";

    case "SALE":
      return "Order Sale";

    case "ORDER_CANCEL_RETURN":
      return "Order Cancel Return";
  }
};

const formatProductStatus = (
  status: ProductStatus
) => {
  if (
    status === "ACTIVE"
  ) {
    return "Active";
  }

  if (
    status === "DRAFT"
  ) {
    return "Draft";
  }

  return "Archived";
};

const isOrderMovement = (
  type: MovementType
) =>
  type === "SALE" ||
  type ===
    "ORDER_CANCEL_RETURN";

const getMovementModalTitle = (
  type: EditableMovementType
) => {
  switch (type) {
    case "RECEIVE":
      return "Receive Stock";

    case "DAMAGE_LOSS":
      return "Record Damage / Loss";

    case "RETURN":
      return "Record Return";

    case "MANUAL_ADJUSTMENT":
      return "Manual Adjustment";
  }
};

const getMovementDescription = (
  type: EditableMovementType
) => {
  switch (type) {
    case "RECEIVE":
      return "Add newly received physical stock to this product.";

    case "DAMAGE_LOSS":
      return "Reduce stock for damaged, missing, or lost units.";

    case "RETURN":
      return "Add returned units back into physical stock.";

    case "MANUAL_ADJUSTMENT":
      return "Correct stock manually using a positive or negative quantity.";
  }
};

const getMovementButtonLabel = (
  type: EditableMovementType
) => {
  switch (type) {
    case "RECEIVE":
      return "Receive Stock";

    case "DAMAGE_LOSS":
      return "Record Damage / Loss";

    case "RETURN":
      return "Record Return";

    case "MANUAL_ADJUSTMENT":
      return "Save Adjustment";
  }
};

const getMovementPlaceholder = (
  type: EditableMovementType
) => {
  switch (type) {
    case "RECEIVE":
      return "Example: 20";

    case "DAMAGE_LOSS":
      return "Example: 3";

    case "RETURN":
      return "Example: 2";

    case "MANUAL_ADJUSTMENT":
      return "Example: -2 or 5";
  }
};

const getNotePlaceholder = (
  type: EditableMovementType
) => {
  switch (type) {
    case "RECEIVE":
      return "Example: New shipment received";

    case "DAMAGE_LOSS":
      return "Example: Damaged during handling";

    case "RETURN":
      return "Example: Customer return";

    case "MANUAL_ADJUSTMENT":
      return "Example: Physical count correction";
  }
};

/* =========================
   PAGE
========================= */

const InventoryDetail =
  () => {
    const navigate =
      useNavigate();

    const {
      productId,
    } =
      useParams<{
        productId: string;
      }>();

    const [
      product,
      setProduct,
    ] =
      useState<
        InventoryProduct | null
      >(null);

    const [
      movements,
      setMovements,
    ] =
      useState<
        InventoryMovement[]
      >([]);

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

    /* =========================
       HISTORY FILTER
    ========================= */

    const [
      historyPeriod,
      setHistoryPeriod,
    ] =
      useState<HistoryPeriod>(
        "ALL"
      );

    const [
      selectedMonth,
      setSelectedMonth,
    ] =
      useState(
        getCurrentMonthKey()
      );

    const [
      selectedDate,
      setSelectedDate,
    ] =
      useState(
        getCurrentDateKey()
      );

    /* =========================
       MOVEMENT MODAL
    ========================= */

    const [
      activeMovementType,
      setActiveMovementType,
    ] =
      useState<
        EditableMovementType | null
      >(null);

    const [
      movementQuantity,
      setMovementQuantity,
    ] =
      useState("");

    const [
      movementNote,
      setMovementNote,
    ] =
      useState("");

    const [
      movementSaving,
      setMovementSaving,
    ] =
      useState(false);

    const [
      movementError,
      setMovementError,
    ] =
      useState("");

      const [
  historySource,
  setHistorySource,
] =
  useState<HistorySource>(
    "ALL"
  );
  const [
  historyPage,
  setHistoryPage,
] =
  useState(1);

const [
  historyLimit,
] =
  useState(10);

const [
  historyPagination,
  setHistoryPagination,
] =
  useState<HistoryPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

    /* =========================
       THRESHOLD MODAL
    ========================= */

    const [
      thresholdModalOpen,
      setThresholdModalOpen,
    ] =
      useState(false);

    const [
      thresholdValue,
      setThresholdValue,
    ] =
      useState("");

    const [
      thresholdSaving,
      setThresholdSaving,
    ] =
      useState(false);

    const [
      thresholdError,
      setThresholdError,
    ] =
      useState("");

    /* =========================
       LOAD HISTORY
    ========================= */

    const loadHistory =
  useCallback(
    async (
      showLoading = true
    ) => {
      if (!productId) {
        setError(
          "Product ID is missing."
        );

        setLoading(false);

        return;
      }

      try {
        if (showLoading) {
          setLoading(true);
        }

        setError("");

        const params =
          new URLSearchParams();

          params.set(
  "page",
  String(historyPage)
);

params.set(
  "limit",
  String(historyLimit)
);

        if (
          historyPeriod ===
            "MONTH" &&
          selectedMonth
        ) {
          params.set(
            "month",
            selectedMonth
          );
        }

        if (
  historySource !== "ALL"
) {
  params.set(
    "source",
    historySource
  );
}

        if (
          historyPeriod ===
            "DATE" &&
          selectedDate
        ) {
          params.set(
            "date",
            selectedDate
          );
        }

        const query =
          params.toString();

        const response =
          await fetch(
            `http://localhost:5000/api/admin/inventory/${productId}/history${
              query
                ? `?${query}`
                : ""
            }`,
            {
              method: "GET",
              credentials:
                "include",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load inventory history."
          );
        }

        setProduct(
          data.product
        );

        setMovements(
          data.movements ??
            []
        );
        setHistoryPagination(
  data.pagination ?? {
    page: historyPage,
    limit: historyLimit,
    total: 0,
    totalPages: 1,
  }
);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load inventory history."
        );
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
   [
  productId,
  historyPeriod,
  selectedMonth,
  selectedDate,
  historySource,
  historyPage,
  historyLimit,
]
  );

useEffect(() => {
  void loadHistory();
}, [loadHistory]);


    /* =========================
       FILTERED HISTORY
    ========================= */





    const movementFilterLabel =
      historyPeriod ===
      "MONTH"
        ? formatMonthLabel(
            selectedMonth
          )
        : historyPeriod ===
            "DATE"
          ? formatSelectedDate(
              selectedDate
            )
          : "All Time";


          const orderMovementCount =
  movements.filter(
    (movement) =>
      isOrderMovement(
        movement.type
      )
  ).length;


    /* =========================
       MOVEMENT MODAL
    ========================= */

    const openMovementModal =
      (
        type: EditableMovementType
      ) => {
        setActiveMovementType(
          type
        );

        setMovementQuantity(
          ""
        );

        setMovementNote(
          ""
        );

        setMovementError(
          ""
        );
      };

    const closeMovementModal =
      () => {
        if (
          movementSaving
        ) {
          return;
        }

        setActiveMovementType(
          null
        );

        setMovementQuantity(
          ""
        );

        setMovementNote(
          ""
        );

        setMovementError(
          ""
        );
      };

    const submitMovement =
      async () => {
        if (
          !productId ||
          !activeMovementType
        ) {
          return;
        }

        const quantity =
          Number(
            movementQuantity
          );

        const isManual =
          activeMovementType ===
          "MANUAL_ADJUSTMENT";

        if (
          !Number.isInteger(
            quantity
          )
        ) {
          setMovementError(
            "Quantity must be a whole number."
          );

          return;
        }

        if (
          isManual &&
          quantity === 0
        ) {
          setMovementError(
            "Manual adjustment quantity cannot be 0."
          );

          return;
        }

        if (
          !isManual &&
          quantity <= 0
        ) {
          setMovementError(
            "Quantity must be greater than 0."
          );

          return;
        }

        const csrfToken =
          sessionStorage.getItem(
            "admin_csrf_token"
          );

        if (
          !csrfToken
        ) {
          setMovementError(
            "Your admin session is missing the security token. Please sign in again."
          );

          return;
        }

        try {
          setMovementSaving(
            true
          );

          setMovementError(
            ""
          );

          const response =
            await fetch(
              `http://localhost:5000/api/admin/inventory/${productId}/movements`,
              {
                method:
                  "POST",

                credentials:
                  "include",

                headers: {
                  "Content-Type":
                    "application/json",

                  "x-csrf-token":
                    csrfToken,
                },

                body:
                  JSON.stringify(
                    {
                      type:
                        activeMovementType,

                      quantity,

                      note:
                        movementNote.trim() ||
                        undefined,
                    }
                  ),
              }
            );

          const data =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              data.message ||
                "Unable to update inventory."
            );
          }

          setActiveMovementType(
            null
          );

          setMovementQuantity(
            ""
          );

          setMovementNote(
            ""
          );

          setMovementError(
            ""
          );

          if (historyPage === 1) {
  await loadHistory(
    false
  );
} else {
  setHistoryPage(1);
}
        } catch (
          error
        ) {
          setMovementError(
            error instanceof
              Error
              ? error.message
              : "Unable to update inventory."
          );
        } finally {
          setMovementSaving(
            false
          );
        }
      };

    /* =========================
       THRESHOLD
    ========================= */

    const openThresholdModal =
      () => {
        if (!product) {
          return;
        }

        setThresholdValue(
          String(
            product.lowStockThreshold
          )
        );

        setThresholdError(
          ""
        );

        setThresholdModalOpen(
          true
        );
      };

    const closeThresholdModal =
      () => {
        if (
          thresholdSaving
        ) {
          return;
        }

        setThresholdModalOpen(
          false
        );

        setThresholdError(
          ""
        );
      };

    const saveThreshold =
      async () => {
        if (!productId) {
          return;
        }

        const parsedValue =
          Number(
            thresholdValue
          );

        if (
          !Number.isInteger(
            parsedValue
          ) ||
          parsedValue < 0
        ) {
          setThresholdError(
            "Threshold must be a whole number of 0 or more."
          );

          return;
        }

        const csrfToken =
          sessionStorage.getItem(
            "admin_csrf_token"
          );

        if (
          !csrfToken
        ) {
          setThresholdError(
            "Your admin session is missing the security token. Please sign in again."
          );

          return;
        }

        try {
          setThresholdSaving(
            true
          );

          setThresholdError(
            ""
          );

          const response =
            await fetch(
              `http://localhost:5000/api/admin/inventory/${productId}/threshold`,
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
                  JSON.stringify(
                    {
                      lowStockThreshold:
                        parsedValue,
                    }
                  ),
              }
            );

          const data =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              data.message ||
                "Unable to update low-stock threshold."
            );
          }

          setThresholdModalOpen(
            false
          );

          setThresholdError(
            ""
          );

          if (historyPage === 1) {
  await loadHistory(
    false
  );
} else {
  setHistoryPage(1);
}
        } catch (
          error
        ) {
          setThresholdError(
            error instanceof
              Error
              ? error.message
              : "Unable to update low-stock threshold."
          );
        } finally {
          setThresholdSaving(
            false
          );
        }
      };

    return (
      <div
        className={`w-full pb-10 ${bodyFont}`}
      >
        {/* =========================
            HEADER
        ========================== */}

        <div
          className="
            mb-6
            rounded-[20px]
            border border-[#e6def8]
            bg-[linear-gradient(120deg,#f4efff_0%,#ede4fd_55%,#f7f2ff_100%)]
            p-5
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/inventory"
              )
            }
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              text-[12px]
              font-semibold
              text-[#725aff]
              transition
              hover:text-[#5f46df]
            "
          >
            <ArrowLeft
              size={15}
            />

            Back to Inventory
          </button>

          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8368e0]">
            Stock Management
          </p>

          <h1
            className={`${headingFont} text-[25px] font-semibold tracking-[-0.03em] text-[#211d29]`}
          >
            Inventory Details
          </h1>
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
            LOADING
        ========================== */}

        {loading && (
          <div className="flex min-h-[320px] items-center justify-center rounded-[20px] border border-[#e9e5ef] bg-white">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ded5f8] border-t-[#725aff]" />

              <p className="mt-3 text-[12px] text-[#91899a]">
                Loading inventory
                history...
              </p>
            </div>
          </div>
        )}

        {!loading &&
          product && (
            <>
              {/* =========================
                  PRODUCT SUMMARY
              ========================== */}

              <section
                className="
                  mb-5
                  rounded-[20px]
                  border border-[#e9e5ef]
                  bg-white
                  p-5
                  shadow-[0_8px_30px_rgba(53,42,78,0.035)]
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    md:flex-row
                    md:items-start
                    md:justify-between
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-12 w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#eee9ff]
                        text-[#725aff]
                      "
                    >
                      <Package
                        size={21}
                      />
                    </div>

                    <div>
                      <h2
                        className={`${headingFont} text-[18px] font-semibold text-[#292430]`}
                      >
                        {
                          product.name
                        }
                      </h2>

                      <p className="mt-1 text-xs font-medium text-[#aaa3b2]">
                        {
                          product.sku
                        }
                      </p>
                    </div>
                  </div>

                  <ProductStatusBadge
                    status={
                      product.status
                    }
                  />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  <SummaryCard
                    label="Current Stock"
                    value={String(
                      product.stock
                    )}
                    warning={
                      product.stock >
                        0 &&
                      product.stock <=
                        product.lowStockThreshold
                    }
                    danger={
                      product.stock ===
                      0
                    }
                  />

                  <div className="relative">
                    <SummaryCard
                      label="Low Stock Threshold"
                      value={String(
                        product.lowStockThreshold
                      )}
                    />

                    {product.status !==
                      "ARCHIVED" && (
                      <button
                        type="button"
                        onClick={
                          openThresholdModal
                        }
                        className="
                          absolute
                          bottom-3
                          right-3
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-lg
                          px-2.5
                          py-1.5
                          text-[11px]
                          font-semibold
                          text-[#6e59ff]
                          transition
                          hover:bg-[#eee9ff]
                        "
                      >
                        <Pencil
                          size={
                            12
                          }
                        />

                        Edit Threshold
                      </button>
                    )}
                  </div>

                  <SummaryCard
                    label="Total Movements"
                    value={String(
                      movements.length
                    )}
                  />
                </div>
              </section>

              {/* =========================
                  INVENTORY ACTIONS
              ========================== */}

              <section
                className="
                  mb-5
                  rounded-[20px]
                  border border-[#e9e5ef]
                  bg-white
                  p-5
                  shadow-[0_8px_30px_rgba(53,42,78,0.035)]
                "
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8368e0]">
                    Inventory Actions
                  </p>

                  <h2
                    className={`${headingFont} mt-1 text-[15px] font-semibold text-[#292430]`}
                  >
                    Manage Stock
                  </h2>

                  <p className="mt-1 text-[11px] leading-5 text-[#9c95a5]">
                    Record physical
                    stock changes with
                    a permanent audit
                    history.
                  </p>
                </div>

                {product.status !==
                "ARCHIVED" ? (
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <InventoryActionButton
                      icon={
                        <ArrowDownToLine
                          size={
                            17
                          }
                        />
                      }
                      title="Receive Stock"
                      description="Add newly received units."
                      onClick={() =>
                        openMovementModal(
                          "RECEIVE"
                        )
                      }
                      variant="primary"
                    />

                    <InventoryActionButton
                      icon={
                        <TriangleAlert
                          size={
                            17
                          }
                        />
                      }
                      title="Damage / Loss"
                      description="Deduct damaged or missing units."
                      onClick={() =>
                        openMovementModal(
                          "DAMAGE_LOSS"
                        )
                      }
                      variant="danger"
                    />

                    <InventoryActionButton
                      icon={
                        <RotateCcw
                          size={
                            17
                          }
                        />
                      }
                      title="Return"
                      description="Add returned units back."
                      onClick={() =>
                        openMovementModal(
                          "RETURN"
                        )
                      }
                      variant="success"
                    />

                    <InventoryActionButton
                      icon={
                        <Scale
                          size={
                            17
                          }
                        />
                      }
                      title="Manual Adjustment"
                      description="Correct stock by + or - quantity."
                      onClick={() =>
                        openMovementModal(
                          "MANUAL_ADJUSTMENT"
                        )
                      }
                      variant="neutral"
                    />
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-[#e9e5ef] bg-[#f8f7fa] px-4 py-3 text-[11px] font-medium text-[#91899a]">
                    Restore this
                    product before
                    changing stock.
                  </div>
                )}
              </section>

              {/* =========================
                  HISTORY
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
                {/* History header */}

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    border-b
                    border-[#eeeaf3]
                    p-5
                    xl:flex-row
                    xl:items-center
                    xl:justify-between
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-9 w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#eee9ff]
                        text-[#725aff]
                      "
                    >
                      <History
                        size={
                          17
                        }
                      />
                    </div>

                    <div>
                      <h2
                        className={`${headingFont} text-[15px] font-semibold text-[#292430]`}
                      >
                        Movement History
                      </h2>

                      <p className="mt-0.5 text-[11px] text-[#9c95a5]">
                        Inventory and
                        temporary order
                        stock history.
                      </p>
                    </div>
                  </div>

                  {/* History period filter */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-2
                      sm:flex-row
                      sm:items-center
                    "
                  >
                    <select
                      value={
                        historyPeriod
                      }
                      onChange={(event) => {
  setHistoryPage(1);

  setHistoryPeriod(
    event.target
      .value as HistoryPeriod
  );
}}
                      className="
                        h-10
                        rounded-xl
                        border
                        border-[#e8e3ee]
                        bg-white
                        px-3
                        font-sans
                        text-[12px]
                        font-medium
                        text-[#655e6f]
                        outline-none
                        focus:border-[#b8a2ef]
                      "
                    >
                      <option value="ALL">
                        All History
                      </option>

                      <option value="MONTH">
                        Monthly History
                      </option>

                      <option value="DATE">
                        Date Wise History
                      </option>
                    </select>

                    <select
  value={historySource}
  onChange={(event) => {
  setHistoryPage(1);

  setHistorySource(
    event.target
      .value as HistorySource
  );
}}
  className="
    h-10
    rounded-xl
    border
    border-[#e8e3ee]
    bg-white
    px-3
    font-sans
    text-[12px]
    font-medium
    text-[#655e6f]
    outline-none
    focus:border-[#b8a2ef]
  "
>
  <option value="ALL">
    All Sources
  </option>

  <option value="ADMIN">
    Admin Movements
  </option>

  <option value="ORDER">
    Order Movements
  </option>
</select>

                    {historyPeriod ===
                      "MONTH" && (
                      <input
  type="month"
  value={selectedMonth}
  onChange={(event) => {
  setHistoryPage(1);

  setSelectedMonth(
    event.target.value
  );
}}
  className="
    h-10
    rounded-xl
    border
    border-[#e8e3ee]
    bg-white
    px-3
    font-sans
    text-[12px]
    font-medium
    text-[#655e6f]
    outline-none
    focus:border-[#b8a2ef]
  "
/>
                    )}

                    {historyPeriod ===
                      "DATE" && (
                      <input
  type="date"
  value={selectedDate}
  onChange={(event) => {
  setHistoryPage(1);

  setSelectedDate(
    event.target.value
  );
}}
  className="
    h-10
    rounded-xl
    border
    border-[#e8e3ee]
    bg-white
    px-3
    font-sans
    text-[12px]
    font-medium
    text-[#655e6f]
    outline-none
    focus:border-[#b8a2ef]
  "
/>
                    )}
                  </div>
                </div>

                {/* Filter summary */}

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3
                    border-b
                    border-[#eeeaf3]
                    bg-[#faf8ff]
                    p-4
                    sm:grid-cols-3
                  "
                >
                  <HistorySummary
                    icon={
                      <CalendarDays
                        size={
                          15
                        }
                      />
                    }
                    label="Viewing"
                    value={
                      movementFilterLabel
                    }
                  />

                  <HistorySummary
  icon={
    <ShoppingBag
      size={15}
    />
  }
  label="Source"
  value={
    historySource === "ALL"
      ? "All Sources"
      : historySource === "ORDER"
        ? "Order"
        : "Admin"
  }
/>

                  <HistorySummary
                    icon={
                      <History
                        size={
                          15
                        }
                      />
                    }
                    label="Movements"
                    value={String(
                      movements.length
                    )}
                  />

                  <HistorySummary
                    icon={
                      <ShoppingBag
                        size={
                          15
                        }
                      />
                    }
                    label="Order Movements"
                    value={String(
                      orderMovementCount
                    )}
                  />
                </div>

                {/* Empty */}

                {movements.length ===
                0 ? (
                  <div className="flex min-h-[260px] flex-col items-center justify-center px-5 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1edff] text-[#725aff]">
                      <History
                        size={
                          23
                        }
                      />
                    </div>

                    <h3
                      className={`${headingFont} mt-4 text-[14px] font-semibold text-[#332d3b]`}
                    >
                      No movements
                      found
                    </h3>

                    <p className="mt-1 max-w-[380px] text-[11px] leading-5 text-[#9a92a2]">
                      There are no
                      inventory
                      movements for
                      the selected
                      period.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* =========================
                        DESKTOP HISTORY
                    ========================== */}

                    <div className="hidden overflow-x-auto lg:block">
                      <table className="w-full min-w-[980px] border-collapse">
                        <thead>
                          <tr className="bg-[linear-gradient(135deg,#7c5cfa_0%,#6c4cf0_100%)]">
                            <TableHeading>
                              Movement
                            </TableHeading>

                            <TableHeading>
                              Source
                            </TableHeading>

                            <TableHeading>
                              Change
                            </TableHeading>

                            <TableHeading>
                              Before
                            </TableHeading>

                            <TableHeading>
                              After
                            </TableHeading>

                            <TableHeading>
                              Note
                            </TableHeading>

                            <TableHeading>
                              Admin
                            </TableHeading>

                            <TableHeading>
                              Date
                            </TableHeading>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-[#f0edf3]">
                          {movements.map(
                            (
                              movement
                            ) => (
                              <tr
                                key={
                                  movement.id
                                }
                                className="transition-colors hover:bg-[#fcfbff]"
                              >
                                <td className="px-5 py-4">
                                  <MovementBadge
                                    type={
                                      movement.type
                                    }
                                  />
                                </td>

                                <td className="px-5 py-4">
                                  <MovementSourceBadge
                                    type={
                                      movement.type
                                    }
                                  />
                                </td>

                                <td className="px-5 py-4">
                                  <span
                                    className={`text-sm font-semibold ${
                                      movement.quantityDelta >
                                      0
                                        ? "text-[#39975b]"
                                        : "text-[#df5c6d]"
                                    }`}
                                  >
                                    {movement.quantityDelta >
                                    0
                                      ? "+"
                                      : ""}

                                    {
                                      movement.quantityDelta
                                    }
                                  </span>
                                </td>

                                <td className="px-5 py-4 text-sm font-medium text-[#625b6c]">
                                  {
                                    movement.stockBefore
                                  }
                                </td>

                                <td className="px-5 py-4 text-sm font-semibold text-[#292430]">
                                  {
                                    movement.stockAfter
                                  }
                                </td>

                                <td className="max-w-[260px] px-5 py-4">
                                  <p className="truncate text-xs text-[#746c7d]">
                                    {movement.note ||
                                      "—"}
                                  </p>
                                </td>

                                <td className="px-5 py-4">
                                  <p className="max-w-[220px] truncate text-xs font-medium text-[#625b6c]">
                                    {
                                      movement.admin.email
                                    }
                                  </p>

                                  <p className="mt-1 text-[10px] uppercase tracking-[0.06em] text-[#aaa3b2]">
                                    {
                                      movement.admin.role
                                    }
                                  </p>
                                </td>

                                <td className="px-5 py-4">
                                  <span className="whitespace-nowrap text-xs text-[#8f8798]">
                                    {new Date(
                                      movement.createdAt
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
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* =========================
                        MOBILE HISTORY
                    ========================== */}

                    <div className="divide-y divide-[#eeeaf3] lg:hidden">
                      {movements.map(
                        (
                          movement
                        ) => (
                          <div
                            key={
                              movement.id
                            }
                            className="p-4"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <MovementBadge
                                  type={
                                    movement.type
                                  }
                                />

                                <MovementSourceBadge
                                  type={
                                    movement.type
                                  }
                                />
                              </div>

                              <span
                                className={`text-sm font-semibold ${
                                  movement.quantityDelta >
                                  0
                                    ? "text-[#39975b]"
                                    : "text-[#df5c6d]"
                                }`}
                              >
                                {movement.quantityDelta >
                                0
                                  ? "+"
                                  : ""}

                                {
                                  movement.quantityDelta
                                }
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                              <DetailItem
                                label="Before"
                                value={String(
                                  movement.stockBefore
                                )}
                              />

                              <DetailItem
                                label="After"
                                value={String(
                                  movement.stockAfter
                                )}
                              />
                            </div>

                            {movement.note && (
                              <div className="mt-4 rounded-xl bg-[#faf8ff] px-3 py-2.5">
                                <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#aaa3b2]">
                                  Note
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#625b6c]">
                                  {
                                    movement.note
                                  }
                                </p>
                              </div>
                            )}

                            <div className="mt-4 border-t border-[#f0edf3] pt-3">
                              <p className="truncate text-xs font-medium text-[#625b6c]">
                                {
                                  movement.admin.email
                                }
                              </p>

                              <p className="mt-1 text-[10px] text-[#9c95a5]">
                                {new Date(
                                  movement.createdAt
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                                        </div>

                    {/* =========================
                        HISTORY PAGINATION
                    ========================== */}

                    {historyPagination.totalPages >
                      1 && (
                      <div
                        className="
                          flex
                          flex-col
                          gap-3
                          border-t
                          border-[#eeeaf3]
                          bg-white
                          px-4
                          py-4
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                          sm:px-5
                        "
                      >
                        <p className="text-[11px] font-medium text-[#9c95a5]">
                          Page{" "}
                          <span className="font-semibold text-[#554e5e]">
                            {
                              historyPagination.page
                            }
                          </span>{" "}
                          of{" "}
                          <span className="font-semibold text-[#554e5e]">
                            {
                              historyPagination.totalPages
                            }
                          </span>
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={
                              historyPagination.page <=
                              1
                            }
                            onClick={() => {
                              setHistoryPage(
                                (currentPage) =>
                                  Math.max(
                                    1,
                                    currentPage -
                                      1
                                  )
                              );
                            }}
                            className="
                              h-9
                              rounded-xl
                              border
                              border-[#e8e3ee]
                              bg-white
                              px-3.5
                              text-[11px]
                              font-semibold
                              text-[#655e6f]
                              transition
                              hover:bg-[#faf8ff]
                              disabled:cursor-not-allowed
                              disabled:opacity-40
                            "
                          >
                            Previous
                          </button>

                          <button
                            type="button"
                            disabled={
                              historyPagination.page >=
                              historyPagination.totalPages
                            }
                            onClick={() => {
                              setHistoryPage(
                                (currentPage) =>
                                  Math.min(
                                    historyPagination.totalPages,
                                    currentPage +
                                      1
                                  )
                              );
                            }}
                            className="
                              h-9
                              rounded-xl
                              bg-[linear-gradient(135deg,#6e59ff,#8c63f5)]
                              px-3.5
                              text-[11px]
                              font-semibold
                              text-white
                              transition
                              hover:opacity-90
                              disabled:cursor-not-allowed
                              disabled:opacity-40
                            "
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </section>
            </>
          )}

        {/* =========================
            MOVEMENT MODAL
        ========================== */}

        {activeMovementType &&
          product && (
            <div
              className="
                fixed inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/30
                px-4
                backdrop-blur-[1px]
              "
              onMouseDown={(
                event
              ) => {
                if (
                  event.target ===
                  event.currentTarget
                ) {
                  closeMovementModal();
                }
              }}
            >
              <div
                className="
                  w-full
                  max-w-[440px]
                  rounded-[20px]
                  border
                  border-[#e7e1ef]
                  bg-white
                  p-5
                  shadow-[0_24px_70px_rgba(42,32,66,0.22)]
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8368e0]">
                      Inventory
                      Movement
                    </p>

                    <h3
                      className={`${headingFont} mt-1 text-[18px] font-semibold text-[#292430]`}
                    >
                      {getMovementModalTitle(
                        activeMovementType
                      )}
                    </h3>
                  </div>

                  <button
                    type="button"
                    disabled={
                      movementSaving
                    }
                    onClick={
                      closeMovementModal
                    }
                    className="
                      flex h-9 w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      text-[#9a93a3]
                      transition
                      hover:bg-[#f3efff]
                      hover:text-[#6e59ff]
                      disabled:opacity-50
                    "
                  >
                    <X
                      size={18}
                    />
                  </button>
                </div>

                <p className="mt-3 text-[12px] leading-5 text-[#8f8798]">
                  {getMovementDescription(
                    activeMovementType
                  )}
                </p>

                <div className="mt-4 rounded-xl border border-[#eee9f5] bg-[#faf8ff] px-3.5 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold text-[#554e5e]">
                        {
                          product.name
                        }
                      </p>

                      <p className="mt-1 text-[10px] text-[#9c95a5]">
                        {
                          product.sku
                        }
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.06em] text-[#aaa3b2]">
                        Current Stock
                      </p>

                      <p
                        className={`${headingFont} mt-1 text-[17px] font-semibold text-[#292430]`}
                      >
                        {
                          product.stock
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantity */}

                <div className="mt-5">
                  <label
                    htmlFor="movement-quantity"
                    className="mb-1.5 block text-[11px] font-semibold text-[#746c7d]"
                  >
                    {activeMovementType ===
                    "MANUAL_ADJUSTMENT"
                      ? "Adjustment Quantity"
                      : "Quantity"}
                  </label>

                  <input
                    id="movement-quantity"
                    type="number"
                    step={1}
                    min={
                      activeMovementType ===
                      "MANUAL_ADJUSTMENT"
                        ? undefined
                        : 1
                    }
                    value={
                      movementQuantity
                    }
                    autoFocus
                    disabled={
                      movementSaving
                    }
                    placeholder={getMovementPlaceholder(
                      activeMovementType
                    )}
                    onChange={(
                      event
                    ) => {
                      setMovementQuantity(
                        event.target
                          .value
                      );

                      if (
                        movementError
                      ) {
                        setMovementError(
                          ""
                        );
                      }
                    }}
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#e8e3ee]
                      bg-[#fbfaff]
                      px-4
                      font-sans
                      text-sm
                      text-[#2a2531]
                      outline-none
                      transition
                      placeholder:text-[#aaa4b3]
                      focus:border-[#a997ff]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#735cff]/[0.07]
                      disabled:opacity-60
                    "
                  />

                  {activeMovementType ===
                    "MANUAL_ADJUSTMENT" && (
                    <p className="mt-1.5 text-[10px] leading-4 text-[#aaa3b2]">
                      Positive adds
                      stock. Negative
                      reduces stock.
                    </p>
                  )}
                </div>

                {/* Note */}

                <div className="mt-4">
                  <label
                    htmlFor="movement-note"
                    className="mb-1.5 block text-[11px] font-semibold text-[#746c7d]"
                  >
                    Note{" "}
                    <span className="font-normal text-[#aaa3b2]">
                      (optional)
                    </span>
                  </label>

                  <textarea
                    id="movement-note"
                    rows={3}
                    maxLength={
                      500
                    }
                    value={
                      movementNote
                    }
                    disabled={
                      movementSaving
                    }
                    placeholder={getNotePlaceholder(
                      activeMovementType
                    )}
                    onChange={(
                      event
                    ) => {
                      setMovementNote(
                        event.target
                          .value
                      );

                      if (
                        movementError
                      ) {
                        setMovementError(
                          ""
                        );
                      }
                    }}
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-[#e8e3ee]
                      bg-[#fbfaff]
                      px-4 py-3
                      font-sans
                      text-sm
                      leading-5
                      text-[#2a2531]
                      outline-none
                      transition
                      placeholder:text-[#aaa4b3]
                      focus:border-[#a997ff]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#735cff]/[0.07]
                      disabled:opacity-60
                    "
                  />
                </div>

                <MovementPreview
                  type={
                    activeMovementType
                  }
                  currentStock={
                    product.stock
                  }
                  quantity={
                    movementQuantity
                  }
                />

                {movementError && (
                  <div className="mt-4 rounded-xl border border-[#f3ccd3] bg-[#fff4f5] px-3 py-2.5 text-[11px] font-medium text-[#d95c70]">
                    {
                      movementError
                    }
                  </div>
                )}

                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={
                      movementSaving
                    }
                    onClick={
                      closeMovementModal
                    }
                    className="
                      h-10
                      rounded-xl
                      border
                      border-[#e8e3ee]
                      bg-white
                      px-4
                      text-[12px]
                      font-semibold
                      text-[#655e6f]
                      hover:bg-[#faf8ff]
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      movementSaving
                    }
                    onClick={() =>
                      void submitMovement()
                    }
                    className="
                      h-10
                      rounded-xl
                      bg-[linear-gradient(135deg,#6e59ff,#8c63f5)]
                      px-4
                      text-[12px]
                      font-semibold
                      text-white
                      disabled:opacity-50
                    "
                  >
                    {movementSaving
                      ? "Saving..."
                      : getMovementButtonLabel(
                          activeMovementType
                        )}
                  </button>
                </div>
              </div>
            </div>
          )}

        {/* =========================
            THRESHOLD MODAL
        ========================== */}

        {thresholdModalOpen &&
          product && (
            <div
              className="
                fixed inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/30
                px-4
                backdrop-blur-[1px]
              "
            >
              <div className="w-full max-w-[420px] rounded-[20px] border border-[#e7e1ef] bg-white p-5 shadow-[0_24px_70px_rgba(42,32,66,0.22)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8368e0]">
                      Inventory
                      Settings
                    </p>

                    <h3
                      className={`${headingFont} mt-1 text-[18px] font-semibold text-[#292430]`}
                    >
                      Update
                      Low-Stock
                      Threshold
                    </h3>
                  </div>

                  <button
                    type="button"
                    disabled={
                      thresholdSaving
                    }
                    onClick={
                      closeThresholdModal
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9a93a3] hover:bg-[#f3efff]"
                  >
                    <X
                      size={18}
                    />
                  </button>
                </div>

                <div className="mt-5">
                  <label className="mb-1.5 block text-[11px] font-semibold text-[#746c7d]">
                    Low-Stock
                    Threshold
                  </label>

                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={
                      thresholdValue
                    }
                    onChange={(
                      event
                    ) =>
                      setThresholdValue(
                        event.target
                          .value
                      )
                    }
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-[#e8e3ee]
                      bg-[#fbfaff]
                      px-4
                      font-sans
                      text-sm
                      outline-none
                      focus:border-[#a997ff]
                    "
                  />
                </div>

                {thresholdError && (
                  <div className="mt-3 rounded-xl border border-[#f3ccd3] bg-[#fff4f5] px-3 py-2.5 text-[11px] font-medium text-[#d95c70]">
                    {
                      thresholdError
                    }
                  </div>
                )}

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={
                      thresholdSaving
                    }
                    onClick={
                      closeThresholdModal
                    }
                    className="h-10 rounded-xl border border-[#e8e3ee] px-4 text-[12px] font-semibold text-[#655e6f]"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      thresholdSaving
                    }
                    onClick={() =>
                      void saveThreshold()
                    }
                    className="h-10 rounded-xl bg-[linear-gradient(135deg,#6e59ff,#8c63f5)] px-4 text-[12px] font-semibold text-white"
                  >
                    {thresholdSaving
                      ? "Saving..."
                      : "Save Threshold"}
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  };

/* =========================
   HISTORY SUMMARY
========================= */

const HistorySummary = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#eae5f1] bg-white px-3.5 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eee9ff] text-[#6e59ff]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.07em] text-[#aaa3b2]">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[12px] font-semibold text-[#554e5e]">
          {value}
        </p>
      </div>
    </div>
  );
};

/* =========================
   ACTION BUTTON
========================= */

const InventoryActionButton = ({
  icon,
  title,
  description,
  onClick,
  variant,
}: {
  icon:
    ReactNode;

  title:
    string;

  description:
    string;

  onClick:
    () => void;

  variant:
    | "primary"
    | "danger"
    | "success"
    | "neutral";
}) => {
  const styles =
    variant === "primary"
      ? {
          box:
            "border-[#dfd7fb] bg-[#faf8ff]",

          icon:
            "bg-[#eee9ff] text-[#6e59ff]",
        }
      : variant ===
          "danger"
        ? {
            box:
              "border-[#f2d8dc] bg-[#fff8f9]",

            icon:
              "bg-[#fff0f2] text-[#df5c6d]",
          }
        : variant ===
            "success"
          ? {
              box:
                "border-[#d8ecdf] bg-[#f7fcf8]",

              icon:
                "bg-[#eaf8ef] text-[#39975b]",
            }
          : {
              box:
                "border-[#e6e1ea] bg-[#faf9fb]",

              icon:
                "bg-[#f1eef4] text-[#6f6876]",
            };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex min-h-[100px]
        items-start gap-3
        rounded-2xl
        border p-4
        text-left
        transition
        hover:-translate-y-0.5
        ${styles.box}
      `}
    >
      <div
        className={`
          flex h-9 w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${styles.icon}
        `}
      >
        {icon}
      </div>

      <div>
        <p className="text-[12px] font-semibold text-[#37313e]">
          {title}
        </p>

        <p className="mt-1 text-[10px] leading-4 text-[#98909f]">
          {description}
        </p>
      </div>
    </button>
  );
};

/* =========================
   MOVEMENT PREVIEW
========================= */

const MovementPreview = ({
  type,
  currentStock,
  quantity,
}: {
  type:
    EditableMovementType;

  currentStock:
    number;

  quantity:
    string;
}) => {
  const parsed =
    Number(
      quantity
    );

  if (
    !quantity ||
    !Number.isInteger(
      parsed
    )
  ) {
    return null;
  }

  let delta =
    0;

  if (
    type === "RECEIVE" ||
    type === "RETURN"
  ) {
    if (
      parsed <= 0
    ) {
      return null;
    }

    delta =
      parsed;
  }

  if (
    type === "DAMAGE_LOSS"
  ) {
    if (
      parsed <= 0
    ) {
      return null;
    }

    delta =
      -parsed;
  }

  if (
    type ===
    "MANUAL_ADJUSTMENT"
  ) {
    if (
      parsed === 0
    ) {
      return null;
    }

    delta =
      parsed;
  }

  const stockAfter =
    currentStock +
    delta;

  const invalid =
    stockAfter < 0;

  return (
    <div
      className={`mt-4 rounded-xl border px-4 py-3 ${
        invalid
          ? "border-[#f3ccd3] bg-[#fff4f5]"
          : "border-[#e0daf0] bg-[#faf8ff]"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#8f82b8]">
        Stock Preview
      </p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[12px] text-[#6e6676]">
          {currentStock}{" "}
          {delta > 0
            ? "+"
            : "-"}{" "}
          {Math.abs(
            delta
          )}
        </span>

        <span
          className={`text-[14px] font-semibold ${
            invalid
              ? "text-[#d95c70]"
              : delta > 0
                ? "text-[#39975b]"
                : "text-[#df873f]"
          }`}
        >
          {stockAfter}
        </span>
      </div>

      {invalid && (
        <p className="mt-2 text-[10px] font-medium text-[#d95c70]">
          This would
          result in
          negative stock.
        </p>
      )}
    </div>
  );
};

/* =========================
   SUMMARY CARD
========================= */

const SummaryCard = ({
  label,
  value,
  warning = false,
  danger = false,
}: {
  label:
    string;

  value:
    string;

  warning?:
    boolean;

  danger?:
    boolean;
}) => {
  const cardStyle =
    danger
      ? "border-[#f5d4d9] bg-[#fff6f7]"
      : warning
        ? "border-[#f6dfc8] bg-[#fff9f2]"
        : "border-[#e9e2fb] bg-[#faf8ff]";

  const valueStyle =
    danger
      ? "text-[#df5c6d]"
      : warning
        ? "text-[#df873f]"
        : "text-[#292430]";

  return (
    <div
      className={`
        min-h-[104px]
        rounded-2xl
        border
        p-4
        ${cardStyle}
      `}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9c95a5]">
        {label}
      </p>

      <p
        className={`${headingFont} mt-2 text-xl font-semibold ${valueStyle}`}
      >
        {value}
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
    <th className="whitespace-nowrap px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
      {children}
    </th>
  );
};

/* =========================
   PRODUCT STATUS
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

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles}`}
    >
      {formatProductStatus(
        status
      )}
    </span>
  );
};

/* =========================
   MOVEMENT BADGE
========================= */

const MovementBadge = ({
  type,
}: {
  type:
    MovementType;
}) => {
  const styles =
    type ===
    "RECEIVE"
      ? "bg-[#eaf8ef] text-[#39975b]"
      : type ===
          "RETURN"
        ? "bg-[#edf6ff] text-[#4b82bb]"
        : type ===
            "DAMAGE_LOSS"
          ? "bg-[#fff0f2] text-[#df5c6d]"
          : type ===
              "SALE"
            ? "bg-[#fff3e7] text-[#cf7b31]"
            : type ===
                "ORDER_CANCEL_RETURN"
              ? "bg-[#eef8f1] text-[#3d9660]"
              : "bg-[#f3efff] text-[#7661cc]";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles}`}
    >
      {formatMovementType(
        type
      )}
    </span>
  );
};

/* =========================
   MOVEMENT SOURCE
========================= */

const MovementSourceBadge = ({
  type,
}: {
  type:
    MovementType;
}) => {
  const order =
    isOrderMovement(
      type
    );

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5 py-1
        text-[10px]
        font-semibold

        ${
          order
            ? "bg-[#f3efff] text-[#6e59ff]"
            : "bg-[#f2f1f4] text-[#77707f]"
        }
      `}
    >
      {order && (
        <ShoppingBag
          size={11}
        />
      )}

      {order
        ? "Order"
        : "Admin"}
    </span>
  );
};

/* =========================
   MOBILE DETAIL
========================= */

const DetailItem = ({
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

      <p className="mt-1 text-xs font-semibold text-[#554e5e]">
        {value}
      </p>
    </div>
  );
};

export default InventoryDetail;