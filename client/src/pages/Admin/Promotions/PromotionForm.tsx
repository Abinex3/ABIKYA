import {
  ArrowLeft,
  CalendarDays,
  Check,
  Layers3,
  Percent,
  Save,
  Settings2,
  Sparkles,
Search,
X,
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

const headingFont =
  "font-['Poppins']";

const bodyFont =
  "font-['Google_Sans']";

const inputFont =
  "font-['Sora']";

  const inputClass = `
  ${inputFont}
  h-11 w-full
  rounded-xl
  border border-[#e6e1eb]
  bg-[#fbfaff]
  px-3.5
  text-[13px]
  text-[#302a37]
  outline-none
  transition-all
  placeholder:text-[#aaa3b2]
  focus:border-[#a995ff]
  focus:bg-white
  focus:ring-4
  focus:ring-[#735cff]/[0.08]
  disabled:cursor-not-allowed
  disabled:bg-[#f4f1f8]
  disabled:text-[#7c7485]
`;

const toDateTimeLocal = (
  value: string
) => {
  const date =
    new Date(value);

  const pad = (
    number: number
  ) =>
    String(number).padStart(
      2,
      "0"
    );

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(
    date.getDate()
  )}T${pad(
    date.getHours()
  )}:${pad(
    date.getMinutes()
  )}`;
};

const FormField = ({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) => (
  <div>
    <label className="mb-2 block text-[12px] font-semibold text-[#625b6a]">
      {label}

      {required && (
        <span className="ml-1 text-[#e65b6e]">
          *
        </span>
      )}
    </label>

    {children}
  </div>
);

const ApplicabilitySelector = ({
  scope,
  formData,
  lookups,
  loading,
  error,
  search,
  onSearchChange,
  disabled,
  onChange,
}: {
  scope: PromotionScope;
  formData: PromotionFormState;
  lookups: PromotionLookups;
  loading: boolean;
  error: string;
  search: string;
  onSearchChange: (
    value: string
  ) => void;
  disabled: boolean;
  onChange: (
    ids: string[]
  ) => void;
}) => {
  const isProducts =
    scope ===
    "SELECTED_PRODUCTS";

  const isCategories =
    scope ===
    "CATEGORIES";

  const selectedIds =
    isProducts
      ? formData.productIds
      : isCategories
        ? formData.categoryIds
        : formData.collectionIds;

  const options =
    isProducts
      ? lookups.products.map(
          (product) => ({
            id:
              product.id,

            name:
              product.name,

            meta: `${product.sku} • ${
              product.productType ===
              "COMBO"
                ? "Combo"
                : "Single"
            }`,
          })
        )
      : isCategories
        ? lookups.categories.map(
            (category) => ({
              id:
                category.id,

              name:
                category.name,

              meta:
                category.slug,
            })
          )
        : lookups.collections.map(
            (collection) => ({
              id:
                collection.id,

              name:
                collection.name,

              meta:
                collection.slug,
            })
          );

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const filteredOptions =
    options.filter(
      (option) =>
        option.name
          .toLowerCase()
          .includes(
            normalizedSearch
          ) ||
        option.meta
          .toLowerCase()
          .includes(
            normalizedSearch
          )
    );

  const selectedOptions =
    options.filter(
      (option) =>
        selectedIds.includes(
          option.id
        )
    );

  const toggleOption = (
    id: string
  ) => {
    if (disabled) {
      return;
    }

    if (
      selectedIds.includes(id)
    ) {
      onChange(
        selectedIds.filter(
          (selectedId) =>
            selectedId !== id
        )
      );

      return;
    }

    onChange([
      ...selectedIds,
      id,
    ]);
  };

  const title =
    isProducts
      ? "Select Products"
      : isCategories
        ? "Select Categories"
        : "Select Collections";

  const placeholder =
    isProducts
      ? "Search product or SKU..."
      : isCategories
        ? "Search category..."
        : "Search collection...";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8e3ef] bg-[#fbfaff]">
      {/* Selected */}

      {selectedOptions.length >
        0 && (
        <div className="border-b border-[#ebe6f1] p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9a92a3]">
            Selected (
            {
              selectedOptions.length
            }
            )
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedOptions.map(
              (option) => (
                <span
                  key={
                    option.id
                  }
                  className="
                    inline-flex
                    max-w-full
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-[#eee9ff]
                    px-2.5 py-1.5
                    text-[11px]
                    font-semibold
                    text-[#6954cf]
                  "
                >
                  <span className="max-w-[190px] truncate">
                    {
                      option.name
                    }
                  </span>

                  {!disabled && (
                    <button
                      type="button"
                      aria-label={`Remove ${option.name}`}
                      onClick={() =>
                        toggleOption(
                          option.id
                        )
                      }
                      className="
                        flex h-4 w-4
                        items-center
                        justify-center
                        rounded-full
                        transition
                        hover:bg-[#dcd3ff]
                      "
                    >
                      <X
                        size={
                          11
                        }
                      />
                    </button>
                  )}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* Search */}

      {!disabled && (
        <div className="border-b border-[#ebe6f1] p-3">
          <div className="relative">
            <Search
              size={15}
              className="
                pointer-events-none
                absolute left-3
                top-1/2
                -translate-y-1/2
                text-[#aaa3b2]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(
                event
              ) =>
                onSearchChange(
                  event.target
                    .value
                )
              }
              placeholder={
                placeholder
              }
              className={`
                ${inputFont}
                h-10 w-full
                rounded-xl
                border border-[#e6e1eb]
                bg-white
                pl-9 pr-3
                text-[12px]
                text-[#302a37]
                outline-none
                transition
                placeholder:text-[#aaa3b2]
                focus:border-[#a995ff]
                focus:ring-4
                focus:ring-[#735cff]/[0.07]
              `}
            />
          </div>
        </div>
      )}

      {/* Options */}

      <div className="p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold text-[#655d6d]">
            {title}
          </p>

          <span className="text-[10px] text-[#a29aaa]">
            {
              options.length
            }{" "}
            available
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-[120px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#ded5f8] border-t-[#725aff]" />

              <p className="mt-2 text-[11px] text-[#9991a2]">
                Loading options...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-[#f3ccd3] bg-[#fff4f5] px-3 py-3 text-[11px] font-medium text-[#d95c70]">
            {error}
          </div>
        ) : filteredOptions.length ===
          0 ? (
          <div className="flex min-h-[100px] items-center justify-center text-center">
            <p className="text-[11px] text-[#9991a2]">
              No matching options
              found.
            </p>
          </div>
        ) : (
          <div className="max-h-[260px] space-y-1 overflow-y-auto pr-1">
            {filteredOptions.map(
              (option) => {
                const selected =
                  selectedIds.includes(
                    option.id
                  );

                return (
                  <button
                    key={
                      option.id
                    }
                    type="button"
                    disabled={
                      disabled
                    }
                    onClick={() =>
                      toggleOption(
                        option.id
                      )
                    }
                    className={`
                      flex w-full
                      items-center
                      gap-3
                      rounded-xl
                      border px-3
                      py-2.5
                      text-left
                      transition
                      ${
                        selected
                          ? "border-[#d9cdfc] bg-[#f2edff]"
                          : "border-transparent bg-white hover:border-[#e6def8] hover:bg-[#faf8ff]"
                      }
                      disabled:cursor-default
                    `}
                  >
                    <span
                      className={`
                        flex h-5 w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-md
                        border
                        ${
                          selected
                            ? "border-[#725aff] bg-[#725aff] text-white"
                            : "border-[#dcd5e4] bg-white text-transparent"
                        }
                      `}
                    >
                      <Check
                        size={
                          12
                        }
                        strokeWidth={
                          2.5
                        }
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-semibold text-[#4f4857]">
                        {
                          option.name
                        }
                      </span>

                      <span className="mt-0.5 block truncate text-[10px] text-[#9e96a7]">
                        {
                          option.meta
                        }
                      </span>
                    </span>
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================
   TYPES
========================= */

export type PromotionFormMode =
  | "create"
  | "edit"
  | "view";

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

type PromotionFormState = {
  name: string;

  type: PromotionType;

  discountType:
    DiscountType;

  discountValue: string;

  scope:
    PromotionScope;

  startAt: string;
  endAt: string;

  isActive: boolean;

  productIds: string[];

  categoryIds: string[];

  collectionIds: string[];
};

type PromotionFormProps = {
  mode: PromotionFormMode;
  promotionId?: string;
};

type LookupProduct = {
  id: string;
  name: string;
  sku: string;
  productType:
    | "SINGLE"
    | "COMBO";
  status:
    | "DRAFT"
    | "ACTIVE";
};

type LookupCategory = {
  id: string;
  name: string;
  slug: string;
};

type LookupCollection = {
  id: string;
  name: string;
  slug: string;
};

type PromotionLookups = {
  products: LookupProduct[];
  categories: LookupCategory[];
  collections: LookupCollection[];
};

/* =========================
   INITIAL STATE
========================= */

const initialFormState:
  PromotionFormState = {
    name: "",

    type: "FESTIVAL",

    discountType:
      "PERCENTAGE",

    discountValue: "",

    scope:
      "ALL_PRODUCTS",

    startAt: "",
    endAt: "",

    isActive: true,

    productIds: [],

    categoryIds: [],

    collectionIds: [],
  };

/* =========================
   PAGE
========================= */

const PromotionForm = ({
  mode,
  promotionId,
}: PromotionFormProps) => {
  const navigate =
    useNavigate();

  const [
    formData,
    setFormData,
  ] =
    useState<PromotionFormState>(
      initialFormState
    );

//   const [
//     submitting,
//   ] = useState(false);

  const [
  lookups,
  setLookups,
] = useState<PromotionLookups>({
  products: [],
  categories: [],
  collections: [],
});

const [
  lookupsLoading,
  setLookupsLoading,
] = useState(true);

const [
  lookupError,
  setLookupError,
] = useState("");

const [
  applicabilitySearch,
  setApplicabilitySearch,
] = useState("");

const [
  submitting,
  setSubmitting,
] = useState(false);

const [
  submitError,
  setSubmitError,
] = useState("");

  const isViewMode =
    mode === "view";

  const updateField = <
    K extends keyof PromotionFormState,
  >(
    field: K,
    value:
      PromotionFormState[K]
  ) => {
    if (isViewMode) {
      return;
    }

    setFormData(
      (current) => ({
        ...current,

        [field]:
          value,
      })
    );
  };

  useEffect(() => {
  const loadLookups =
    async () => {
      try {
        setLookupsLoading(true);
        setLookupError("");

        const response =
          await fetch(
            "http://localhost:5000/api/admin/promotions/lookups",
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
              "Unable to load promotion options."
          );
        }

        setLookups({
          products:
            data.products ?? [],

          categories:
            data.categories ?? [],

          collections:
            data.collections ?? [],
        });
      } catch (error) {
        setLookupError(
          error instanceof Error
            ? error.message
            : "Unable to load promotion options."
        );
      } finally {
        setLookupsLoading(false);
      }
    };

  void loadLookups();
}, []);

const validateForm = () => {
  if (!formData.name.trim()) {
    return "Promotion name is required.";
  }

  const discountValue =
    Number(formData.discountValue);

  if (
    !Number.isFinite(discountValue) ||
    discountValue <= 0
  ) {
    return "Discount value must be greater than 0.";
  }

  if (
    formData.discountType ===
      "PERCENTAGE" &&
    discountValue > 100
  ) {
    return "Percentage discount cannot be greater than 100.";
  }

  if (!formData.startAt) {
    return "Start date is required.";
  }

  if (!formData.endAt) {
    return "End date is required.";
  }

  if (
    new Date(formData.endAt) <=
    new Date(formData.startAt)
  ) {
    return "End date must be after start date.";
  }

  if (
    formData.scope ===
      "SELECTED_PRODUCTS" &&
    formData.productIds.length === 0
  ) {
    return "Select at least one product.";
  }

  if (
    formData.scope ===
      "CATEGORIES" &&
    formData.categoryIds.length === 0
  ) {
    return "Select at least one category.";
  }

  if (
    formData.scope ===
      "COLLECTIONS" &&
    formData.collectionIds.length === 0
  ) {
    return "Select at least one collection.";
  }

  return "";
};

const createPromotion =
  async (
    isActive: boolean
  ) => {
    const validationMessage =
      validateForm();

    if (validationMessage) {
      setSubmitError(
        validationMessage
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
      setSubmitting(true);
      setSubmitError("");

      const response =
        await fetch(
          "http://localhost:5000/api/admin/promotions",
          {
            method: "POST",

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
                name:
                  formData.name.trim(),

                type:
                  formData.type,

                discountType:
                  formData.discountType,

                discountValue:
                  Number(
                    formData.discountValue
                  ),

                scope:
                  formData.scope,

                startAt:
                  new Date(
                    formData.startAt
                  ).toISOString(),

                endAt:
                  new Date(
                    formData.endAt
                  ).toISOString(),

                isActive,

                productIds:
                  formData.scope ===
                  "SELECTED_PRODUCTS"
                    ? formData.productIds
                    : [],

                categoryIds:
                  formData.scope ===
                  "CATEGORIES"
                    ? formData.categoryIds
                    : [],

                collectionIds:
                  formData.scope ===
                  "COLLECTIONS"
                    ? formData.collectionIds
                    : [],
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        const firstFieldError =
          data.errors?.fieldErrors
            ? Object.values(
                data.errors
                  .fieldErrors
              )
                .flat()
                .find(Boolean)
            : null;

        throw new Error(
          typeof firstFieldError ===
            "string"
            ? firstFieldError
            : data.message ||
                "Unable to create promotion."
        );
      }

      navigate(
        "/admin/promotions"
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to create promotion."
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
  if (
  (mode !== "edit" &&
    mode !== "view") ||
  !promotionId
) {
  return;
}

  const loadPromotion =
    async () => {
      try {
        setLookupsLoading(true);
        setSubmitError("");

        const response =
          await fetch(
            `http://localhost:5000/api/admin/promotions/${promotionId}`,
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
              "Unable to load promotion."
          );
        }

        const promotion =
          data.promotion;

        setFormData({
          name:
            promotion.name ?? "",

          type:
            promotion.type,

          discountType:
            promotion.discountType,

          discountValue:
            promotion.discountValue ?? "",

          scope:
            promotion.scope,

          startAt:
            toDateTimeLocal(
              promotion.startAt
            ),

          endAt:
            toDateTimeLocal(
              promotion.endAt
            ),

          isActive:
            promotion.isActive,

          productIds:
            (
              promotion.products ??
              []
            ).map(
              (
                product: {
                  id: string;
                }
              ) =>
                product.id
            ),

          categoryIds:
            (
              promotion.categories ??
              []
            ).map(
              (
                category: {
                  id: string;
                }
              ) =>
                category.id
            ),

          collectionIds:
            (
              promotion.collections ??
              []
            ).map(
              (
                collection: {
                  id: string;
                }
              ) =>
                collection.id
            ),
        });
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Unable to load promotion."
        );
      } finally {
        setLookupsLoading(false);
      }
    };

  void loadPromotion();
}, [
  mode,
  promotionId,
]);

const updatePromotion =
  async () => {
    if (!promotionId) {
      setSubmitError(
        "Promotion ID is missing."
      );
      return;
    }

    const validationMessage =
      validateForm();

    if (validationMessage) {
      setSubmitError(
        validationMessage
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
      setSubmitting(true);
      setSubmitError("");

      const response =
        await fetch(
          `http://localhost:5000/api/admin/promotions/${promotionId}`,
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
                name:
                  formData.name.trim(),

                type:
                  formData.type,

                discountType:
                  formData.discountType,

                discountValue:
                  Number(
                    formData.discountValue
                  ),

                scope:
                  formData.scope,

                startAt:
                  new Date(
                    formData.startAt
                  ).toISOString(),

                endAt:
                  new Date(
                    formData.endAt
                  ).toISOString(),

                isActive:
                  formData.isActive,

                productIds:
                  formData.scope ===
                  "SELECTED_PRODUCTS"
                    ? formData.productIds
                    : [],

                categoryIds:
                  formData.scope ===
                  "CATEGORIES"
                    ? formData.categoryIds
                    : [],

                collectionIds:
                  formData.scope ===
                  "COLLECTIONS"
                    ? formData.collectionIds
                    : [],
              }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        const firstFieldError =
          data.errors?.fieldErrors
            ? Object.values(
                data.errors
                  .fieldErrors
              )
                .flat()
                .find(Boolean)
            : null;

        throw new Error(
          typeof firstFieldError ===
            "string"
            ? firstFieldError
            : data.message ||
                "Unable to update promotion."
        );
      }

      navigate(
        "/admin/promotions"
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to update promotion."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full pb-12 ${bodyFont}`}
    >
      {/* =========================
          PAGE HEADER
      ========================== */}

      {submitError && (
  <div className="mb-5 rounded-xl border border-[#f3ccd3] bg-[#fff4f5] px-4 py-3 text-[12px] font-medium text-[#d95c70]">
    {submitError}
  </div>
)}

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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/promotions"
              )
            }
            className="
              flex h-10 w-10
              shrink-0 items-center
              justify-center
              rounded-xl
              border border-[#d9cbf9]
              bg-white/80
              text-[#6e59ff]
              backdrop-blur
              transition
              hover:-translate-x-0.5
              hover:bg-white
            "
          >
            <ArrowLeft
              size={18}
            />
          </button>

          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8368e0]">
              Marketing /{" "}
              {mode ===
              "view"
                ? "View Promotion"
                : mode ===
                    "edit"
                  ? "Edit Promotion"
                  : "New Promotion"}
            </p>

            <h1
              className={`${headingFont} text-[25px] font-semibold tracking-[-0.035em] text-[#241f30]`}
            >
              {mode ===
              "view"
                ? "View Promotion"
                : mode ===
                    "edit"
                  ? "Edit Promotion"
                  : "Add Promotion"}
            </h1>
          </div>
        </div>

        {mode !==
          "view" && (
          <div className="flex flex-wrap items-center gap-2">
            <button
  type="button"
  disabled={submitting}
  onClick={() => {
    if (mode === "edit") {
      void updatePromotion();
      return;
    }

    void createPromotion(false);
  }}
  className="
    inline-flex h-10
    items-center
    justify-center gap-2
    rounded-xl
    border border-[#dccbfa]
    bg-white/70
    px-4
    text-[13px]
    font-medium
    text-[#5f5568]
    backdrop-blur
    transition
    hover:bg-white
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
>
  <Save size={15} />

  {submitting
    ? mode === "edit"
      ? "Saving..."
      : "Saving..."
    : mode === "edit"
      ? "Save Changes"
      : "Save Draft"}
</button>

            {mode ===
              "create" && (
              <button
                type="button"
                onClick={() => {
  void createPromotion(true);
}}
                disabled={
                  submitting
                }
                className="
                  inline-flex h-10
                  items-center
                  justify-center gap-2
                  rounded-xl
                  bg-[linear-gradient(135deg,#6e59ff,#8c63f5)]
                  px-4
                  text-[13px]
                  font-medium
                  text-white
                  shadow-[0_9px_22px_rgba(110,89,255,0.28)]
                  transition
                  hover:-translate-y-0.5
                "
              >
                <Check
                  size={15}
                />

                Create Promotion
              </button>
            )}
          </div>
        )}
      </div>

      {/* =========================
          MAIN GRID
      ========================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.75fr)]">
        {/* LEFT */}

        <div className="space-y-5">
          <Card>
  <CardHeader
    icon={<Percent size={15} />}
    title="Promotion Details"
    description="Configure the promotion name and offer type."
  />

  <div className="space-y-4 p-5 sm:p-6">
    <FormField
      label="Promotion Name"
      required
    >
      <input
        type="text"
        value={formData.name}
        onChange={(event) =>
          updateField(
            "name",
            event.target.value
          )
        }
        placeholder="Festival Sale"
        disabled={isViewMode}
        className={inputClass}
      />
    </FormField>

    <FormField
      label="Promotion Type"
      required
    >
      <select
        value={formData.type}
        onChange={(event) =>
          updateField(
            "type",
            event.target.value as PromotionType
          )
        }
        disabled={isViewMode}
        className={inputClass}
      >
        <option value="WELCOME">
          Welcome / First Order
        </option>

        <option value="FESTIVAL">
          Festival
        </option>
      </select>
    </FormField>
  </div>
</Card>
        </div>

        <Card>
  <CardHeader
    icon={<Percent size={15} />}
    title="Discount"
    description="Choose how the discount is calculated."
  />

  <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
    <FormField
      label="Discount Type"
      required
    >
      <select
        value={formData.discountType}
        onChange={(event) =>
          updateField(
            "discountType",
            event.target.value as DiscountType
          )
        }
        disabled={isViewMode}
        className={inputClass}
      >
        <option value="PERCENTAGE">
          Percentage
        </option>

        <option value="FLAT">
          Flat Amount
        </option>
      </select>
    </FormField>

    <FormField
      label={
        formData.discountType === "PERCENTAGE"
          ? "Discount Percentage"
          : "Discount Amount"
      }
      required
    >
      <div className="relative">
        {formData.discountType === "FLAT" && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#746c7d]">
            ₹
          </span>
        )}

        <input
          type="number"
          min="0"
          step="0.01"
          value={formData.discountValue}
          onChange={(event) =>
            updateField(
              "discountValue",
              event.target.value
            )
          }
          disabled={isViewMode}
          placeholder={
            formData.discountType === "PERCENTAGE"
              ? "20"
              : "500"
          }
          className={`${inputClass} ${
            formData.discountType === "FLAT"
              ? "pl-8"
              : ""
          }`}
        />

        {formData.discountType === "PERCENTAGE" && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#746c7d]">
            %
          </span>
        )}
      </div>
    </FormField>
  </div>
</Card>

<Card>
  <CardHeader
    icon={<CalendarDays size={15} />}
    title="Schedule"
    description="Choose when this promotion starts and ends."
  />

  <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
    <FormField
      label="Start Date & Time"
      required
    >
      <input
        type="datetime-local"
        value={formData.startAt}
        onChange={(event) =>
          updateField(
            "startAt",
            event.target.value
          )
        }
        disabled={isViewMode}
        className={inputClass}
      />
    </FormField>

    <FormField
      label="End Date & Time"
      required
    >
      <input
        type="datetime-local"
        value={formData.endAt}
        onChange={(event) =>
          updateField(
            "endAt",
            event.target.value
          )
        }
        disabled={isViewMode}
        className={inputClass}
      />
    </FormField>
  </div>
</Card>

<Card>
  <CardHeader
    icon={<Layers3 size={15} />}
    title="Applicability"
    description="Choose where this promotion applies."
  />

  <div className="space-y-4 p-5 sm:p-6">
    <FormField
      label="Applies To"
      required
    >
      <select
        value={formData.scope}
        onChange={(event) => {
  const nextScope =
    event.target
      .value as PromotionScope;

  if (isViewMode) {
    return;
  }

  setFormData(
    (current) => ({
      ...current,

      scope: nextScope,

      productIds: [],
      categoryIds: [],
      collectionIds: [],
    })
  );

  setApplicabilitySearch("");
}}
        disabled={isViewMode}
        className={inputClass}
      >
        <option value="ALL_PRODUCTS">
          All Products
        </option>

        <option value="SELECTED_PRODUCTS">
          Selected Products
        </option>

        <option value="CATEGORIES">
          Categories
        </option>

        <option value="COLLECTIONS">
          Collections
        </option>
      </select>
    </FormField>

    {formData.scope === "ALL_PRODUCTS" && (
      <div className="rounded-xl border border-[#e9ddfb] bg-[#f6f0ff] p-3">
        <p className="text-[11px] font-semibold text-[#6954cf]">
          Applies to all eligible products
        </p>

        <p className="mt-1 text-[11px] leading-5 text-[#8f8798]">
          No product, category or collection selection is required.
        </p>
      </div>
    )}

    {formData.scope !==
  "ALL_PRODUCTS" && (
  <ApplicabilitySelector
    scope={formData.scope}
    formData={formData}
    lookups={lookups}
    loading={lookupsLoading}
    error={lookupError}
    search={applicabilitySearch}
    onSearchChange={
      setApplicabilitySearch
    }
    disabled={isViewMode}
    onChange={(
      ids
    ) => {
      if (
        formData.scope ===
        "SELECTED_PRODUCTS"
      ) {
        updateField(
          "productIds",
          ids
        );

        return;
      }

      if (
        formData.scope ===
        "CATEGORIES"
      ) {
        updateField(
          "categoryIds",
          ids
        );

        return;
      }

      updateField(
        "collectionIds",
        ids
      );
    }}
  />
)}
  </div>
</Card>

        {/* RIGHT */}

        <aside className="space-y-5">
          <Card>
  <CardHeader
    icon={<Settings2 size={15} />}
    title="Publish Settings"
  />

  <div className="p-5">
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#ece7f2] bg-[#fbfaff] p-3">
      <div>
        <p className="text-[12px] font-semibold text-[#5c5564]">
          Promotion Active
        </p>

        <p className="mt-0.5 text-[10px] text-[#a19aaa]">
          Enable or disable this promotion.
        </p>
      </div>

      <input
        type="checkbox"
        checked={formData.isActive}
        onChange={(event) =>
          updateField(
            "isActive",
            event.target.checked
          )
        }
        disabled={isViewMode}
        className="h-4 w-4 shrink-0 accent-[#6e59ff]"
      />
    </label>
  </div>
</Card>
        </aside>
      </div>
    </div>
  );
};

/* =========================
   SMALL COMPONENTS
========================= */

const Card = ({
  children,
}: {
  children: ReactNode;
}) => (
  <section className="overflow-hidden rounded-[18px] border border-[#e8e3ef] bg-white shadow-[0_7px_25px_rgba(56,44,84,0.035)]">
    {children}
  </section>
);

const CardHeader = ({
  icon,
  title,
  description,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
}) => (
  <div className="flex items-center gap-3 bg-[linear-gradient(135deg,#7c5cfa_0%,#6c4cf0_100%)] px-5 py-4">
    {icon && (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white/15 text-white">
        {icon}
      </div>
    )}

    <div>
      <h2
        className={`${headingFont} text-[14px] font-semibold text-white`}
      >
        {title}
      </h2>

      {description && (
        <p className="mt-0.5 text-[11px] text-white/70">
          {
            description
          }
        </p>
      )}
    </div>
  </div>
);

const OverviewRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between rounded-lg bg-[#faf7ff] px-3 py-2.5">
    <span className="text-[11px] text-[#91899a]">
      {label}
    </span>

    <span className="max-w-[150px] truncate text-[11px] font-semibold text-[#554d5d]">
      {value}
    </span>
  </div>
);

export default PromotionForm;