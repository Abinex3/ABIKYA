// import {
//   ArrowLeft,
//   BookMarked,
//   Check,
//   ChevronDown,
//   Gem,
//   ImagePlus,
//   Images,
//   IndianRupee,
//   Layers3,
//   Minus,
//   Package,
//   Plus,
//   Save,
//   Search,
//   Settings2,
//   Sparkles,
//   Tag,
//   Trash2,
//   X,
// } from "lucide-react";

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import type {
//   ChangeEvent,
//   ReactNode,
// } from "react";

// import { useNavigate } from "react-router-dom";

// import {
//   createProductFormSchema,
//   type ProductFormMode,
// } from "./productFormSchema";

// /* =========================
//    TYPOGRAPHY
// ========================= */

// const headingFont = "font-['Poppins']";
// const bodyFont = "font-['Google_Sans']";
// const inputFont = "font-['Sora']";

// /* =========================
//    TEMP FRONTEND LOOKUPS

//    These will be replaced by
//    backend API data later.
// ========================= */



// /* Temporary combo products */
// const comboCatalog = [
//   {
//     id: "mock-1",
//     name: "Crystal Helix Stud",
//     sku: "ABK-001",
//     stock: 24,
//   },
//   {
//     id: "mock-2",
//     name: "Classic Nose Ring",
//     sku: "ABK-002",
//     stock: 7,
//   },
//   {
//     id: "mock-3",
//     name: "Black Spike Stud",
//     sku: "ABK-003",
//     stock: 3,
//   },
//   {
//     id: "mock-4",
//     name: "Rose Gold Tragus Stud",
//     sku: "ABK-005",
//     stock: 12,
//   },
// ];

// type Category = {
//   id: string;
//   name: string;
//   slug: string;
// };

// type Collection = {
//   id: string;
//   name: string;
//   slug: string;
// };

// type Material = {
//   id: string;
//   name: string;
// };

// type Color = {
//   id: string;
//   name: string;
//   hexCode: string;
// };

// type ProductLookups = {
//   categories: Category[];
//   collections: Collection[];
//   materials: Material[];
//   colors: Color[];
// };

// type ProductType =
//   | "SINGLE"
//   | "COMBO";

// type FormState = {
//   name: string;
//   sku: string;

//   productType: ProductType;

//   jewelleryType: string;

//   shortDescription: string;
//   description: string;

//   materialId: string;
//   customMaterialName: string;

//   colorId: string;
//   customColorName: string;
//   customColorHex: string;

//   antiRust: boolean;

//   gauge: string;
//   diameter: string;

//   price: string;
//   salePrice: string;
//   stock: string;

//   status:
//     | "DRAFT"
//     | "ACTIVE"
//     | "ARCHIVED";

//   categoryIds: string[];
//   collectionIds: string[];

//   isFeatured: boolean;
//   isBestSeller: boolean;
//   isNewArrival: boolean;

//   productImage: File | null;
//   wornImage: File | null;

//   comboItems: {
//     productId: string;
//     quantity: number;
//   }[];
// };

// const initialFormState: FormState = {
//   name: "",
//   sku: "",

//   productType: "SINGLE",

//   jewelleryType: "",

//   shortDescription: "",
//   description: "",

//   materialId: "",
//   customMaterialName: "",

//   colorId: "",
//   customColorName: "",
//   customColorHex: "#6e59ff",

//   antiRust: false,

//   gauge: "",
//   diameter: "",

//   price: "",
//   salePrice: "",
//   stock: "",

//   status: "DRAFT",

//   categoryIds: [],
//   collectionIds: [],

//   isFeatured: false,
//   isBestSeller: false,
//   isNewArrival: false,

//   productImage: null,
//   wornImage: null,

//   comboItems: [],
// };

// const AddProduct = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] =
//     useState<FormState>(
//       initialFormState
//     );

// const [errors, setErrors] =
//   useState<Record<string, string>>({});

// const [lookups, setLookups] =
//   useState<ProductLookups>({
//     categories: [],
//     collections: [],
//     materials: [],
//     colors: [],
//   });

// const [lookupsLoading, setLookupsLoading] =
//   useState(true);

// const [lookupsError, setLookupsError] =
//   useState("");

//   const [comboSearch, setComboSearch] =
//     useState("");

//   const [
//   validationSuccess,
//   setValidationSuccess,
// ] = useState("");

// const [submitting, setSubmitting] =
//   useState(false);

// const [submitError, setSubmitError] =
//   useState("");

// const [submitStep, setSubmitStep] =
//   useState("");

//   const productImagePreview =
//     useObjectUrl(
//       formData.productImage
//     );

//   const wornImagePreview =
//     useObjectUrl(
//       formData.wornImage
//     );

//   /* =========================
//      FIELD HELPERS
//   ========================= */

//   const updateField = <
//     K extends keyof FormState,
//   >(
//     field: K,
//     value: FormState[K]
//   ) => {
//     setFormData((current) => ({
//       ...current,
//       [field]: value,
//     }));

//     setErrors((current) => ({
//       ...current,
//       [field]: "",
//     }));

//     setValidationSuccess("");
//   };

//   const setProductType = (
//     type: ProductType
//   ) => {
//     setFormData((current) => ({
//       ...current,
//       productType: type,

//       stock:
//         type === "COMBO"
//           ? ""
//           : current.stock,

//       comboItems:
//         type === "SINGLE"
//           ? []
//           : current.comboItems,
//     }));

//     setErrors((current) => ({
//       ...current,
//       productType: "",
//       stock: "",
//       comboItems: "",
//     }));
//   };

//   const toggleCategory = (
//     categoryId: string
//   ) => {
//     const next =
//       formData.categoryIds.includes(
//         categoryId
//       )
//         ? formData.categoryIds.filter(
//             (id) =>
//               id !== categoryId
//           )
//         : [
//             ...formData.categoryIds,
//             categoryId,
//           ];

//     updateField(
//       "categoryIds",
//       next
//     );
//   };

//   const toggleCollection = (
//     collectionId: string
//   ) => {
//     const next =
//       formData.collectionIds.includes(
//         collectionId
//       )
//         ? formData.collectionIds.filter(
//             (id) =>
//               id !== collectionId
//           )
//         : [
//             ...formData.collectionIds,
//             collectionId,
//           ];

//     updateField(
//       "collectionIds",
//       next
//     );
//   };

//   /* =========================
//      IMAGE HANDLING
//   ========================= */

//   const handleImage = (
//     event:
//       ChangeEvent<HTMLInputElement>,
//     field:
//       | "productImage"
//       | "wornImage"
//   ) => {
//     const file =
//       event.target.files?.[0];

//     if (!file) return;

//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//     ];

//     if (
//       !allowedTypes.includes(
//         file.type
//       )
//     ) {
//       setErrors((current) => ({
//         ...current,
//         [field]:
//           "Use JPG, PNG or WebP.",
//       }));

//       event.target.value = "";
//       return;
//     }

//     /* Temporary frontend limit.
//        Backend/image pipeline will
//        enforce final rules later. */
//     const maxSize =
//       10 * 1024 * 1024;

//     if (file.size > maxSize) {
//       setErrors((current) => ({
//         ...current,
//         [field]:
//           "Image must be under 10 MB.",
//       }));

//       event.target.value = "";
//       return;
//     }

//     updateField(field, file);

//     event.target.value = "";
//   };

//   /* =========================
//      COMBO BUILDER
//   ========================= */

//   const filteredComboProducts =
//     useMemo(() => {
//       const search =
//         comboSearch
//           .trim()
//           .toLowerCase();

//       if (!search) {
//         return comboCatalog;
//       }

//       return comboCatalog.filter(
//         (product) =>
//           product.name
//             .toLowerCase()
//             .includes(search) ||
//           product.sku
//             .toLowerCase()
//             .includes(search)
//       );
//     }, [comboSearch]);

//   const addComboProduct = (
//     productId: string
//   ) => {
//     if (
//       formData.comboItems.some(
//         (item) =>
//           item.productId ===
//           productId
//       )
//     ) {
//       return;
//     }

//     updateField("comboItems", [
//       ...formData.comboItems,
//       {
//         productId,
//         quantity: 1,
//       },
//     ]);
//   };

//   const removeComboProduct = (
//     productId: string
//   ) => {
//     updateField(
//       "comboItems",
//       formData.comboItems.filter(
//         (item) =>
//           item.productId !==
//           productId
//       )
//     );
//   };

//   const updateComboQuantity = (
//     productId: string,
//     quantity: number
//   ) => {
//     if (quantity < 1) {
//       return;
//     }

//     updateField(
//       "comboItems",
//       formData.comboItems.map(
//         (item) =>
//           item.productId ===
//           productId
//             ? {
//                 ...item,
//                 quantity,
//               }
//             : item
//       )
//     );
//   };

//   useEffect(() => {
//   if (
//     formData.productType === "SINGLE" &&
//     !formData.jewelleryType
//   ) {
//     updateField("sku", "");
//     return;
//   }

//   const loadSku = async () => {
//     try {
//       const params =
//         new URLSearchParams({
//           jewelleryType:
//             formData.jewelleryType || "STUD",
//           productType:
//             formData.productType,
//         });

//       const response = await fetch(
//         `http://localhost:5000/api/admin/products/next-sku?${params.toString()}`,
//         {
//           credentials: "include",
//         }
//       );

//       const data =
//         await response.json();

//       if (!response.ok) {
//         return;
//       }

//       updateField(
//         "sku",
//         data.sku
//       );
//     } catch (error) {
//       console.error(
//         "Failed to generate SKU:",
//         error
//       );
//     }
//   };

//   void loadSku();
// }, [
//   formData.jewelleryType,
//   formData.productType,
// ]);

//   useEffect(() => {
//   const loadLookups = async () => {
//     try {
//       setLookupsLoading(true);
//       setLookupsError("");

//       const response = await fetch(
//         "http://localhost:5000/api/admin/products/lookups",
//         {
//           method: "GET",
//           credentials: "include",
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message ||
//             "Unable to load product options."
//         );
//       }

//       setLookups({
//         categories: data.categories ?? [],
//         collections: data.collections ?? [],
//         materials: data.materials ?? [],
//         colors: data.colors ?? [],
//       });
//     } catch (error) {
//       setLookupsError(
//         error instanceof Error
//           ? error.message
//           : "Unable to load product options."
//       );
//     } finally {
//       setLookupsLoading(false);
//     }
//   };

//   void loadLookups();
// }, []);

//   /* =========================
//      VALIDATION
//   ========================= */

//   const validateForm = (
//     mode: ProductFormMode
//   ) => {
//     const schema =
//       createProductFormSchema(mode);

//     const result =
//       schema.safeParse(formData);

//     if (result.success) {
//       setErrors({});
//       return true;
//     }

//     const nextErrors:
//       Record<string, string> = {};

//     result.error.issues.forEach(
//       (issue) => {
//         const field =
//           String(
//             issue.path[0] ?? ""
//           );

//         if (
//           field &&
//           !nextErrors[field]
//         ) {
//           nextErrors[field] =
//             issue.message;
//         }
//       }
//     );

//     setErrors(nextErrors);

//     return false;
//   };

//   const uploadProductImage = async (
//   productId: string,
//   type: "PRODUCT" | "WORN",
//   file: File,
//   csrfToken: string
// ) => {
//   const body = new FormData();

//   body.append("image", file);

//   const response = await fetch(
//     `http://localhost:5000/api/admin/products/${productId}/images/${type}`,
//     {
//       method: "POST",
//       credentials: "include",

//       headers: {
//         "x-csrf-token": csrfToken,
//       },

//       body,
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data.message ||
//         `Unable to upload ${type.toLowerCase()} image.`
//     );
//   }

//   return data;
// };

// const activateProduct = async (
//   productId: string,
//   csrfToken: string
// ) => {
//   const response = await fetch(
//     `http://localhost:5000/api/admin/products/${productId}/status`,
//     {
//       method: "PATCH",
//       credentials: "include",

//       headers: {
//         "Content-Type": "application/json",
//         "x-csrf-token": csrfToken,
//       },

//       body: JSON.stringify({
//         status: "ACTIVE",
//       }),
//     }
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data.message ||
//         "Unable to publish product."
//     );
//   }

//   return data;
// };

// const createProduct = async (
//   mode: ProductFormMode
// ) => {
//   setValidationSuccess("");
//   setSubmitError("");
//   setSubmitStep("");

//   if (!validateForm(mode)) {
//     return;
//   }

//   const csrfToken =
//     sessionStorage.getItem(
//       "admin_csrf_token"
//     );

//   if (!csrfToken) {
//     setSubmitError(
//       "Your admin session is missing the security token. Please sign in again."
//     );

//     return;
//   }

//   const payload = {
//     name: formData.name.trim(),
//     sku: formData.sku.trim(),

//     shortDescription:
//       formData.shortDescription.trim(),

//     description:
//       formData.description.trim(),

//     productType:
//       formData.productType,

//     jewelleryType:
//       formData.jewelleryType,

//     materialId:
//       formData.materialId === "OTHER"
//         ? undefined
//         : formData.materialId,

//     customMaterialName:
//       formData.materialId === "OTHER"
//         ? formData.customMaterialName.trim()
//         : undefined,

//     colorId:
//       formData.colorId === "OTHER"
//         ? undefined
//         : formData.colorId,

//     customColorName:
//       formData.colorId === "OTHER"
//         ? formData.customColorName.trim()
//         : undefined,

//     customColorHex:
//       formData.colorId === "OTHER"
//         ? formData.customColorHex
//         : undefined,

//     antiRust:
//       formData.antiRust,

//     gauge:
//       formData.jewelleryType === "RING"
//         ? formData.gauge.trim()
//         : "",

//     diameter:
//       formData.jewelleryType === "RING"
//         ? formData.diameter.trim()
//         : "",

//     price:
//       Number(formData.price),

//     salePrice:
//       formData.salePrice === ""
//         ? null
//         : Number(formData.salePrice),

//     stock:
//       formData.productType === "SINGLE"
//         ? Number(formData.stock)
//         : null,

//     /*
//      * Always create as DRAFT first.
//      * Publishing happens only after
//      * both images upload successfully.
//      */
//     status: "DRAFT",

//     categoryIds:
//       formData.categoryIds,

//     collectionIds:
//       formData.collectionIds,

//     isFeatured:
//       formData.isFeatured,

//     isBestSeller:
//       formData.isBestSeller,

//     isNewArrival:
//       formData.isNewArrival,

//     comboItems:
//       formData.productType === "COMBO"
//         ? formData.comboItems
//         : [],
//   };

//   try {
//     setSubmitting(true);

//     setSubmitStep(
//       mode === "draft"
//         ? "Saving product..."
//         : "Creating product..."
//     );

//     const response = await fetch(
//       "http://localhost:5000/api/admin/products",
//       {
//         method: "POST",

//         credentials: "include",

//         headers: {
//           "Content-Type":
//             "application/json",

//           "x-csrf-token":
//             csrfToken,
//         },

//         body: JSON.stringify(
//           payload
//         ),
//       }
//     );

//     const data =
//       await response.json();

//     if (!response.ok) {
//       throw new Error(
//         data.message ||
//           "Unable to create product."
//       );
//     }

//     const productId =
//       data.product.id as string;

//     /*
//      * SAVE DRAFT
//      *
//      * Images are optional.
//      * If the admin selected them,
//      * upload them now.
//      */
//     if (mode === "draft") {
//       if (formData.productImage) {
//         setSubmitStep(
//           "Uploading product image..."
//         );

//         await uploadProductImage(
//           productId,
//           "PRODUCT",
//           formData.productImage,
//           csrfToken
//         );
//       }

//       if (formData.wornImage) {
//         setSubmitStep(
//           "Uploading worn image..."
//         );

//         await uploadProductImage(
//           productId,
//           "WORN",
//           formData.wornImage,
//           csrfToken
//         );
//       }

//       setSubmitStep("");

//       setValidationSuccess(
//         "Product draft saved successfully."
//       );

//       return;
//     }

//     /*
//      * PUBLISH PRODUCT
//      */

//     if (!formData.productImage) {
//       throw new Error(
//         "Product image is required."
//       );
//     }

//     if (!formData.wornImage) {
//       throw new Error(
//         "Worn image is required."
//       );
//     }

//     setSubmitStep(
//       "Uploading product image..."
//     );

//     await uploadProductImage(
//       productId,
//       "PRODUCT",
//       formData.productImage,
//       csrfToken
//     );

//     setSubmitStep(
//       "Uploading worn image..."
//     );

//     await uploadProductImage(
//       productId,
//       "WORN",
//       formData.wornImage,
//       csrfToken
//     );

//     setSubmitStep(
//       "Publishing product..."
//     );

//     await activateProduct(
//       productId,
//       csrfToken
//     );

//     setSubmitStep("");

//     setValidationSuccess(
//       "Product created successfully."
//     );

//     setTimeout(() => {
//       navigate(
//         "/admin/products",
//         {
//           replace: true,
//         }
//       );
//     }, 700);
//   } catch (error) {
//     console.error(
//       "Product creation failed:",
//       error
//     );

//     setSubmitStep("");

//     setSubmitError(
//       error instanceof Error
//         ? error.message
//         : "Unable to create product."
//     );
//   } finally {
//     setSubmitting(false);
//   }
// };

//   const handleSaveDraft = async () => {
//   await createProduct("draft");
// };

// const handlePublish = async () => {
//   await createProduct("publish");
// };

//   return (
//     <div
//       className={`w-full pb-12 ${bodyFont}`}
//     >
//       {/* =========================
//           PAGE HEADER
//       ========================== */}

//       <div
//         className="
//           mb-6 flex flex-col gap-4
//           rounded-[20px]
//           border border-[#e6def8]
//           bg-[linear-gradient(120deg,#f4efff_0%,#ede4fd_55%,#f7f2ff_100%)]
//           p-5
//           sm:flex-row
//           sm:items-center
//           sm:justify-between
//         "
//       >
//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             onClick={() =>
//               navigate(
//                 "/admin/products"
//               )
//             }
//             className="
//               flex h-10 w-10
//               shrink-0 items-center
//               justify-center
//               rounded-xl
//               border border-[#d9cbf9]
//               bg-white/80
//               text-[#6e59ff]
//               backdrop-blur
//               transition
//               hover:-translate-x-0.5
//               hover:bg-white
//             "
//           >
//             <ArrowLeft size={18} />
//           </button>

//           <div>
//             <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8368e0]">
//               Catalog / New Item
//             </p>

//             <h1
//               className={`${headingFont} text-[25px] font-semibold tracking-[-0.035em] text-[#241f30]`}
//             >
//               Add New Product
//             </h1>
//           </div>
//         </div>

//         {lookupsLoading && (
//   <div className="mb-5 rounded-xl border border-[#e7def8] bg-[#f8f4ff] px-4 py-3 text-[12px] text-[#715fc4]">
//     Loading product options...
//   </div>
// )}

// {lookupsError && (
//   <div className="mb-5 rounded-xl border border-[#f4cdd3] bg-[#fff4f5] px-4 py-3 text-[12px] text-[#d95c70]">
//     {lookupsError}
//   </div>
// )}

//         <div className="flex flex-wrap items-center gap-2">
//           <button
//             type="button"
//             onClick={
//               handleSaveDraft
//             }
//             disabled={submitting}
//             className="
//               inline-flex h-10
//               items-center
//               justify-center gap-2
//               rounded-xl
//               border border-[#dccbfa]
//               bg-white/70
//               px-4
//               text-[13px]
//               font-medium
//               text-[#5f5568]
//               backdrop-blur
//               transition
//               hover:bg-white
//             "
//           >
            

//             <Save size={15} />

// {submitting
//   ? "Please wait..."
//   : "Save Draft"}
//           </button>

//           <button
//   type="button"
//   onClick={handlePublish}
//   disabled={submitting}
//             className="
//               inline-flex h-10
//               items-center
//               justify-center gap-2
//               rounded-xl
//               bg-[linear-gradient(135deg,#6e59ff,#8c63f5)]
//               px-4
//               text-[13px]
//               font-medium
//               text-white
//               shadow-[0_9px_22px_rgba(110,89,255,0.28)]
//               transition
//               hover:-translate-y-0.5
//               hover:shadow-[0_12px_26px_rgba(110,89,255,0.34)]
//             "
//           >
//             <Check size={15} />

// {submitting
//   ? "Please wait..."
//   : "Add Product"}
//           </button>
//         </div>
//       </div>

//       {validationSuccess && (
//         <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#caefd6] bg-[#effaf3] px-4 py-3 text-[12px] text-[#378556]">
//           <Check
//             size={16}
//             className="mt-0.5 shrink-0"
//           />

//           {validationSuccess}
//         </div>
//       )}

//       {submitStep && (
//   <div className="mb-5 rounded-xl border border-[#dfd4fa] bg-[#f7f3ff] px-4 py-3 text-[12px] font-medium text-[#6954cf]">
//     {submitStep}
//   </div>
// )}

//       {submitError && (
//   <div className="mb-5 rounded-xl border border-[#f4cdd3] bg-[#fff4f5] px-4 py-3 text-[12px] font-medium text-[#d95c70]">
//     {submitError}
//   </div>
// )}

//       {/* =========================
//           PRODUCT TYPE
//       ========================== */}

//       <div className="mb-5 flex flex-wrap items-center gap-2">
//         <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9a92a3]">
//           Product Type
//         </span>

//         <TypeButton
//           active={
//             formData.productType ===
//             "SINGLE"
//           }
//           icon={
//             <Package size={14} />
//           }
//           label="Single"
//           onClick={() =>
//             setProductType(
//               "SINGLE"
//             )
//           }
//         />

//         <TypeButton
//           active={
//             formData.productType ===
//             "COMBO"
//           }
//           icon={
//             <Layers3 size={14} />
//           }
//           label="Combo"
//           onClick={() =>
//             setProductType(
//               "COMBO"
//             )
//           }
//         />
//       </div>

//       {/* =========================
//           MAIN GRID
//       ========================== */}

//       <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.75fr)]">
//         {/* LEFT */}

//         <div className="space-y-5">
//           {/* GENERAL */}

//           <Card>
//             <CardHeader
//               icon={<Tag size={15} />}
//               title="General Information"
//               description="Basic product details shown to customers."
//             />

//             <div className="space-y-4 p-5 sm:p-6">
//               <FormField
//                 label="Product Name"
//                 required
//                 error={errors.name}
//               >
//                 <input
//                   type="text"
//                   value={
//                     formData.name
//                   }
//                   onChange={(
//                     event
//                   ) =>
//                     updateField(
//                       "name",
//                       event.target
//                         .value
//                     )
//                   }
//                   placeholder="Crystal Helix Stud"
//                   className={
//                     inputClass
//                   }
//                 />
//               </FormField>

//               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                 <FormField
//                   label="SKU"
//                   required
//                   error={errors.sku}
//                 >
//                   <input
//   type="text"
//   value={formData.sku}
//   readOnly
//   placeholder="Auto-generated"
//   className={`${inputClass} cursor-not-allowed bg-[#f4f1f8] text-[#7c7485]`}
// />
//                 </FormField>

//                 <FormField
//                   label="Jewellery Type"
//                   required
//                   error={
//                     errors.jewelleryType
//                   }
//                 >
//                   <div className="relative">
//                     <select
//                       value={
//                         formData.jewelleryType
//                       }
//                       onChange={(
//                         event
//                       ) =>
//                         updateField(
//                           "jewelleryType",
//                           event
//                             .target
//                             .value
//                         )
//                       }
//                       className={`${inputClass} appearance-none pr-10`}
//                     >
//                       <option value="">
//                         Select type
//                       </option>

//                       <option value="STUD">
//                         Stud
//                       </option>

//                       <option value="RING">
//                         Ring
//                       </option>

//                       <option value="HOOP">
//                         Hoop
//                       </option>

//                       <option value="BARBELL">
//                         Barbell
//                       </option>

//                       <option value="CURVED_BARBELL">
//                         Curved Barbell
//                       </option>

//                       <option value="OTHER">
//                         Other
//                       </option>
//                     </select>

//                     <ChevronDown
//                       className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa3b2]"
//                       size={15}
//                     />
//                   </div>
//                 </FormField>
//               </div>

//               <FormField
//                 label="Short Description"
//                 required
//                 error={
//                   errors.shortDescription
//                 }
//               >
//                 <textarea
//                   rows={3}
//                   value={
//                     formData.shortDescription
//                   }
//                   onChange={(
//                     event
//                   ) =>
//                     updateField(
//                       "shortDescription",
//                       event.target
//                         .value
//                     )
//                   }
//                   placeholder="Short description used in product previews..."
//                   className={`${textareaClass} min-h-[90px]`}
//                 />
//               </FormField>

//               <FormField
//                 label="Full Description"
//                 required
//                 error={
//                   errors.description
//                 }
//               >
//                 <textarea
//                   rows={6}
//                   value={
//                     formData.description
//                   }
//                   onChange={(
//                     event
//                   ) =>
//                     updateField(
//                       "description",
//                       event.target
//                         .value
//                     )
//                   }
//                   placeholder="Write the full product description..."
//                   className={`${textareaClass} min-h-[150px]`}
//                 />
//               </FormField>
//             </div>
//           </Card>

//           {/* PRICING */}

//           <Card>
//             <CardHeader
//               icon={
//                 <IndianRupee
//                   size={15}
//                 />
//               }
//               title="Pricing & Stock"
//               description="Set regular price, sale price and inventory."
//             />

//             <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
//               <FormField
//                 label="Regular Price"
//                 required
//                 error={
//                   errors.price
//                 }
//               >
//                 <PriceInput
//                   value={
//                     formData.price
//                   }
//                   placeholder="1000"
//                   onChange={(
//                     value
//                   ) =>
//                     updateField(
//                       "price",
//                       value
//                     )
//                   }
//                 />
//               </FormField>

//               <FormField
//                 label="Sale Price"
//                 error={
//                   errors.salePrice
//                 }
//               >
//                 <PriceInput
//                   value={
//                     formData.salePrice
//                   }
//                   placeholder="500"
//                   onChange={(
//                     value
//                   ) =>
//                     updateField(
//                       "salePrice",
//                       value
//                     )
//                   }
//                 />
//               </FormField>

//               {formData.productType ===
//               "SINGLE" ? (
//                 <FormField
//                   label="Stock"
//                   required
//                   error={
//                     errors.stock
//                   }
//                 >
//                   <input
//                     type="number"
//                     min="0"
//                     step="1"
//                     value={
//                       formData.stock
//                     }
//                     onChange={(
//                       event
//                     ) =>
//                       updateField(
//                         "stock",
//                         event
//                           .target
//                           .value
//                       )
//                     }
//                     placeholder="20"
//                     className={
//                       inputClass
//                     }
//                   />
//                 </FormField>
//               ) : (
//                 <div className="rounded-xl border border-[#e9ddfb] bg-[#f6f0ff] p-3">
//                   <p className="text-[11px] font-semibold text-[#6954cf]">
//                     Combo Stock
//                   </p>

//                   <p className="mt-1 text-[11px] leading-5 text-[#8f8798]">
//                     Calculated from
//                     component stock.
//                   </p>
//                 </div>
//               )}

//               <div className="sm:col-span-3">
//                 <p className="text-[11px] text-[#9b94a3]">
//                   Sale price is
//                   optional and must
//                   be lower than the
//                   regular price.
//                 </p>
//               </div>
//             </div>
//           </Card>

//           {/* DETAILS */}

//           <Card>
//             <CardHeader
//               icon={<Gem size={15} />}
//               title="Product Details"
//               description="Material, colour and jewellery specifications."
//             />

//             <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
//               <FormField
//                 label="Material"
//                 required
//                 error={
//                   errors.materialId
//                 }
//               >
//                 <select
//                   value={
//                     formData.materialId
//                   }
//                   onChange={(
//                     event
//                   ) => {
//                     updateField(
//                       "materialId",
//                       event.target
//                         .value
//                     );

//                     if (
//                       event.target
//                         .value !==
//                       "OTHER"
//                     ) {
//                       updateField(
//                         "customMaterialName",
//                         ""
//                       );
//                     }
//                   }}
//                   className={
//                     inputClass
//                   }
//                 >
//                   <option value="">
//                     Select material
//                   </option>

//                   {lookups.materials.map((material) => (
//   <option
//     key={material.id}
//     value={material.id}
//   >
//     {material.name}
//   </option>
// ))}

//                   <option value="OTHER">
//                     Other
//                   </option>
//                 </select>
//               </FormField>

//               <FormField
//                 label="Colour"
//                 required
//                 error={
//                   errors.colorId
//                 }
//               >
//                 <select
//                   value={
//                     formData.colorId
//                   }
//                   onChange={(
//                     event
//                   ) => {
//                     updateField(
//                       "colorId",
//                       event.target
//                         .value
//                     );

//                     if (
//                       event.target
//                         .value !==
//                       "OTHER"
//                     ) {
//                       updateField(
//                         "customColorName",
//                         ""
//                       );
//                     }
//                   }}
//                   className={
//                     inputClass
//                   }
//                 >
//                   <option value="">
//                     Select colour
//                   </option>

//                   {lookups.colors.map((color) => (
//   <option
//     key={color.id}
//     value={color.id}
//   >
//     {color.name}
//   </option>
// ))}

//                   <option value="OTHER">
//                     Other
//                   </option>
//                 </select>
//               </FormField>

//               {formData.materialId ===
//                 "OTHER" && (
//                 <FormField
//                   label="New Material"
//                   required
//                   error={
//                     errors.customMaterialName
//                   }
//                 >
//                   <input
//                     type="text"
//                     value={
//                       formData.customMaterialName
//                     }
//                     onChange={(
//                       event
//                     ) =>
//                       updateField(
//                         "customMaterialName",
//                         event.target
//                           .value
//                       )
//                     }
//                     placeholder="Material name"
//                     className={
//                       inputClass
//                     }
//                   />
//                 </FormField>
//               )}

//               {formData.colorId ===
//                 "OTHER" && (
//                 <div className="grid grid-cols-[1fr_105px] gap-2">
//                   <FormField
//                     label="Colour Name"
//                     required
//                     error={
//                       errors.customColorName
//                     }
//                   >
//                     <input
//                       type="text"
//                       value={
//                         formData.customColorName
//                       }
//                       onChange={(
//                         event
//                       ) =>
//                         updateField(
//                           "customColorName",
//                           event
//                             .target
//                             .value
//                         )
//                       }
//                       placeholder="Gunmetal"
//                       className={
//                         inputClass
//                       }
//                     />
//                   </FormField>

//                   <FormField
//                     label="Hex"
//                     required
//                     error={
//                       errors.customColorHex
//                     }
//                   >
//                     <input
//                       type="color"
//                       value={
//                         formData.customColorHex
//                       }
//                       onChange={(
//                         event
//                       ) =>
//                         updateField(
//                           "customColorHex",
//                           event
//                             .target
//                             .value
//                         )
//                       }
//                       className="h-11 w-full cursor-pointer rounded-xl border border-[#e6e1eb] bg-[#fbfaff] p-1.5"
//                     />
//                   </FormField>
//                 </div>
//               )}

//               <div>
//                 <p className="mb-2 text-[12px] font-semibold text-[#5f5867]">
//                   Anti-Rust
//                 </p>

//                 <label className="flex h-11 cursor-pointer items-center justify-between rounded-xl border border-[#e6e1eb] bg-[#fbfaff] px-3.5">
//                   <span className="text-[13px] text-[#625b6b]">
//                     Anti-rust
//                     product
//                   </span>

//                   <input
//                     type="checkbox"
//                     checked={
//                       formData.antiRust
//                     }
//                     onChange={(
//                       event
//                     ) =>
//                       updateField(
//                         "antiRust",
//                         event
//                           .target
//                           .checked
//                       )
//                     }
//                     className="h-4 w-4 accent-[#6e59ff]"
//                   />
//                 </label>
//               </div>

//               {formData.jewelleryType ===
//                 "RING" && (
//                 <>
//                   <FormField label="Gauge">
//                     <input
//                       type="text"
//                       value={
//                         formData.gauge
//                       }
//                       onChange={(
//                         event
//                       ) =>
//                         updateField(
//                           "gauge",
//                           event
//                             .target
//                             .value
//                         )
//                       }
//                       placeholder="Example: 16G"
//                       className={
//                         inputClass
//                       }
//                     />
//                   </FormField>

//                   <FormField label="Diameter">
//                     <input
//                       type="text"
//                       value={
//                         formData.diameter
//                       }
//                       onChange={(
//                         event
//                       ) =>
//                         updateField(
//                           "diameter",
//                           event
//                             .target
//                             .value
//                         )
//                       }
//                       placeholder="Example: 8mm"
//                       className={
//                         inputClass
//                       }
//                     />
//                   </FormField>
//                 </>
//               )}
//             </div>
//           </Card>

//           {/* CATEGORIES */}

//           <Card>
//             <CardHeader
//               icon={
//                 <Layers3
//                   size={15}
//                 />
//               }
//               title="Piercing Categories"
//               description="A product can appear under multiple piercing locations."
//             />

//             <div className="p-5 sm:p-6">
//               <div className="flex flex-wrap gap-2">
//                 {lookups.categories.map((category) => {
//                     const active =
//                       formData.categoryIds.includes(
//                         category.id
//                       );

//                     return (
//                       <button
//                         key={
//                           category.id
//                         }
//                         type="button"
//                         onClick={() =>
//                           toggleCategory(
//                             category.id
//                           )
//                         }
//                         className={`
//                           inline-flex h-9 items-center gap-1.5
//                           rounded-xl border px-3
//                           text-[12px] font-medium
//                           transition-all
//                           ${
//                             active
//                               ? "border-[#c6b4fb] bg-[#ede4ff] text-[#6852d8]"
//                               : "border-[#e8e3ed] bg-white text-[#746d7b] hover:bg-[#faf8ff]"
//                           }
//                         `}
//                       >
//                         {active && (
//                           <Check
//                             size={
//                               13
//                             }
//                           />
//                         )}

//                         {
//                           category.name
//                         }
//                       </button>
//                     );
//                   }
//                 )}
//               </div>

//               {errors.categoryIds && (
//                 <ErrorText>
//                   {
//                     errors.categoryIds
//                   }
//                 </ErrorText>
//               )}
//             </div>
//           </Card>

//           {/* COLLECTIONS */}

//           <Card>
//             <CardHeader
//               icon={
//                 <BookMarked
//                   size={15}
//                 />
//               }
//               title="Collections"
//               description="Choose the customer showcase sections for this product."
//             />

//             <div className="flex flex-wrap gap-2 p-5 sm:p-6">
//               {lookups.collections.map((collection) => {
//                   const active =
//                     formData.collectionIds.includes(
//                       collection.id
//                     );

//                   return (
//                     <button
//                       key={
//                         collection.id
//                       }
//                       type="button"
//                       onClick={() =>
//                         toggleCollection(
//                           collection.id
//                         )
//                       }
//                       className={`
//                         inline-flex h-9 items-center gap-1.5
//                         rounded-xl border px-3
//                         text-[12px] font-medium
//                         transition-all
//                         ${
//                           active
//                             ? "border-[#c6b4fb] bg-[#ede4ff] text-[#6852d8]"
//                             : "border-[#e8e3ed] bg-white text-[#746d7b] hover:bg-[#faf8ff]"
//                         }
//                       `}
//                     >
//                       {active && (
//                         <Check
//                           size={13}
//                         />
//                       )}

//                       {
//                         collection.name
//                       }
//                     </button>
//                   );
//                 }
//               )}
//             </div>
//           </Card>

//           {/* COMBO */}

//           {formData.productType ===
//             "COMBO" && (
//             <Card>
//               <CardHeader
//                 icon={
//                   <Layers3
//                     size={15}
//                   />
//                 }
//                 title="Combo Products"
//                 description="Choose existing single products and quantities."
//               />

//               <div className="space-y-4 p-5 sm:p-6">
//                 <div className="relative">
//                   <Search
//                     size={15}
//                     className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aaa3b2]"
//                   />

//                   <input
//                     type="text"
//                     value={
//                       comboSearch
//                     }
//                     onChange={(
//                       event
//                     ) =>
//                       setComboSearch(
//                         event
//                           .target
//                           .value
//                       )
//                     }
//                     placeholder="Search product or SKU..."
//                     className={`${inputClass} pl-10`}
//                   />
//                 </div>

//                 <div className="grid gap-2">
//                   {filteredComboProducts.map(
//                     (product) => {
//                       const added =
//                         formData.comboItems.some(
//                           (
//                             item
//                           ) =>
//                             item.productId ===
//                             product.id
//                         );

//                       return (
//                         <div
//                           key={
//                             product.id
//                           }
//                           className="flex items-center justify-between gap-3 rounded-xl border border-[#ece5f5] bg-[#fbf9ff] p-3"
//                         >
//                           <div className="min-w-0">
//                             <p className="truncate text-[12px] font-semibold text-[#514959]">
//                               {
//                                 product.name
//                               }
//                             </p>

//                             <p className="mt-0.5 text-[10px] text-[#9d95a5]">
//                               {
//                                 product.sku
//                               }{" "}
//                               • Stock{" "}
//                               {
//                                 product.stock
//                               }
//                             </p>
//                           </div>

//                           <button
//                             type="button"
//                             disabled={
//                               added
//                             }
//                             onClick={() =>
//                               addComboProduct(
//                                 product.id
//                               )
//                             }
//                             className={`
//                               inline-flex h-8 shrink-0 items-center gap-1.5
//                               rounded-lg px-3
//                               text-[11px] font-semibold
//                               ${
//                                 added
//                                   ? "cursor-default bg-[#edf8f1] text-[#4a9a67]"
//                                   : "bg-[#eee4ff] text-[#6750d4] hover:bg-[#e4d5ff]"
//                               }
//                             `}
//                           >
//                             {added ? (
//                               <>
//                                 <Check
//                                   size={
//                                     13
//                                   }
//                                 />
//                                 Added
//                               </>
//                             ) : (
//                               <>
//                                 <Plus
//                                   size={
//                                     13
//                                   }
//                                 />
//                                 Add
//                               </>
//                             )}
//                           </button>
//                         </div>
//                       );
//                     }
//                   )}
//                 </div>

//                 {formData.comboItems.length >
//                   0 && (
//                   <div className="space-y-2 border-t border-[#eee8f5] pt-4">
//                     <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#938b9b]">
//                       Combo Contents
//                     </p>

//                     {formData.comboItems.map(
//                       (item) => {
//                         const product =
//                           comboCatalog.find(
//                             (
//                               candidate
//                             ) =>
//                               candidate.id ===
//                               item.productId
//                           );

//                         if (
//                           !product
//                         ) {
//                           return null;
//                         }

//                         return (
//                           <div
//                             key={
//                               item.productId
//                             }
//                             className="flex flex-col gap-3 rounded-xl border border-[#e8e1f1] bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
//                           >
//                             <div className="min-w-0">
//                               <p className="truncate text-[12px] font-semibold text-[#514959]">
//                                 {
//                                   product.name
//                                 }
//                               </p>

//                               <p className="mt-0.5 text-[10px] text-[#9d95a5]">
//                                 {
//                                   product.sku
//                                 }
//                               </p>
//                             </div>

//                             <div className="flex items-center gap-2">
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   updateComboQuantity(
//                                     item.productId,
//                                     item.quantity -
//                                       1
//                                   )
//                                 }
//                                 className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5deed] text-[#766d7f]"
//                               >
//                                 <Minus
//                                   size={
//                                     13
//                                   }
//                                 />
//                               </button>

//                               <span className="w-8 text-center text-[12px] font-semibold text-[#504758]">
//                                 {
//                                   item.quantity
//                                 }
//                               </span>

//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   updateComboQuantity(
//                                     item.productId,
//                                     item.quantity +
//                                       1
//                                   )
//                                 }
//                                 className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5deed] text-[#766d7f]"
//                               >
//                                 <Plus
//                                   size={
//                                     13
//                                   }
//                                 />
//                               </button>

//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   removeComboProduct(
//                                     item.productId
//                                   )
//                                 }
//                                 className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff0f2] text-[#e65b6e]"
//                               >
//                                 <Trash2
//                                   size={
//                                     13
//                                   }
//                                 />
//                               </button>
//                             </div>
//                           </div>
//                         );
//                       }
//                     )}
//                   </div>
//                 )}

//                 {errors.comboItems && (
//                   <ErrorText>
//                     {
//                       errors.comboItems
//                     }
//                   </ErrorText>
//                 )}
//               </div>
//             </Card>
//           )}
//         </div>

//         {/* RIGHT */}

//         <aside className="space-y-5">
//           <Card>
//             <CardHeader
//               icon={
//                 <Images size={15} />
//               }
//               title="Product Images"
//               description="Both images are required before publishing."
//             />

//             <div className="space-y-5 p-5">
//               <ImageUploader
//                 title="Product Image"
//                 subtitle="Clean product image"
//                 preview={
//                   productImagePreview
//                 }
//                 error={
//                   errors.productImage
//                 }
//                 onChange={(
//                   event
//                 ) =>
//                   handleImage(
//                     event,
//                     "productImage"
//                   )
//                 }
//                 onRemove={() =>
//                   updateField(
//                     "productImage",
//                     null
//                   )
//                 }
//               />

//               <ImageUploader
//                 title="Worn Image"
//                 subtitle="Product being worn"
//                 preview={
//                   wornImagePreview
//                 }
//                 error={
//                   errors.wornImage
//                 }
//                 onChange={(
//                   event
//                 ) =>
//                   handleImage(
//                     event,
//                     "wornImage"
//                   )
//                 }
//                 onRemove={() =>
//                   updateField(
//                     "wornImage",
//                     null
//                   )
//                 }
//               />

//               <div className="rounded-xl border border-[#ece2fc] bg-[#f8f4ff] p-3">
//                 <p className="text-[10px] leading-5 text-[#867e91]">
//                   JPG, PNG or WebP.
//                   Maximum frontend
//                   selection size is
//                   currently 10 MB.
//                   Compression and
//                   WebP processing
//                   will be implemented
//                   in the image
//                   backend flow.
//                 </p>
//               </div>
//             </div>
//           </Card>

//           <Card>
//             <CardHeader
//               icon={
//                 <Settings2
//                   size={15}
//                 />
//               }
//               title="Publish Settings"
//             />

//             <div className="space-y-4 p-5">
//               <FormField label="Status">
//                 <select
//                   value={
//                     formData.status
//                   }
//                   onChange={(
//                     event
//                   ) =>
//                     updateField(
//                       "status",
//                       event
//                         .target
//                         .value as FormState["status"]
//                     )
//                   }
//                   className={
//                     inputClass
//                   }
//                 >
//                   <option value="DRAFT">
//                     Draft
//                   </option>

//                   <option value="ACTIVE">
//                     Active
//                   </option>

//                   <option value="ARCHIVED">
//                     Archived
//                   </option>
//                 </select>
//               </FormField>

//               <ToggleOption
//                 title="Featured"
//                 description="Highlight this product."
//                 checked={
//                   formData.isFeatured
//                 }
//                 onChange={(
//                   value
//                 ) =>
//                   updateField(
//                     "isFeatured",
//                     value
//                   )
//                 }
//               />

//               <ToggleOption
//                 title="Best Seller"
//                 description="Mark as best seller."
//                 checked={
//                   formData.isBestSeller
//                 }
//                 onChange={(
//                   value
//                 ) =>
//                   updateField(
//                     "isBestSeller",
//                     value
//                   )
//                 }
//               />

//               <ToggleOption
//                 title="New Arrival"
//                 description="Show as a new product."
//                 checked={
//                   formData.isNewArrival
//                 }
//                 onChange={(
//                   value
//                 ) =>
//                   updateField(
//                     "isNewArrival",
//                     value
//                   )
//                 }
//               />
//             </div>
//           </Card>

//           <Card>
//             <div className="rounded-t-[18px] bg-[linear-gradient(135deg,#7c5cfa_0%,#6c4cf0_100%)] p-5">
//               <div className="flex items-center gap-2">
//                 <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white">
//                   <Sparkles
//                     size={15}
//                   />
//                 </div>

//                 <h3
//                   className={`${headingFont} text-[13px] font-semibold text-white`}
//                 >
//                   Product Overview
//                 </h3>
//               </div>
//             </div>

//             <div className="space-y-2.5 p-5 pt-4">
//               <OverviewRow
//                 label="Type"
//                 value={
//                   formData.productType ===
//                   "COMBO"
//                     ? "Combo"
//                     : "Single"
//                 }
//               />

//               <OverviewRow
//                 label="Jewellery"
//                 value={
//                   formData.jewelleryType ||
//                   "—"
//                 }
//               />

//               <OverviewRow
//                 label="Categories"
//                 value={String(
//                   formData
//                     .categoryIds
//                     .length
//                 )}
//               />

//               <OverviewRow
//                 label="Collections"
//                 value={String(
//                   formData
//                     .collectionIds
//                     .length
//                 )}
//               />

//               <OverviewRow
//                 label="Images"
//                 value={`${
//                   Number(
//                     !!formData.productImage
//                   ) +
//                   Number(
//                     !!formData.wornImage
//                   )
//                 } / 2`}
//               />

//               {formData.productType ===
//                 "COMBO" && (
//                 <OverviewRow
//                   label="Combo Items"
//                   value={String(
//                     formData
//                       .comboItems
//                       .length
//                   )}
//                 />
//               )}
//             </div>
//           </Card>
//         </aside>
//       </div>
//     </div>
//   );
// };

// /* =========================
//    OBJECT URL HOOK
// ========================= */

// const useObjectUrl = (
//   file: File | null
// ) => {
//   const [url, setUrl] =
//     useState<string | null>(
//       null
//     );

//   useEffect(() => {
//     if (!file) {
//       setUrl(null);
//       return;
//     }

    

//     const nextUrl =
//       URL.createObjectURL(file);

//     setUrl(nextUrl);

//     return () => {
//       URL.revokeObjectURL(
//         nextUrl
//       );
//     };
//   }, [file]);

//   return url;
// };

// /* =========================
//    STYLE TOKENS
// ========================= */

// const inputClass = `
//   ${inputFont}
//   h-11 w-full
//   rounded-xl
//   border border-[#e6e1eb]
//   bg-[#fbfaff]
//   px-3.5
//   text-[13px]
//   text-[#302a37]
//   outline-none
//   transition-all
//   placeholder:text-[#aaa3b2]
//   focus:border-[#a995ff]
//   focus:bg-white
//   focus:ring-4
//   focus:ring-[#735cff]/[0.08]
// `;

// const textareaClass = `
//   ${inputFont}
//   w-full
//   rounded-xl
//   border border-[#e6e1eb]
//   bg-[#fbfaff]
//   px-3.5 py-3
//   text-[13px]
//   leading-6
//   text-[#302a37]
//   outline-none
//   transition-all
//   resize-y
//   placeholder:text-[#aaa3b2]
//   focus:border-[#a995ff]
//   focus:bg-white
//   focus:ring-4
//   focus:ring-[#735cff]/[0.08]
// `;

// /* =========================
//    SMALL COMPONENTS
// ========================= */

// const Card = ({
//   children,
// }: {
//   children: ReactNode;
// }) => (
//   <section className="overflow-hidden rounded-[18px] border border-[#e8e3ef] bg-white shadow-[0_7px_25px_rgba(56,44,84,0.035)]">
//     {children}
//   </section>
// );

// const CardHeader = ({
//   icon,
//   title,
//   description,
// }: {
//   icon?: ReactNode;
//   title: string;
//   description?: string;
// }) => (
//   <div className="flex items-center gap-3 bg-[linear-gradient(135deg,#7c5cfa_0%,#6c4cf0_100%)] px-5 py-4">
//     {icon && (
//       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white/15 text-white">
//         {icon}
//       </div>
//     )}

//     <div>
//       <h2
//         className={`${headingFont} text-[14px] font-semibold text-white`}
//       >
//         {title}
//       </h2>

//       {description && (
//         <p className="mt-0.5 text-[11px] text-white/70">
//           {description}
//         </p>
//       )}
//     </div>
//   </div>
// );

// const FormField = ({
//   label,
//   children,
//   required,
//   error,
// }: {
//   label: string;
//   children: ReactNode;
//   required?: boolean;
//   error?: string;
// }) => (
//   <div>
//     <label className="mb-2 block text-[12px] font-semibold text-[#625b6a]">
//       {label}

//       {required && (
//         <span className="ml-1 text-[#e65b6e]">
//           *
//         </span>
//       )}
//     </label>

//     {children}

//     {error && (
//       <ErrorText>
//         {error}
//       </ErrorText>
//     )}
//   </div>
// );

// const ErrorText = ({
//   children,
// }: {
//   children: ReactNode;
// }) => (
//   <p className="mt-1.5 flex items-start gap-1 text-[11px] font-medium text-[#e65b6e]">
//     {children}
//   </p>
// );

// const PriceInput = ({
//   value,
//   placeholder,
//   onChange,
// }: {
//   value: string;
//   placeholder: string;
//   onChange: (
//     value: string
//   ) => void;
// }) => (
//   <div className="relative">
//     <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#746c7d]">
//       ₹
//     </span>

//     <input
//       type="number"
//       min="0"
//       step="0.01"
//       value={value}
//       onChange={(event) =>
//         onChange(
//           event.target.value
//         )
//       }
//       placeholder={placeholder}
//       className={`${inputClass} pl-8`}
//     />
//   </div>
// );

// const TypeButton = ({
//   active,
//   icon,
//   label,
//   onClick,
// }: {
//   active: boolean;
//   icon: ReactNode;
//   label: string;
//   onClick: () => void;
// }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className={`
//       inline-flex h-8
//       items-center gap-1.5
//       rounded-lg border px-3
//       text-[11px] font-semibold
//       transition
//       ${
//         active
//           ? "border-[#c6b4fb] bg-[#ede4ff] text-[#674fd9]"
//           : "border-[#e5dfeb] bg-white text-[#7b7482]"
//       }
//     `}
//   >
//     {icon}
//     {label}
//   </button>
// );

// const ToggleOption = ({
//   title,
//   description,
//   checked,
//   onChange,
// }: {
//   title: string;
//   description: string;
//   checked: boolean;
//   onChange: (
//     checked: boolean
//   ) => void;
// }) => (
//   <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#ece7f2] bg-[#fbfaff] p-3 transition hover:border-[#d9cbf9]">
//     <div>
//       <p className="text-[12px] font-semibold text-[#5c5564]">
//         {title}
//       </p>

//       <p className="mt-0.5 text-[10px] text-[#a19aaa]">
//         {description}
//       </p>
//     </div>

//     <input
//       type="checkbox"
//       checked={checked}
//       onChange={(event) =>
//         onChange(
//           event.target.checked
//         )
//       }
//       className="h-4 w-4 shrink-0 accent-[#6e59ff]"
//     />
//   </label>
// );

// const OverviewRow = ({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) => (
//   <div className="flex items-center justify-between rounded-lg bg-[#faf7ff] px-3 py-2.5">
//     <span className="text-[11px] text-[#91899a]">
//       {label}
//     </span>

//     <span className="max-w-[150px] truncate text-[11px] font-semibold text-[#554d5d]">
//       {value}
//     </span>
//   </div>
// );

// const ImageUploader = ({
//   title,
//   subtitle,
//   preview,
//   error,
//   onChange,
//   onRemove,
// }: {
//   title: string;
//   subtitle: string;
//   preview: string | null;
//   error?: string;
//   onChange: (
//     event: ChangeEvent<HTMLInputElement>
//   ) => void;
//   onRemove: () => void;
// }) => (
//   <div>
//     <div className="mb-2 flex items-center justify-between">
//       <div>
//         <p className="text-[12px] font-semibold text-[#5f5867]">
//           {title}
//         </p>

//         <p className="mt-0.5 text-[10px] text-[#a19aaa]">
//           {subtitle}
//         </p>
//       </div>

//       {preview && (
//         <button
//           type="button"
//           onClick={onRemove}
//           className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff0f2] text-[#e65b6e]"
//         >
//           <Trash2 size={13} />
//         </button>
//       )}
//     </div>

//     {preview ? (
//       <div className="relative overflow-hidden rounded-2xl border border-[#e6e0ef] bg-[#f7f4fb]">
//         <img
//           src={preview}
//           alt=""
//           className="aspect-[4/3] w-full object-cover"
//         />

//         <label className="absolute bottom-3 right-3 cursor-pointer rounded-lg bg-white/90 px-3 py-2 text-[10px] font-semibold text-[#6455bf] shadow">
//           Replace

//           <input
//             type="file"
//             accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
//             onChange={onChange}
//             className="hidden"
//           />
//         </label>
//       </div>
//     ) : (
//       <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#c6b4fb] bg-[linear-gradient(145deg,#fbf9ff,#f2ecff)] transition hover:border-[#a995ff]">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ece0ff] text-[#725aff]">
//           <ImagePlus size={18} />
//         </div>

//         <p className="mt-3 text-[11px] font-semibold text-[#62596c]">
//           Upload Image
//         </p>

//         <p className="mt-1 text-[10px] text-[#aaa3b2]">
//           JPG, PNG or WebP
//         </p>

//         <input
//           type="file"
//           accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
//           onChange={onChange}
//           className="hidden"
//         />
//       </label>
//     )}

//     {error && (
//       <ErrorText>
//         {error}
//       </ErrorText>
//     )}
//   </div>
// );

// export default AddProduct;