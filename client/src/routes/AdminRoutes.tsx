import { Route } from "react-router-dom";

import Admin from "../pages/Admin/Admin";
import AdminLogin from "../pages/Admin/AdminLogin";

import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";
import AdminLayout from "../components/admin/AdminLayout";

//Products
import Products from "../pages/Admin/Products/Products";
import AddProduct from "../pages/Admin/Products/AddProduct";
import EditProduct from "../pages/Admin/Products/EditProduct";
import ViewProduct from "../pages/Admin/Products/ViewProduct";

//Promotions
import Promotions from "../pages/Admin/Promotions/Promotions";
import AddPromotion from "../pages/Admin/Promotions/AddPromotion";
import EditPromotion from "../pages/Admin/Promotions/EditPromotion";
import ViewPromotion from "../pages/Admin/Promotions/ViewPromotion";

// Inventory
import Inventory from "../pages/Admin/Inventory/Inventory";
import InventoryDetail from "../pages/Admin/Inventory/InventoryDetail";

// Gift
import GiftMapping from "../pages/Admin/Gifts/GiftMapping";
import GiftRuleDetails from "../pages/Admin/Gifts/GiftRuleDetails";

// Categories
import Categories from "../pages/Admin/Categories/Categories"
import CategoryDetails from "../pages/Admin/Categories/CategoryDetails"
import Collections from "../pages/Admin/Collection/Collections"
import CollectionDetails from "../pages/Admin/Collection/CollectionDetails"

const AdminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<Admin />}
          />
          <Route
            path="/admin/products"
            element={<Products />}
          />

        <Route
  path="/admin/products/new"
  element={<AddProduct />}
/>

<Route
  path="/admin/products/:id/edit"
  element={<EditProduct />}
/>

<Route
  path="/admin/products/:id/view"
  element={<ViewProduct />}
/>

<Route
  path="/admin/promotions"
  element={
        <Promotions />
  }
/>

<Route
  path="/admin/promotions/new"
  element={
    <AddPromotion />
  }
/>

<Route
  path="/admin/promotions/:id/edit"
  element={
    <EditPromotion />
  }
/>

<Route
  path="/admin/promotions/:id/view"
  element={
    <ViewPromotion />
  }
/>

<Route
  path="/admin/inventory"
  element={
        <Inventory />
  }
/>

<Route
  path="/admin/inventory/:productId"
  element={
        <InventoryDetail />
  }
/>

<Route
  path="/admin/gifts"
  element={
    <GiftMapping />
  }
/>

<Route
  path="/admin/gift-mapping/new"
  element={
    <GiftRuleDetails mode="ADD" />
  }
/>

<Route
  path="/admin/gift-mapping/:id/view"
  element={
    <GiftRuleDetails mode="VIEW" />
  }
/>

<Route
  path="/admin/gift-mapping/:id/edit"
  element={
    <GiftRuleDetails mode="EDIT" />
  }
/>

<Route
  path="/admin/categories"
  element={<Categories />}
/>

<Route
  path="/admin/categories/new"
  element={
    <CategoryDetails mode="ADD" />
  }
/>

<Route
  path="/admin/categories/:id/view"
  element={
    <CategoryDetails mode="VIEW" />
  }
/>

<Route
  path="/admin/categories/:id/edit"
  element={
    <CategoryDetails mode="EDIT" />
  }
/>

<Route
  path="/admin/collections"
  element={<Collections />}
/>

<Route
  path="/admin/collections/new"
  element={
    <CollectionDetails mode="ADD" />
  }
/>

<Route
  path="/admin/collections/:id/view"
  element={
    <CollectionDetails mode="VIEW" />
  }
/>

<Route
  path="/admin/collections/:id/edit"
  element={
    <CollectionDetails mode="EDIT" />
  }
/>
          
        </Route>
      </Route>
    </>
  );
};

export default AdminRoutes;