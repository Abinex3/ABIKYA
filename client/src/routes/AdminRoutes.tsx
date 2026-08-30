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
          
        </Route>
      </Route>
    </>
  );
};

export default AdminRoutes;