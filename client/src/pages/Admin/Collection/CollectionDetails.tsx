import {
  ArrowLeft,
  Layers3,
  Pencil,
  Save,
} from "lucide-react";

import {
  useEffect,
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

type CollectionPageMode =
  | "ADD"
  | "VIEW"
  | "EDIT";

type Collection = {
  id: string;

  name: string;

  slug: string;

  description:
    | string
    | null;

  isActive: boolean;

  productCount: number;

  promotionCount: number;

  createdAt: string;

  updatedAt: string;
};

type CollectionResponse = {
  collection: Collection;

  message?: string;
};

type CollectionDetailsProps = {
  mode: CollectionPageMode;
};


/* =========================
   HELPERS
========================= */

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

const createSlug = (
  value: string
) => {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
};


/* =========================
   PAGE
========================= */

const CollectionDetails = ({
  mode,
}: CollectionDetailsProps) => {
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
     COLLECTION
  ========================= */

  const [
    loadingCollection,
    setLoadingCollection,
  ] =
    useState(
      !isAdd
    );

  const [
    currentCollection,
    setCurrentCollection,
  ] =
    useState<
      Collection | null
    >(null);


  /* =========================
     FORM
  ========================= */

  const [
    name,
    setName,
  ] = useState("");

  const [
    slug,
    setSlug,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    isActive,
    setIsActive,
  ] = useState(true);

  const [
    slugManuallyEdited,
    setSlugManuallyEdited,
  ] = useState(false);

  const [
    pageError,
    setPageError,
  ] = useState("");

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const [
    saving,
    setSaving,
  ] = useState(false);


  /* =========================
     LOAD EXISTING COLLECTION
  ========================= */

  useEffect(() => {
    if (isAdd) {
      return;
    }

    if (!id) {
      setPageError(
        "Collection ID is missing."
      );

      setLoadingCollection(
        false
      );

      return;
    }

    const loadCollection =
      async () => {
        try {
          setLoadingCollection(
            true
          );

          setPageError("");

          const response =
            await fetch(
              `http://localhost:5000/api/admin/collections/${id}`,
              {
                method: "GET",

                credentials:
                  "include",
              }
            );

          const data:
            CollectionResponse =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Unable to load collection."
            );
          }

          const collection =
            data.collection;

          setCurrentCollection(
            collection
          );

          setName(
            collection.name
          );

          setSlug(
            collection.slug
          );

          setDescription(
            collection.description ??
              ""
          );

          setIsActive(
            collection.isActive
          );

          setSlugManuallyEdited(
            true
          );
        } catch (error) {
          setPageError(
            error instanceof Error
              ? error.message
              : "Unable to load collection."
          );
        } finally {
          setLoadingCollection(
            false
          );
        }
      };

    void loadCollection();
  }, [
    id,
    isAdd,
  ]);


  /* =========================
     NAME CHANGE
  ========================= */

  const handleNameChange = (
    value: string
  ) => {
    setName(value);

    setSubmitError("");

    if (
      isAdd &&
      !slugManuallyEdited
    ) {
      setSlug(
        createSlug(value)
      );
    }
  };


  /* =========================
     SLUG CHANGE
  ========================= */

  const handleSlugChange = (
    value: string
  ) => {
    const normalized =
      createSlug(value);

    setSlug(
      normalized
    );

    setSubmitError("");

    if (isAdd) {
      setSlugManuallyEdited(
        true
      );
    }
  };


  /* =========================
     VALIDATION
  ========================= */

  const validateForm =
    () => {
      if (!name.trim()) {
        return "Collection name is required.";
      }

      if (
        name.trim().length >
        100
      ) {
        return "Collection name must be 100 characters or less.";
      }

      if (!slug.trim()) {
        return "Collection slug is required.";
      }

      if (
        slug.trim().length >
        120
      ) {
        return "Collection slug must be 120 characters or less.";
      }

      if (
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
          slug.trim()
        )
      ) {
        return "Collection slug must contain only lowercase letters, numbers, and hyphens.";
      }

      if (
        description.trim().length >
        500
      ) {
        return "Collection description must be 500 characters or less.";
      }

      return "";
    };


  /* =========================
     SUBMIT
  ========================= */

  const submitCollection =
    async () => {
      if (isView) {
        return;
      }

      if (
        isEdit &&
        !id
      ) {
        setSubmitError(
          "Collection ID is missing."
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
        setSaving(true);

        setSubmitError("");

        const endpoint =
          isAdd
            ? "http://localhost:5000/api/admin/collections"
            : `http://localhost:5000/api/admin/collections/${id}`;

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
                  name:
                    name.trim(),

                  slug:
                    slug.trim(),

                  description:
                    description.trim()
                      ? description.trim()
                      : null,

                  isActive,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              (
                isAdd
                  ? "Unable to create collection."
                  : "Unable to update collection."
              )
          );
        }

        navigate(
          "/admin/collections"
        );
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : isAdd
              ? "Unable to create collection."
              : "Unable to update collection."
        );
      } finally {
        setSaving(false);
      }
    };


  /* =========================
     PAGE TITLES
  ========================= */

  const pageTitle =
    isAdd
      ? "Add Collection"
      : isEdit
        ? "Edit Collection"
        : "View Collection";

  const pageDescription =
    isAdd
      ? "Create a curated product collection for merchandising and storefront grouping."
      : isEdit
        ? "Update this collection's name, slug, description, or status."
        : "Review the saved collection details and linked usage.";


  /* =========================
     UI
  ========================= */

  return (
    <div className="w-full pb-10 font-sans">

      {/* HEADER */}

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
                  "/admin/collections"
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

              Back to Collections
            </button>

            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8368e0]">
              Catalog
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
                    `/admin/collections/${id}/edit`
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

                Edit Collection
              </button>
            )}
        </div>
      </div>


      {/* PAGE ERROR */}

      {pageError && (
        <div className="mb-5 rounded-xl border border-[#f3ccd3] bg-[#fff4f5] px-4 py-3 text-[12px] font-medium text-[#d95c70]">
          {pageError}
        </div>
      )}


      {/* LOADING */}

      {loadingCollection && (
        <div className="flex min-h-[320px] items-center justify-center rounded-[20px] border border-[#e9e5ef] bg-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ded5f8] border-t-[#725aff]" />

            <p className="mt-3 text-[12px] text-[#91899a]">
              Loading collection...
            </p>
          </div>
        </div>
      )}


      {/* FORM */}

      {!loadingCollection &&
        !pageError && (
          <section
            className="
              rounded-[20px]
              border
              border-[#e9e5ef]
              bg-white
              shadow-[0_8px_30px_rgba(53,42,78,0.035)]
            "
          >

            {/* CARD HEADER */}

            <div className="border-b border-[#eeeaf3] p-5">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eee9ff] text-[#725aff]">
                  <Layers3
                    size={18}
                  />
                </div>

                <div>
                  <p className="text-[13px] font-semibold text-[#332d3b]">
                    Collection Details
                  </p>

                  <p className="mt-1 text-[10px] text-[#9c95a5]">
                    {isView
                      ? "Saved collection information and linked usage."
                      : "Define a collection used to group products for merchandising."}
                  </p>
                </div>

              </div>
            </div>


            <div className="p-5">

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* NAME */}

                <FormField
                  label="Collection Name"
                  required={
                    !isView
                  }
                  description={
                    !isView
                      ? "Use a short customer-friendly collection name."
                      : undefined
                  }
                >
                  {isView ? (
                    <ReadOnlyValue
                      value={name}
                    />
                  ) : (
                    <input
                      type="text"
                      value={name}
                      disabled={
                        saving
                      }
                      onChange={(
                        event
                      ) =>
                        handleNameChange(
                          event.target.value
                        )
                      }
                      placeholder="Example: New Arrivals"
                      maxLength={100}
                      className={
                        inputClass
                      }
                    />
                  )}
                </FormField>


                {/* SLUG */}

                <FormField
                  label="Slug"
                  required={
                    !isView
                  }
                  description={
                    !isView
                      ? "Used in URLs. Lowercase letters, numbers, and hyphens only."
                      : undefined
                  }
                >
                  {isView ? (
                    <ReadOnlyValue
                      value={slug}
                    />
                  ) : (
                    <input
                      type="text"
                      value={slug}
                      disabled={
                        saving
                      }
                      onChange={(
                        event
                      ) =>
                        handleSlugChange(
                          event.target.value
                        )
                      }
                      placeholder="Example: new-arrivals"
                      maxLength={120}
                      className={
                        inputClass
                      }
                    />
                  )}
                </FormField>


                {/* DESCRIPTION */}

                <div className="lg:col-span-2">
                  <FormField
                    label="Description"
                    description={
                      !isView
                        ? "Optional short explanation of this collection."
                        : undefined
                    }
                  >
                    {isView ? (
                      <ReadOnlyValue
                        value={
                          description ||
                          "No description"
                        }
                      />
                    ) : (
                      <textarea
                        value={
                          description
                        }
                        disabled={
                          saving
                        }
                        onChange={(
                          event
                        ) => {
                          setDescription(
                            event.target.value
                          );

                          setSubmitError("");
                        }}
                        placeholder="Example: Latest jewellery styles recently added to the store."
                        maxLength={500}
                        rows={5}
                        className={`
                          ${inputClass}
                          h-auto
                          min-h-[120px]
                          resize-y
                          py-3
                        `}
                      />
                    )}

                    {!isView && (
                      <p className="mt-1.5 text-right text-[10px] text-[#aaa3b2]">
                        {
                          description.length
                        }
                        /500
                      </p>
                    )}
                  </FormField>
                </div>


                {/* STATUS */}

                <FormField
                  label="Collection Status"
                  description={
                    !isView
                      ? "Inactive collections remain saved but can be excluded from active storefront use."
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
                      onClick={() => {
                        setIsActive(
                          (
                            current
                          ) =>
                            !current
                        );

                        setSubmitError("");
                      }}
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


                {/* LINKED USAGE */}

                {isView &&
                  currentCollection && (
                    <FormField
                      label="Linked Usage"
                    >
                      <div className="grid grid-cols-2 gap-3">

                        <UsageCard
                          label="Products"
                          value={
                            currentCollection
                              .productCount
                          }
                        />

                        <UsageCard
                          label="Promotions"
                          value={
                            currentCollection
                              .promotionCount
                          }
                        />

                      </div>
                    </FormField>
                  )}

              </div>


              {/* META */}

              {isView &&
                currentCollection && (
                  <div className="mt-5 grid grid-cols-1 gap-3 border-t border-[#f0edf3] pt-5 sm:grid-cols-2">

                    <ReadOnlyMeta
                      label="Created"
                      value={formatDateTime(
                        currentCollection.createdAt
                      )}
                    />

                    <ReadOnlyMeta
                      label="Last Updated"
                      value={formatDateTime(
                        currentCollection.updatedAt
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
                      "/admin/collections"
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
                      saving
                    }
                    onClick={() =>
                      void submitCollection()
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
                        ? "Create Collection"
                        : "Save Changes"}
                  </button>
                )}

              </div>

            </div>
          </section>
        )}

    </div>
  );
};


/* =========================
   INPUT CLASS
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
  label: string;

  required?: boolean;

  description?: string;

  children: ReactNode;
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
  positive = false,
}: {
  value: string;

  positive?: boolean;
}) => {
  return (
    <div
      className={`
        flex
        min-h-11
        items-center
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
      {value}
    </div>
  );
};


/* =========================
   USAGE CARD
========================= */

const UsageCard = ({
  label,
  value,
}: {
  label: string;

  value: number;
}) => {
  return (
    <div className="rounded-xl border border-[#eeeaf3] bg-[#faf8ff] px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#aaa3b2]">
        {label}
      </p>

      <p className="mt-1 text-[16px] font-semibold text-[#554e5e]">
        {value}
      </p>
    </div>
  );
};


/* =========================
   READ ONLY META
========================= */

const ReadOnlyMeta = ({
  label,
  value,
}: {
  label: string;

  value: string;
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


export default CollectionDetails;