import {
  ArrowLeft,
  CalendarDays,
  Gift,
  Package,
  Save,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

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

type GiftLookupProduct = {
  id: string;
  name: string;
  sku: string;
  stock: number | null;
  status: ProductStatus;
  productType: ProductType;
};

type GiftRuleLookupResponse = {
  products:
    GiftLookupProduct[];

  message?: string;
};

/* =========================
   PAGE
========================= */

const AddGiftRule = () => {
  const navigate =
    useNavigate();

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
    useState(true);

  const [
    loadingError,
    setLoadingError,
  ] =
    useState("");

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
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    submitError,
    setSubmitError,
  ] =
    useState("");

  /* =========================
     LOAD LOOKUPS
  ========================= */

  useEffect(() => {
    const loadProducts =
      async () => {
        try {
          setLoadingProducts(
            true
          );

          setLoadingError(
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
          setLoadingError(
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
  }, []);

  /* =========================
     SELECTED PRODUCT
  ========================= */

  const selectedProduct =
    useMemo(
      () =>
        products.find(
          (
            product
          ) =>
            product.id ===
            giftProductId
        ) ?? null,
      [
        products,
        giftProductId,
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

      if (end <= start) {
        return "End date must be after start date.";
      }

      return "";
    };

  /* =========================
     SUBMIT
  ========================= */

  const submitGiftRule =
    async () => {
      const validationError =
        validateForm();

      if (validationError) {
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

        const response =
          await fetch(
            "http://localhost:5000/api/admin/gift-rules",
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
              "Unable to create gift rule."
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
            : "Unable to create gift rule."
        );
      } finally {
        setSaving(
          false
        );
      }
    };

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
          Add Gift Rule
        </h1>

        <p className="mt-1 text-[11px] leading-5 text-[#938b9c]">
          Create an order threshold
          and map the free product
          that should be awarded.
        </p>
      </div>

      {/* =========================
          LOAD ERROR
      ========================== */}

      {loadingError && (
        <div className="mb-5 rounded-xl border border-[#f3ccd3] bg-[#fff4f5] px-4 py-3 text-[12px] font-medium text-[#d95c70]">
          {loadingError}
        </div>
      )}

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
        {/* FORM HEADER */}

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
                Define the order
                requirement and free
                gift.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* MIN ORDER QTY */}

            <FormField
              label="Minimum Order Quantity"
              required
              description="Minimum total order quantity required before this gift rule can apply."
            >
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
                    event.target.value
                  );

                  if (
                    submitError
                  ) {
                    setSubmitError(
                      ""
                    );
                  }
                }}
                placeholder="Example: 3"
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
            </FormField>

            {/* MIN ORDER VALUE */}

            <FormField
              label="Minimum Order Value"
              description="Optional. Leave blank if only order quantity should control this rule."
            >
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
                      event.target.value
                    );

                    if (
                      submitError
                    ) {
                      setSubmitError(
                        ""
                      );
                    }
                  }}
                  placeholder="Example: 999"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-[#e8e3ee]
                    bg-[#fbfaff]
                    pl-8
                    pr-4
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
              </div>
            </FormField>

            {/* GIFT PRODUCT */}

            <div className="lg:col-span-2">
              <FormField
                label="Gift Product"
                required
                description="Only SINGLE, non-archived products are available."
              >
                {loadingProducts ? (
                  <div className="flex min-h-[110px] items-center justify-center rounded-xl border border-[#e8e3ee] bg-[#fbfaff]">
                    <div className="text-center">
                      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#ded5f8] border-t-[#725aff]" />

                      <p className="mt-2 text-[11px] text-[#91899a]">
                        Loading gift
                        products...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
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
                          event.target.value
                        );

                        if (
                          submitError
                        ) {
                          setSubmitError(
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
                        focus:border-[#a997ff]
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#735cff]/[0.07]
                        disabled:opacity-60
                      "
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

                    {products.length ===
                      0 && (
                      <div className="mt-2 rounded-xl border border-[#f0d8dc] bg-[#fff8f9] px-3 py-2.5 text-[11px] text-[#d95c70]">
                        No eligible gift
                        products are
                        available.
                      </div>
                    )}

                    {selectedProduct && (
                      <div className="mt-3 rounded-2xl border border-[#e7e1f0] bg-[#faf8ff] p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eee9ff] text-[#725aff]">
                              <Package
                                size={
                                  17
                                }
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
                                  : "Draft"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </FormField>
            </div>

            {/* GIFT QTY */}

            <FormField
              label="Gift Quantity"
              required
              description="Number of free units awarded when the rule applies."
            >
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
                    event.target.value
                  );

                  if (
                    submitError
                  ) {
                    setSubmitError(
                      ""
                    );
                  }
                }}
                placeholder="Example: 1"
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
            </FormField>

            {/* ACTIVE */}

            <FormField
              label="Rule Status"
              description="Disabled rules remain saved but do not apply."
            >
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
            </FormField>

            {/* START */}

            <FormField
              label="Start Date & Time"
              required
            >
              <div className="relative">
                <CalendarDays
                  size={
                    16
                  }
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
                      event.target.value
                    );

                    if (
                      submitError
                    ) {
                      setSubmitError(
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
                    pl-10
                    pr-4
                    font-sans
                    text-sm
                    text-[#2a2531]
                    outline-none
                    transition
                    focus:border-[#a997ff]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#735cff]/[0.07]
                    disabled:opacity-60
                  "
                />
              </div>
            </FormField>

            {/* END */}

            <FormField
              label="End Date & Time"
              required
            >
              <div className="relative">
                <CalendarDays
                  size={
                    16
                  }
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
                      event.target.value
                    );

                    if (
                      submitError
                    ) {
                      setSubmitError(
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
                    pl-10
                    pr-4
                    font-sans
                    text-sm
                    text-[#2a2531]
                    outline-none
                    transition
                    focus:border-[#a997ff]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#735cff]/[0.07]
                    disabled:opacity-60
                  "
                />
              </div>
            </FormField>
          </div>

          {/* =========================
              ERROR
          ========================== */}

          {submitError && (
            <div className="mt-5 rounded-xl border border-[#f3ccd3] bg-[#fff4f5] px-4 py-3 text-[11px] font-medium text-[#d95c70]">
              {submitError}
            </div>
          )}

          {/* =========================
              ACTIONS
          ========================== */}

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
              Cancel
            </button>

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
                ? "Creating..."
                : "Create Gift Rule"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

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
    React.ReactNode;
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

export default AddGiftRule;