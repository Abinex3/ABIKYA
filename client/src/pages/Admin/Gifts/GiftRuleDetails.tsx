import {
  ArrowLeft,
  CalendarDays,
  Gift,
  Package,
  Pencil,
  Save,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import type {
  ReactNode,
} from "react";

/* =========================
   TYPES
========================= */

type GiftRulePageMode =
  | "ADD"
  | "VIEW"
  | "EDIT";

type ProductStatus =
  | "DRAFT"
  | "ACTIVE"
  | "ARCHIVED";

type ProductType =
  | "SINGLE"
  | "COMBO";

type GiftLookupProduct = {
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

  giftProduct: {
    id: string;
    name: string;
    sku: string;
    stock: number | null;
    status: ProductStatus;
    productType: ProductType;
  };

  createdAt:
    string;

  updatedAt:
    string;
};

type GiftRuleLookupResponse = {
  products:
    GiftLookupProduct[];

  message?: string;
};

type GiftRuleResponse = {
  giftRule:
    GiftRule;

  message?: string;
};

type GiftRuleDetailsProps = {
  mode:
    GiftRulePageMode;
};

/* =========================
   HELPERS
========================= */

const toDateTimeLocalValue = (
  value: string
) => {
  const date =
    new Date(value);

  const offset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
        offset * 60 * 1000
    );

  return localDate
    .toISOString()
    .slice(0, 16);
};

const formatDateTime = (
  value: string
) => {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(
    new Date(value)
  );
};

/* =========================
   PAGE
========================= */

const GiftRuleDetails = ({
  mode,
}: GiftRuleDetailsProps) => {
  const navigate =
    useNavigate();

  const {
    id,
  } =
    useParams<{
      id: string;
    }>();

  const isAdd =
    mode === "ADD";

  const isView =
    mode === "VIEW";

  const isEdit =
    mode === "EDIT";

  /* =========================
     LOOKUPS
  ========================= */

  const [
    products,
    setProducts,
  ] =
    useState<
      GiftLookupProduct[]
    >([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] =
    useState(
      !isView
    );

  /* =========================
     RULE
  ========================= */

  const [
    loadingRule,
    setLoadingRule,
  ] =
    useState(
      !isAdd
    );

  const [
    currentRule,
    setCurrentRule,
  ] =
    useState<
      GiftRule | null
    >(null);

  /* =========================
     FORM
  ========================= */

  const [
    minimumOrderQuantity,
    setMinimumOrderQuantity,
  ] =
    useState("1");

  const [
    minimumOrderValue,
    setMinimumOrderValue,
  ] =
    useState("");

  const [
    giftProductId,
    setGiftProductId,
  ] =
    useState("");

  const [
    giftQuantity,
    setGiftQuantity,
  ] =
    useState("1");

  const [
    startAt,
    setStartAt,
  ] =
    useState("");

  const [
    endAt,
    setEndAt,
  ] =
    useState("");

  const [
    isActive,
    setIsActive,
  ] =
    useState(true);

  const [
    pageError,
    setPageError,
  ] =
    useState("");

  const [
    submitError,
    setSubmitError,
  ] =
    useState("");

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  /* =========================
     LOAD LOOKUPS
  ========================= */

  useEffect(() => {
    if (isView) {
      return;
    }

    const loadProducts =
      async () => {
        try {
          setLoadingProducts(
            true
          );

          setPageError(
            ""
          );

          const response =
            await fetch(
              "http://localhost:5000/api/admin/gift-rules/lookups",
              {
                method:
                  "GET",

                credentials:
                  "include",
              }
            );

          const data:
            GiftRuleLookupResponse =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Unable to load gift products."
            );
          }

          setProducts(
            data.products ??
              []
          );
        } catch (error) {
          setPageError(
            error instanceof
              Error
              ? error.message
              : "Unable to load gift products."
          );
        } finally {
          setLoadingProducts(
            false
          );
        }
      };

    void loadProducts();
  }, [isView]);

  /* =========================
     LOAD EXISTING RULE
  ========================= */

  useEffect(() => {
    if (isAdd) {
      return;
    }

    if (!id) {
      setPageError(
        "Gift rule ID is missing."
      );

      setLoadingRule(
        false
      );

      return;
    }

    const loadGiftRule =
      async () => {
        try {
          setLoadingRule(
            true
          );

          setPageError(
            ""
          );

          const response =
            await fetch(
              `http://localhost:5000/api/admin/gift-rules/${id}`,
              {
                method:
                  "GET",

                credentials:
                  "include",
              }
            );

          const data:
            GiftRuleResponse =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Unable to load gift rule."
            );
          }

          const giftRule =
            data.giftRule;

          setCurrentRule(
            giftRule
          );

          setMinimumOrderQuantity(
            String(
              giftRule.minimumOrderQuantity
            )
          );

          setMinimumOrderValue(
            giftRule.minimumOrderValue ??
              ""
          );

          setGiftProductId(
            giftRule.giftProduct.id
          );

          setGiftQuantity(
            String(
              giftRule.giftQuantity
            )
          );

          setIsActive(
            giftRule.isActive
          );

          setStartAt(
            toDateTimeLocalValue(
              giftRule.startAt
            )
          );

          setEndAt(
            toDateTimeLocalValue(
              giftRule.endAt
            )
          );
        } catch (error) {
          setPageError(
            error instanceof
              Error
              ? error.message
              : "Unable to load gift rule."
          );
        } finally {
          setLoadingRule(
            false
          );
        }
      };

    void loadGiftRule();
  }, [
    id,
    isAdd,
  ]);

  /* =========================
     SELECTED PRODUCT
  ========================= */

  const selectedProduct =
    useMemo(
      () => {
        if (
          isView &&
          currentRule
        ) {
          return currentRule
            .giftProduct;
        }

        return (
          products.find(
            (
              product
            ) =>
              product.id ===
              giftProductId
          ) ??
          currentRule?.giftProduct ??
          null
        );
      },
      [
        products,
        giftProductId,
        currentRule,
        isView,
      ]
    );

  /* =========================
     VALIDATION
  ========================= */

  const validateForm =
    () => {
      const parsedMinimumQuantity =
        Number(
          minimumOrderQuantity
        );

      const parsedGiftQuantity =
        Number(
          giftQuantity
        );

      if (
        !Number.isInteger(
          parsedMinimumQuantity
        ) ||
        parsedMinimumQuantity <
          1
      ) {
        return "Minimum order quantity must be at least 1.";
      }

      if (
        minimumOrderValue.trim()
      ) {
        const parsedOrderValue =
          Number(
            minimumOrderValue
          );

        if (
          Number.isNaN(
            parsedOrderValue
          ) ||
          parsedOrderValue < 0
        ) {
          return "Minimum order value cannot be negative.";
        }
      }

      if (!giftProductId) {
        return "Please select a gift product.";
      }

      if (
        !Number.isInteger(
          parsedGiftQuantity
        ) ||
        parsedGiftQuantity <
          1
      ) {
        return "Gift quantity must be at least 1.";
      }

      if (!startAt) {
        return "Start date and time are required.";
      }

      if (!endAt) {
        return "End date and time are required.";
      }

      const start =
        new Date(
          startAt
        ).getTime();

      const end =
        new Date(
          endAt
        ).getTime();

      if (
        Number.isNaN(start) ||
        Number.isNaN(end)
      ) {
        return "Please enter valid start and end dates.";
      }

      if (
        end <= start
      ) {
        return "End date must be after start date.";
      }

      return "";
    };

  /* =========================
     SUBMIT
  ========================= */

  const submitGiftRule =
    async () => {
      if (isView) {
        return;
      }

      if (
        isEdit &&
        !id
      ) {
        setSubmitError(
          "Gift rule ID is missing."
        );

        return;
      }

      const validationError =
        validateForm();

      if (
        validationError
      ) {
        setSubmitError(
          validationError
        );

        return;
      }

      const csrfToken =
        sessionStorage.getItem(
          "admin_csrf_token"
        );

      if (!csrfToken) {
        setSubmitError(
          "Your admin session is missing the security token. Please sign in again."
        );

        return;
      }

      try {
        setSaving(
          true
        );

        setSubmitError(
          ""
        );

        const endpoint =
          isAdd
            ? "http://localhost:5000/api/admin/gift-rules"
            : `http://localhost:5000/api/admin/gift-rules/${id}`;

        const response =
          await fetch(
            endpoint,
            {
              method:
                isAdd
                  ? "POST"
                  : "PATCH",

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
                  minimumOrderQuantity:
                    Number(
                      minimumOrderQuantity
                    ),

                  minimumOrderValue:
                    minimumOrderValue.trim()
                      ? Number(
                          minimumOrderValue
                        )
                      : null,

                  giftProductId,

                  giftQuantity:
                    Number(
                      giftQuantity
                    ),

                  isActive,

                  startAt:
                    new Date(
                      startAt
                    ).toISOString(),

                  endAt:
                    new Date(
                      endAt
                    ).toISOString(),
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              (isAdd
                ? "Unable to create gift rule."
                : "Unable to update gift rule.")
          );
        }

        navigate(
          "/admin/gifts"
        );
      } catch (error) {
        setSubmitError(
          error instanceof
            Error
            ? error.message
            : isAdd
              ? "Unable to create gift rule."
              : "Unable to update gift rule."
        );
      } finally {
        setSaving(
          false
        );
      }
    };

  /* =========================
     PAGE TITLES
  ========================= */

  const pageTitle =
    isAdd
      ? "Add Gift Rule"
      : isEdit
        ? "Edit Gift Rule"
        : "View Gift Rule";

  const pageDescription =
    isAdd
      ? "Create an order threshold and map the free product that should be awarded."
      : isEdit
        ? "Update the order conditions, gift product, schedule, or rule status."
        : "Review the order conditions and free gift configured for this rule.";

  const loading =
    loadingRule ||
    (!isView &&
      loadingProducts);

  /* =========================
     UI
  ========================= */

  return (
    <div className="w-full pb-10 font-sans">
      {/* =========================
          HEADER
      ========================== */}

      <div
        className="
          mb-6
          rounded-[20px]
          border
          border-[#e6def8]
          bg-[linear-gradient(120deg,#f4efff_0%,#ede4fd_55%,#f7f2ff_100%)]
          p-5
        "
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/gifts"
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

              Back to Gift Mapping
            </button>

            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8368e0]">
              Gift Mapping
            </p>

            <h1 className="text-[25px] font-semibold tracking-[-0.03em] text-[#211d29]">
              {pageTitle}
            </h1>

            <p className="mt-1 max-w-[560px] text-[11px] leading-5 text-[#938b9c]">
              {
                pageDescription
              }
            </p>
          </div>

          {isView &&
            id && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/admin/gifts/${id}/edit`
                  )
                }
                className="
                  inline-flex
                  h-10
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[linear-gradient(135deg,#6e59ff,#8c63f5)]
                  px-4
                  text-[12px]
                  font-semibold
                  text-white
                  shadow-[0_8px_20px_rgba(110,89,255,0.18)]
                  transition
                  hover:opacity-95
                "
              >
                <Pencil
                  size={14}
                />

                Edit Gift Rule
              </button>
            )}
        </div>
      </div>

      {/* =========================
          ERROR
      ========================== */}

      {pageError && (
        <div className="mb-5 rounded-xl border border-[#f3ccd3] bg-[#fff4f5] px-4 py-3 text-[12px] font-medium text-[#d95c70]">
          {pageError}
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
              {isAdd
                ? "Loading gift products..."
                : "Loading gift rule..."}
            </p>
          </div>
        </div>
      )}

      {!loading &&
        !pageError && (
          <>
            {/* =========================
                FORM
            ========================== */}

            <section
              className="
                rounded-[20px]
                border
                border-[#e9e5ef]
                bg-white
                shadow-[0_8px_30px_rgba(53,42,78,0.035)]
              "
            >
              {/* HEADER */}

              <div className="border-b border-[#eeeaf3] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee9ff] text-[#725aff]">
                    <Gift
                      size={18}
                    />
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold text-[#332d3b]">
                      Rule Details
                    </p>

                    <p className="mt-1 text-[10px] text-[#9c95a5]">
                      {isView
                        ? "Saved order requirement and gift configuration."
                        : "Define the order requirement and free gift."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* MINIMUM QUANTITY */}

                  <FormField
                    label="Minimum Order Quantity"
                    required={
                      !isView
                    }
                    description={
                      !isView
                        ? "Minimum total order quantity required before this gift rule can apply."
                        : undefined
                    }
                  >
                    {isView ? (
                      <ReadOnlyValue
                        value={`${minimumOrderQuantity} items`}
                      />
                    ) : (
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={
                          minimumOrderQuantity
                        }
                        disabled={
                          saving
                        }
                        onChange={(
                          event
                        ) => {
                          setMinimumOrderQuantity(
                            event.target
                              .value
                          );

                          setSubmitError(
                            ""
                          );
                        }}
                        placeholder="Example: 3"
                        className={inputClass}
                      />
                    )}
                  </FormField>

                  {/* MINIMUM VALUE */}

                  <FormField
                    label="Minimum Order Value"
                    description={
                      !isView
                        ? "Optional. Leave blank if only order quantity should control this rule."
                        : undefined
                    }
                  >
                    {isView ? (
                      <ReadOnlyValue
                        value={
                          minimumOrderValue
                            ? `₹${Number(
                                minimumOrderValue
                              ).toLocaleString(
                                "en-IN"
                              )}`
                            : "No minimum"
                        }
                      />
                    ) : (
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#8f8798]">
                          ₹
                        </span>

                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={
                            minimumOrderValue
                          }
                          disabled={
                            saving
                          }
                          onChange={(
                            event
                          ) => {
                            setMinimumOrderValue(
                              event.target
                                .value
                            );

                            setSubmitError(
                              ""
                            );
                          }}
                          placeholder="Example: 999"
                          className={`${inputClass} pl-8`}
                        />
                      </div>
                    )}
                  </FormField>

                  {/* GIFT PRODUCT */}

                  <div className="lg:col-span-2">
                    <FormField
                      label="Gift Product"
                      required={
                        !isView
                      }
                      description={
                        !isView
                          ? "Only SINGLE, non-archived products are available."
                          : undefined
                      }
                    >
                      {!isView && (
                        <select
                          value={
                            giftProductId
                          }
                          disabled={
                            saving ||
                            products.length ===
                              0
                          }
                          onChange={(
                            event
                          ) => {
                            setGiftProductId(
                              event.target
                                .value
                            );

                            setSubmitError(
                              ""
                            );
                          }}
                          className={inputClass}
                        >
                          <option value="">
                            Select gift product
                          </option>

                          {products.map(
                            (
                              product
                            ) => (
                              <option
                                key={
                                  product.id
                                }
                                value={
                                  product.id
                                }
                              >
                                {
                                  product.name
                                }{" "}
                                —{" "}
                                {
                                  product.sku
                                }
                              </option>
                            )
                          )}
                        </select>
                      )}

                      {selectedProduct && (
                        <div
                          className={`
                            rounded-2xl
                            border
                            border-[#e7e1f0]
                            bg-[#faf8ff]
                            p-4
                            ${
                              isView
                                ? ""
                                : "mt-3"
                            }
                          `}
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee9ff] text-[#725aff]">
                                <Package
                                  size={17}
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-semibold text-[#332d3b]">
                                  {
                                    selectedProduct.name
                                  }
                                </p>

                                <p className="mt-1 text-[10px] text-[#9c95a5]">
                                  {
                                    selectedProduct.sku
                                  }
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <ProductInfoBadge
                                label={`Stock ${selectedProduct.stock ?? 0}`}
                              />

                              <ProductInfoBadge
                                label={
                                  selectedProduct.status ===
                                  "ACTIVE"
                                    ? "Active"
                                    : selectedProduct.status ===
                                        "DRAFT"
                                      ? "Draft"
                                      : "Archived"
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </FormField>
                  </div>

                  {/* GIFT QUANTITY */}

                  <FormField
                    label="Gift Quantity"
                    required={
                      !isView
                    }
                    description={
                      !isView
                        ? "Number of free units awarded when the rule applies."
                        : undefined
                    }
                  >
                    {isView ? (
                      <ReadOnlyValue
                        value={`${giftQuantity} free`}
                      />
                    ) : (
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={
                          giftQuantity
                        }
                        disabled={
                          saving
                        }
                        onChange={(
                          event
                        ) => {
                          setGiftQuantity(
                            event.target
                              .value
                          );

                          setSubmitError(
                            ""
                          );
                        }}
                        placeholder="Example: 1"
                        className={inputClass}
                      />
                    )}
                  </FormField>

                  {/* RULE STATUS */}

                  <FormField
                    label="Rule Status"
                    description={
                      !isView
                        ? "Disabled rules remain saved but do not apply."
                        : undefined
                    }
                  >
                    {isView ? (
                      <ReadOnlyValue
                        value={
                          isActive
                            ? "Active"
                            : "Inactive"
                        }
                        positive={
                          isActive
                        }
                      />
                    ) : (
                      <button
                        type="button"
                        disabled={
                          saving
                        }
                        onClick={() =>
                          setIsActive(
                            (
                              current
                            ) =>
                              !current
                          )
                        }
                        className={`
                          flex
                          h-11
                          w-full
                          items-center
                          justify-between
                          rounded-xl
                          border
                          px-4
                          transition
                          disabled:opacity-60

                          ${
                            isActive
                              ? "border-[#cfe8d7] bg-[#f5fbf7]"
                              : "border-[#e8e3ee] bg-[#fbfaff]"
                          }
                        `}
                      >
                        <span
                          className={`text-[12px] font-semibold ${
                            isActive
                              ? "text-[#39975b]"
                              : "text-[#77707f]"
                          }`}
                        >
                          {isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                        <span
                          className={`
                            relative
                            h-5
                            w-9
                            rounded-full
                            transition

                            ${
                              isActive
                                ? "bg-[#6e59ff]"
                                : "bg-[#d7d2dc]"
                            }
                          `}
                        >
                          <span
                            className={`
                              absolute
                              top-0.5
                              h-4
                              w-4
                              rounded-full
                              bg-white
                              shadow-sm
                              transition

                              ${
                                isActive
                                  ? "left-[18px]"
                                  : "left-0.5"
                              }
                            `}
                          />
                        </span>
                      </button>
                    )}
                  </FormField>

                  {/* START */}

                  <FormField
                    label="Start Date & Time"
                    required={
                      !isView
                    }
                  >
                    {isView ? (
                      <ReadOnlyValue
                        value={formatDateTime(
                          currentRule!
                            .startAt
                        )}
                        icon={
                          <CalendarDays
                            size={15}
                          />
                        }
                      />
                    ) : (
                      <div className="relative">
                        <CalendarDays
                          size={16}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9f97a8]"
                        />

                        <input
                          type="datetime-local"
                          value={
                            startAt
                          }
                          disabled={
                            saving
                          }
                          onChange={(
                            event
                          ) => {
                            setStartAt(
                              event.target
                                .value
                            );

                            setSubmitError(
                              ""
                            );
                          }}
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    )}
                  </FormField>

                  {/* END */}

                  <FormField
                    label="End Date & Time"
                    required={
                      !isView
                    }
                  >
                    {isView ? (
                      <ReadOnlyValue
                        value={formatDateTime(
                          currentRule!
                            .endAt
                        )}
                        icon={
                          <CalendarDays
                            size={15}
                          />
                        }
                      />
                    ) : (
                      <div className="relative">
                        <CalendarDays
                          size={16}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9f97a8]"
                        />

                        <input
                          type="datetime-local"
                          value={
                            endAt
                          }
                          disabled={
                            saving
                          }
                          onChange={(
                            event
                          ) => {
                            setEndAt(
                              event.target
                                .value
                            );

                            setSubmitError(
                              ""
                            );
                          }}
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    )}
                  </FormField>
                </div>

                {/* META FOR VIEW */}

                {isView &&
                  currentRule && (
                    <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[#f0edf3] pt-5 sm:grid-cols-2">
                      <ReadOnlyMeta
                        label="Created"
                        value={formatDateTime(
                          currentRule.createdAt
                        )}
                      />

                      <ReadOnlyMeta
                        label="Last Updated"
                        value={formatDateTime(
                          currentRule.updatedAt
                        )}
                      />
                    </div>
                  )}

                {/* ERROR */}

                {submitError && (
                  <div className="mt-5 rounded-xl border border-[#f3ccd3] bg-[#fff4f5] px-4 py-3 text-[11px] font-medium text-[#d95c70]">
                    {submitError}
                  </div>
                )}

                {/* ACTIONS */}

                <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#f0edf3] pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={
                      saving
                    }
                    onClick={() =>
                      navigate(
                        "/admin/gifts"
                      )
                    }
                    className="
                      h-10
                      rounded-xl
                      border
                      border-[#e8e3ee]
                      bg-white
                      px-4
                      font-sans
                      text-[12px]
                      font-semibold
                      text-[#655e6f]
                      transition
                      hover:bg-[#faf8ff]
                      disabled:opacity-50
                    "
                  >
                    {isView
                      ? "Back"
                      : "Cancel"}
                  </button>

                  {!isView && (
                    <button
                      type="button"
                      disabled={
                        saving ||
                        loadingProducts
                      }
                      onClick={() =>
                        void submitGiftRule()
                      }
                      className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[linear-gradient(135deg,#6e59ff,#8c63f5)]
                        px-4
                        font-sans
                        text-[12px]
                        font-semibold
                        text-white
                        shadow-[0_8px_20px_rgba(110,89,255,0.18)]
                        transition
                        hover:opacity-95
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <Save
                        size={14}
                      />

                      {saving
                        ? isAdd
                          ? "Creating..."
                          : "Saving..."
                        : isAdd
                          ? "Create Gift Rule"
                          : "Save Changes"}
                    </button>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
    </div>
  );
};

/* =========================
   SHARED INPUT CLASS
========================= */

const inputClass =
  `
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
  `;

/* =========================
   FORM FIELD
========================= */

const FormField = ({
  label,
  required = false,
  description,
  children,
}: {
  label:
    string;

  required?:
    boolean;

  description?:
    string;

  children:
    ReactNode;
}) => {
  return (
    <div>
      <label className="mb-1.5 block font-sans text-[11px] font-semibold text-[#746c7d]">
        {label}

        {required && (
          <span className="ml-1 text-[#d95c70]">
            *
          </span>
        )}
      </label>

      {children}

      {description && (
        <p className="mt-1.5 font-sans text-[10px] leading-4 text-[#aaa3b2]">
          {description}
        </p>
      )}
    </div>
  );
};

/* =========================
   READ ONLY VALUE
========================= */

const ReadOnlyValue = ({
  value,
  icon,
  positive = false,
}: {
  value:
    string;

  icon?:
    ReactNode;

  positive?:
    boolean;
}) => {
  return (
    <div
      className={`
        flex
        min-h-11
        items-center
        gap-2
        rounded-xl
        border
        px-4
        font-sans
        text-sm
        font-medium

        ${
          positive
            ? "border-[#d8ecdf] bg-[#f7fcf8] text-[#39975b]"
            : "border-[#e8e3ee] bg-[#faf9fb] text-[#554e5e]"
        }
      `}
    >
      {icon && (
        <span className="text-[#9f97a8]">
          {icon}
        </span>
      )}

      {value}
    </div>
  );
};

/* =========================
   PRODUCT INFO BADGE
========================= */

const ProductInfoBadge = ({
  label,
}: {
  label:
    string;
}) => {
  return (
    <span className="inline-flex rounded-lg bg-white px-2.5 py-1.5 font-sans text-[10px] font-semibold text-[#766d80] shadow-[0_2px_8px_rgba(53,42,78,0.05)]">
      {label}
    </span>
  );
};

/* =========================
   READ ONLY META
========================= */

const ReadOnlyMeta = ({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) => {
  return (
    <div className="rounded-xl border border-[#eeeaf3] bg-[#faf8ff] px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#aaa3b2]">
        {label}
      </p>

      <p className="mt-1 text-[12px] font-semibold text-[#554e5e]">
        {value}
      </p>
    </div>
  );
};

export default GiftRuleDetails;